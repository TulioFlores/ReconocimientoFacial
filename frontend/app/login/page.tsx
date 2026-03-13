'use client'
import { useState } from 'react';
import CameraZone from '../../components/login/CameraZone';
import BiometricActions from '../../components/login/BiometricActions';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [isVerifying, setIsVerifying] = useState(false);

  // Esta función atrapa el vector de la cámara directamente en el Login
  const handleLoginVector = async (vector: number[]) => {
    setIsVerifying(true);
    console.log("Vector de Login capturado:", vector.length, "dimensiones");
    
    // TODO: Aquí mandaremos el vector a FastAPI para que busque quién eres en Supabase
    // const response = await fetch('http://localhost:8000/api/v1/login', { ... })
    
    // Simulamos la carga por ahora
    setTimeout(() => {
      setIsVerifying(false);
      alert("¡Vector capturado! Listo para comparar con la base de datos.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center pb-10">
      
      {/* Redujimos el ancho (max-w-xl) para que se vea como una tarjeta de Login */}
      <main className="max-w-xl w-full mx-auto px-4 sm:px-8 py-10">
        
        {/* Cabecera centrada */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-500 mt-2">
            Por favor, coloque su cara dentro del marco para acceder a su cuenta.
          </p>
        </div>

        {/* Contenedor central para la cámara y los botones */}
        <div className="flex flex-col items-center gap-6">
          
          {/* Zona de la cámara */}
          <div className="w-full max-w-md bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <CameraZone onVectorSuccess={handleLoginVector} />
          </div>

          {/* Tus botones de Autorizar y Cambiar Cámara */}
          <div className="w-full max-w-md">
            <BiometricActions />
          </div>

        </div>

        {/* Mensaje de seguridad */}
        <div className="text-center mt-8 flex justify-center items-center gap-2 text-gray-400 text-xs">
          <Lock size={12} />
          <p>Sus datos biométricos están encriptados y procesados de forma segura</p>
        </div>

      </main>
    </div>
  );
}