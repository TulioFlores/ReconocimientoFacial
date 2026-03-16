'use client'
import { useState } from 'react';
import IdUploader from '../../components/registration/IdUploader';
import ValidationForm from '../../components/registration/ValidationForm';
import ActionBar from '../../components/registration/ActionBar';
import BiometricPage from '../../components/registration/BiometricPage'; 
import FormularioConfirmacion from '../../components/registration/FormularioConfirmacion';
import { useRouter } from 'next/navigation'; 
export interface IneData {
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  curp?: string;
  clave_elector?: string;
  sexo?: string;
  fecha_nacimiento?: string;
  domicilio?: string;
  seccion?: string;
}

// 1. Definimos los 3 pasos de nuestro flujo exacto
type RegistrationStep = 'ine' | 'biometria' | 'confirmacion';

function App() {
  // --- ESTADOS ---
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('ine');
  const [extractedData, setExtractedData] = useState<IneData | null>(null); 
  const [biometricVector, setBiometricVector] = useState<number[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
// --- FUNCIONES ---
  // Esta función se ejecuta cuando el usuario pone su correo y le da "Crear Cuenta"
  const handleFinalSubmit = async (email: string) => {
    setIsSubmitting(true);
    
    try {
      // 1. Armamos el paquete EXACTAMENTE como lo espera FastAPI (EnrollmentRequest)
      const payloadFinal = {
        nombre: extractedData?.nombre || "",
        apellido_paterno: extractedData?.apellido_paterno || "",
        apellido_materno: extractedData?.apellido_materno || "",
        curp: extractedData?.curp || "",
        email: email,
        vector_facial: biometricVector || []
      };
      
      console.log("Enviando datos reales a FastAPI...", payloadFinal);
      
      // 2. Hacemos la petición HTTP real a nuestro backend de Python
      const response = await fetch('http://localhost:8000/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadFinal)
      });

      // 3. Leemos lo que nos contestó el backend
      const data = await response.json();

      // Si el backend nos mandó un error (ej. 400 o 500), lanzamos la excepción
      if (!response.ok) {
        throw new Error(data.detail || "Error desconocido en el servidor");
      }

      // ¡4. Éxito real!
      console.log("Respuesta de Supabase:", data);
      alert("¡Registro completado con éxito! ID: " + data.user_id);
      router.push('/login');

    } catch (error: any) {
      console.error("Error al registrar:", error);
      alert("Hubo un problema al registrar: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- ACTO 2: PANTALLA DE BIOMETRÍA ---
  if (currentStep === 'biometria') {
    return (
      <BiometricPage 
        onVectorSuccess={(vector: number[]) => {
          console.log("¡Vector recibido en App!", vector.length, "dimensiones");
          setBiometricVector(vector);     // Guardamos el vector
          setCurrentStep('confirmacion'); // Brincamos al último paso
        }} 
      />
    );
  }

  // --- ACTO 3: PANTALLA DE CONFIRMACIÓN Y CORREO ---
  if (currentStep === 'confirmacion') {
    // Unimos los nombres y apellidos para mostrarlos bonito en la tarjeta
    const fullName = `${extractedData?.nombre || ''} ${extractedData?.apellido_paterno || ''} ${extractedData?.apellido_materno || ''}`.trim();

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md h-[550px]">
          <FormularioConfirmacion 
            extractedData={{
              fullName: fullName || 'Nombre no detectado',
              curp: extractedData?.curp || 'CURP no detectado',
              fecha_nacimiento: extractedData?.fecha_nacimiento || 'Fecha de nacimiento no detectada'
            }} 
            isLoading={isSubmitting} 
            onSubmit={handleFinalSubmit} 
          />
        </div>
      </div>
    );
  }

  // --- ACTO 1: PANTALLA DE INE (Default) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Verificación de identidad</h2>
          <p className="text-gray-500 mt-1">Sube tu identificación oficial y verifica tu información</p>
        </div>

        {/* 
          Si no hay datos extraídos, muestra solo el cargador de INE centrado.
          Cuando se extraen los datos, muestra el cargador a la izquierda y el formulario a la derecha.
        */}
        {extractedData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <IdUploader onDataExtracted={setExtractedData} />
            <ValidationForm data={extractedData} />
          </div>
        ) : (
          <div className="flex justify-center">
            <IdUploader onDataExtracted={setExtractedData} />
          </div>
        )}

        {/* La barra de acciones solo se muestra si los datos de la INE ya fueron validados */}
        {extractedData && (
          <ActionBar onConfirm={() => setCurrentStep('biometria')} />
        )}
      </main>
    </div>
  );
}

export default App;