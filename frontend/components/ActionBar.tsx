import { ScanFace, RefreshCw, Lock } from 'lucide-react';

export default function ActionBar() {
  return (
    <div className="mt-6">
      {/* Card Blanca */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-center items-center gap-6">
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all w-full sm:w-auto justify-center">
          <ScanFace size={20} />
          Confirm & Enroll Biometrics
        </button>

        <button className="text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">
          <RefreshCw size={18} />
          Retake Photo
        </button>

      </div>

      {/* Security Note */}
      <div className="text-center mt-6 flex justify-center items-center gap-2 text-gray-400 text-xs">
        <Lock size={12} />
        <p>Your data is encrypted and protected. This session will expire in 15 minutes.</p>
      </div>
    </div>
  );
}