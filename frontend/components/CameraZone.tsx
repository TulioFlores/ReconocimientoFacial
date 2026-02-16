import { Camera, ScanFace } from 'lucide-react';

export default function CameraZone() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-gray-700 font-semibold">Live Camera Zone</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-medium text-red-500">Live Feed</span>
        </div>
      </div>

      {/* Simulación del Video Feed */}
      <div className="relative bg-slate-900 rounded-lg h-80 flex items-center justify-center overflow-hidden">
        
        {/* Círculo Guía (El aro verde) */}
        <div className="absolute w-48 h-48 border-4 border-green-500 rounded-full opacity-80 shadow-[0_0_20px_rgba(34,197,94,0.5)] z-10"></div>
        
        {/* Icono central simulando al usuario */}
        <div className="text-slate-700 bg-slate-800 p-6 rounded-full opacity-50">
           <Camera size={48} />
        </div>

        {/* Texto de overlay */}
        <div className="absolute top-1/2 mt-12 text-center z-20">
            <p className="text-slate-400 text-xs mt-8">Camera Preview</p>
            <p className="text-slate-600 text-[10px]">(Demo Mode)</p>
        </div>
        
        {/* Efecto de escaneo (Opcional visual) */}
        <div className="absolute w-full h-1 bg-green-500/30 top-10 animate-scan"></div>
      </div>
    </div>
  );
}