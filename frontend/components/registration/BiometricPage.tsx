import dynamic from 'next/dynamic';
import InstructionPanel from '../../components/login/InstructionPanel';
import { Lock } from 'lucide-react';

const LivenessCapture = dynamic(
  () => import('../../components/login/LivenessCapture'),
  { ssr: false }
);

interface BiometricPageProps {
  onVectorSuccess: (vector: number[]) => void;
}

function BiometricPage({ onVectorSuccess }: BiometricPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-800">Verificación biométrica</h2>
          <p className="text-gray-500 mt-1">Sigue las instrucciones en el óvalo para capturar tu rostro automáticamente.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-center">
            <LivenessCapture onVectorSuccess={onVectorSuccess} />
          </section>
          <section>
            <InstructionPanel />
          </section>
        </div>
        <div className="text-center mt-8 flex justify-center items-center gap-2 text-gray-400 text-xs">
          <Lock size={12} />
          <p>Sus datos biométricos están encriptados y procesados ​​de forma segura</p>
        </div>

      </main>
    </div>
  );
}

export default BiometricPage;