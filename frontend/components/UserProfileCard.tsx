import { ShieldCheck } from 'lucide-react';

export default function UserProfileCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
      <div className="p-8 flex flex-col items-center">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 mb-4 shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-800">María González López</h2>
        
        {/* Badge de Verificación */}
        <div className="mt-4 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-medium border border-emerald-100 flex items-center gap-2">
          <ShieldCheck size={16} />
          Biometrically Verified
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-gray-100"></div>

      {/* Datos del usuario */}
      <div className="p-8 space-y-6 text-center">
        <div>
          <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">CURP</p>
          <p className="text-gray-600 font-medium font-mono">GOLM850215MDFRPR04</p>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Last Login</p>
          <p className="text-gray-600">January 3, 2026 at 9:45 AM</p>
        </div>
      </div>
    </div>
  );
}