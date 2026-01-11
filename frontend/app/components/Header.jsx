import { ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
           <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-lg">GovID Verify</h1>
          <p className="text-xs text-gray-500">Identity Verification Platform</p>
        </div>
      </div>
      
      <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium border border-green-200 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Secure Session
      </div>
    </header>
  );
}