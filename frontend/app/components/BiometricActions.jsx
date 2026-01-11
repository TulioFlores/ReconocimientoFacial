import { ScanFace, SwitchCamera } from 'lucide-react';

export default function BiometricActions() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6">
        
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all w-full sm:w-auto justify-center">
        <ScanFace size={20} />
        Authorize with Face
      </button>

      <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">
        <SwitchCamera size={18} />
        Switch Camera
      </button>

    </div>
  );
}