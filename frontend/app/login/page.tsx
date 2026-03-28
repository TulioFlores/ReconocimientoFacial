'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CameraZone from '../../components/login/CameraZone';
import BiometricActions from '../../components/login/BiometricActions';
import { getCookie } from '@/utils/getCookie';

import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
  const router = useRouter();

  // Esta función atrapa el vector de la cámara y lo envía al endpoint de login
  const handleLoginVector = async (vector: number[]) => {
    setIsVerifying(true);
    setMessage({ type: null, text: '' });
    
    console.log("Vector de Login capturado:", vector.length, "dimensiones");
    
    try {
      // Enviamos el vector al endpoint /login/verify
      const response = await fetch('http://localhost:8000/login/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Importante para recibir y guardar la cookie
        body: JSON.stringify({
          vector_facial: vector
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Login exitoso
        console.log("Login exitoso:", data);
        setMessage({
          type: 'success',
          text: `¡Bienvenido ${data.full_name}! Confianza: ${(data.confidence * 100).toFixed(1)}%`
        });
        
        // Redirigir al dashboard después de 1.5 segundos
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        // Error en el login
        console.error("Error en login:", data);
        setMessage({
          type: 'error',
          text: data.detail || 'Error al intentar hacer login. Por favor intente de nuevo.'
        });
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setMessage({
        type: 'error',
        text: 'Error de conexión con el servidor. Asegúrese que está disponible.'
      });
    } finally {
      setIsVerifying(false);
    }
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

        {/* Mensaje de estado (éxito o error) */}
        {message.type && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle size={20} className="flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

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

          {/* Indicador de verificación */}
          {isVerifying && (
            <div className="w-full max-w-md text-center">
              <div className="flex justify-center mb-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-sm text-blue-600 font-medium">Verificando identidad...</p>
            </div>
          )}

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