'use client'
import CameraZone from '../../components/login/CameraZone';
import InstructionPanel from '../../components/login/InstructionPanel';
import BiometricActions from '../../components/login/BiometricActions';
import { Lock } from 'lucide-react';
interface BiometricPageProps {
  onVectorSuccess: (vector: number[]) => void;
}
function BiometricPage({ onVectorSuccess }: BiometricPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Verificación biometrica</h2>
          <p className="text-gray-500 mt-1">Por favor, coloque su cara dentro del marco para verificación.
</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <CameraZone onVectorSuccess={onVectorSuccess} />
          </section>
          <section>
            <InstructionPanel/>
          </section>

        </div>
        <BiometricActions />
        <div className="text-center mt-8 flex justify-center items-center gap-2 text-gray-400 text-xs">
          <Lock size={12} />
          <p>Sus datos biométricos están encriptados y procesados ​​de forma segura</p>
        </div>

      </main>
    </div>
  );
}

export default BiometricPage;