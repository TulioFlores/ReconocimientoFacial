'use client'
import { FileText, CreditCard } from 'lucide-react'; // Iconos para las tarjetas
import { useRouter } from 'next/navigation';
import UserProfileCard from '../../components/dashboard/UserProfileCard';
import ServiceCard from '../../components/dashboard/ServiceCard';

export default function DashboardPage() {
  const router = useRouter();

  const handleGenerateGobIDCertificate = () => {
    router.push('/document?type=gobid-certificate');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        
        {/* Layout Asimétrico: 1 Columna Izquierda (Perfil) + 2 Columnas Derecha (Contenido) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: Perfil (Ocupa 4 de 12 espacios) */}
          <div className="lg:col-span-4 sticky top-6">
            <UserProfileCard />
          </div>

          {/* COLUMNA DERECHA: Catálogo (Ocupa 8 de 12 espacios) */}
          <div className="lg:col-span-8">
            
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Catalogo de tramites</h1>
              <p className="text-gray-500">Acceda y gestione sus servicios gubernamentales</p>
            </div>

            {/* Grid interno para las tarjetas de servicios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tarjeta 1: GobID Certificate */}
              <ServiceCard 
                icon={FileText}
                title="Certificado registro en GobID"
                description="Obten un certificado de que usted se registro exitosamente en nuestra plataforma."
                buttonText="Generar PDF"
                variant="primary"
                onClick={handleGenerateGobIDCertificate}
              />

              {/* Tarjeta 2: CURP */}
              <ServiceCard 
                icon={FileText}
                title="CURP"
                description="Genera una una copia oficial de el documento CURP."
                buttonText="Generar"
                variant="primary"
              />
              
              {/* Tarjeta 3: Constancia fiscal */}
              <ServiceCard 
                icon={FileText}
                title="Constancia de situacion fiscal"
                description="Genera una constancia de situacion fiscal"
                buttonText="Generar"
                variant="primary"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}