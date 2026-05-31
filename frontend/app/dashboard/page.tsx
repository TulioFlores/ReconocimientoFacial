'use client'
import { FileText, CreditCard } from 'lucide-react'; // Iconos para las tarjetas
import { useRouter } from 'next/navigation';
import UserProfileCard from '../../components/dashboard/UserProfileCard';
import ServiceCard from '../../components/dashboard/ServiceCard';
import SlideOver from '../../components/dashboard/SlideOver';
import FiscalForm from '../../components/dashboard/FiscalForm';
import { useState, useEffect } from 'react';
import { apiUrl } from '@/utils/api';
interface UserData {
  full_name: string;
  curp: string;
  email: string;
  has_fiscal_data?: boolean;
  ocrCp?: string;
  ocrAddress?: string;
  confidence?: number;
  [key: string]: any;
}

export default function DashboardPage() {
const router = useRouter();
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  
  // Nuevos estados para manejar los datos del usuario
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Función para obtener los datos de la sesión actual
    const fetchUserData = async () => {
      try {
        const response = await fetch(apiUrl('/me'), {
          method: 'GET',
          // ¡ESTO ES CRUCIAL! Le dice al navegador que envíe la cookie HttpOnly
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          // Si da 401, significa que no hay cookie o expiró. Lo mandamos al login.
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Error al obtener datos del usuario');
        }

        const data = await response.json();
        setUserData(data); // Guardamos { full_name, curp, has_fiscal_data, etc. }
      } catch (error) {
        console.error("Error cargando sesión:", error);
        // Opcional: router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleGenerateGobIDCertificate = () => {
    router.push('/document?type=gobid-certificate');
  };

  const handleGenerateConstanciaFiscal = () => {
    if (userData && !userData.has_fiscal_data) {
      setIsSlideOverOpen(true);
    } else {
      router.push('/document?type=constancia-fiscal');
    }
  };
  const handleGenerateCurp = () => {
    router.push('/document?type=curp');
  };
  
  // Mostrar un loader mientras verifica la sesión
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando tu perfil...</div>;
  }

  // Si no hay datos (ej. hubo error pero no redirigió), evitamos renderizar
  if (!userData) return null;
  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-4 sticky top-6">
            <UserProfileCard user={userData}/>
          </div>

          <div className="lg:col-span-8">

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Catalogo de tramites</h1>
              <p className="text-gray-500">Acceda y gestione sus servicios gubernamentales</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <ServiceCard
                icon={FileText}
                title="Certificado registro en GobID"
                description="Obten un certificado de que usted se registro exitosamente en nuestra plataforma."
                buttonText="Generar PDF"
                variant="primary"
                onClick={handleGenerateGobIDCertificate}
              />

              <ServiceCard
                icon={FileText}
                title="CURP"
                description="Genera una una copia oficial del documento CURP."
                buttonText="Generar"
                variant="primary"
                onClick={handleGenerateCurp}
              />

              {/* Tarjeta 3: Constancia fiscal */}
              <ServiceCard
                icon={FileText}
                title="Constancia de situacion fiscal"
                description="Genera una constancia de situacion fiscal"
                buttonText="Generar"
                variant="primary"
                onClick={handleGenerateConstanciaFiscal}
              />
              <SlideOver
                isOpen={isSlideOverOpen}
                onClose={() => setIsSlideOverOpen(false)}
                title="Completa tu Perfil Fiscal"
                
              >
                <FiscalForm
                  initialCurp={userData.curp}
                  initialCp={userData.ocrCp}
                  onSubmitSuccess={() => {
                    setIsSlideOverOpen(false);
                    setUserData(prev => prev ? { ...prev, has_fiscal_data: true } : prev);
                    router.push('/document?type=constancia-fiscal');
                  }}
                />
              </SlideOver>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
