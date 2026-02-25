import CameraZone from '../../components/login/CameraZone';
import InstructionPanel from '../../components/login/InstructionPanel';
import BiometricActions from '../../components/login/BiometricActions';
import { Lock } from 'lucide-react';

function BiometricPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Biometric Verification</h2>
          <p className="text-gray-500 mt-1">Please position your face within the frame for verification</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <CameraZone />
          </section>
          <section>
            <InstructionPanel/>
          </section>

        </div>
        <BiometricActions />
        <div className="text-center mt-8 flex justify-center items-center gap-2 text-gray-400 text-xs">
          <Lock size={12} />
          <p>Your biometric data is encrypted and processed securely</p>
        </div>

      </main>
    </div>
  );
}

export default BiometricPage;