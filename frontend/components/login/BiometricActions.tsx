import { ScanFace, SwitchCamera } from 'lucide-react';

export default function BiometricActions() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6">
        
      <button className="bg-primary hover:opacity-90 text-primary-foreground px-8 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all w-full sm:w-auto justify-center">
        <ScanFace size={20} />
        Authorize with Face
      </button>

      <button className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors">
        <SwitchCamera size={18} />
        Switch Camera
      </button>

    </div>
  );
}