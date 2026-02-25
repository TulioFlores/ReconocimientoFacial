import { Camera, UploadCloud } from 'lucide-react';

export default function IdUploader() {
  return (
    <div className="bg-background p-6 rounded-xl shadow-sm border border-border h-full">
      <h2 className="text-foreground font-semibold mb-6">ID Scanning Zone</h2>
      
      {/* Zona punteada */}
      <div className="border-2 border-dashed border-border/60 rounded-xl bg-muted/30 h-80 flex flex-col items-center justify-center gap-4 hover:bg-primary/5 transition-colors cursor-pointer">
        
        {/* Ícono de cámara */}
        <div className="bg-primary/10 p-4 rounded-full text-primary">
          <Camera size={40} />
        </div>
        
        {/* Textos */}
        <div className="text-center">
          <p className="font-medium text-foreground">Upload or Scan your INE/ID</p>
          <p className="text-sm text-muted-foreground mt-1">Drag and drop or click to browse</p>
        </div>

        {/* Botón */}
        <button className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md shadow-primary/20">
          <UploadCloud size={18} />
          Choose File
        </button>

      </div>
    </div>
  );
}