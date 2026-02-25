import { ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg leading-none">GovID Verify</h1>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">
              Identity Verification Platform
            </p>
          </div>
        </div>
        
        <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium border border-green-200 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="hidden sm:inline">Secure Session</span>
          <span className="sm:hidden">Secure</span>
        </div>
      </div>
    </header>
  );
}