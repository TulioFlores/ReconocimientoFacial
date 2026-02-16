import { Camera, UploadCloud } from 'lucide-react';

export default function IdUploader() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h2 className="text-gray-700 font-semibold mb-6">ID Scanning Zone</h2>
      
      {/* Zona punteada */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl bg-slate-50 h-80 flex flex-col items-center justify-center gap-4 hover:bg-blue-50 transition-colors cursor-pointer">
        <div className="bg-blue-100 p-4 rounded-full text-blue-600">
          <Camera size={40} />
        </div>
        
        <div className="text-center">
          <p className="font-medium text-gray-700">Upload or Scan your INE/ID</p>
          <p className="text-sm text-gray-400 mt-1">Drag and drop or click to browse</p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md shadow-blue-200">
          <UploadCloud size={18} />
          Choose File
        </button>
      </div>
    </div>
  );
}