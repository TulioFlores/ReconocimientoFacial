import { CheckCircle2, Video } from 'lucide-react';

export default function InstructionPanel() {
  const instructions = [
    "Remove glasses",
    "Look straight ahead",
    "Ensure good lighting"
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Panel de Instrucciones */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-gray-700 font-semibold mb-4">Instructions</h2>
        
        <div className="space-y-3">
          {instructions.map((item, index) => (
            <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <CheckCircle2 size={20} className="text-green-500" />
              <span className="text-gray-700 text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Caja de Estado (Azul) */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-start gap-4">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
            <Video size={20} />
        </div>
        <div>
            <h3 className="text-blue-700 font-semibold text-sm">Status</h3>
            <p className="text-blue-500 text-sm mt-1">Face detected - Ready to proceed</p>
        </div>
      </div>
    </div>
  );
}