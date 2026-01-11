import Header from '../components/Header';
import CameraZone from '../components/CameraZone';
import InstructionPanel from '../components/InstructionPanel';
import BiometricActions from '../components/BiometricActions';
import { Lock } from 'lucide-react'; // Importamos el icono de candado directo aquí

function BiometricPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* 1. Reusamos el Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        
        {/* Título de la sección (Texto distinto al anterior) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Biometric Verification</h2>
          <p className="text-gray-500 mt-1">Please position your face within the frame for verification</p>
        </div>

        {/* Grid Principal: Mismo layout, componentes nuevos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Columna Izquierda: Cámara */}
          <section>
            <CameraZone />
          </section>

          {/* Columna Derecha: Instrucciones */}
          <section>
            <InstructionPanel />
          </section>

        </div>

        {/* Barra de Acciones Específica */}
        <BiometricActions />

        {/* Nota de seguridad (Reutilizada visualmente) */}
        <div className="text-center mt-8 flex justify-center items-center gap-2 text-gray-400 text-xs">
          <Lock size={12} />
          <p>Your biometric data is encrypted and processed securely</p>
        </div>

      </main>
    </div>
  );
}

export default BiometricPage;