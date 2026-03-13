"use client"; // Asegúrate de tener esto si usas Next.js App Router

import { useState, useRef } from 'react';
import { Camera, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';

// Definimos la estructura de lo que esperamos recibir del backend
interface IneData {
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  curp?: string;
  clave_elector?: string;
  sexo?: string;
  fecha_nacimiento?: string;
  domicilio?: string;
  seccion?: string;
}

export default function IdUploader({ onDataExtracted }: { onDataExtracted: (data: IneData) => void }) {
const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file); 

    try {
      const response = await fetch("http://localhost:8000/api/v1/scan-ine-parsed", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al analizar la credencial");

      const data = await response.json();
      
      // ¡AQUÍ ESTÁ LA MAGIA! Mandamos los datos al componente Padre
      onDataExtracted(data); 
      
    } catch (err: any) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background p-6 rounded-xl shadow-sm border border-border h-full max-w-2xl mx-auto">
      <h2 className="text-foreground font-semibold mb-6 text-xl">Zona de escaneo de INE</h2>
      
      {/* Zona de carga (Clickable) */}
      <div 
        onClick={handleDivClick}
        className="border-2 border-dashed border-border/60 rounded-xl bg-muted/30 h-80 flex flex-col items-center justify-center gap-4 hover:bg-primary/5 transition-colors cursor-pointer relative overflow-hidden"
      >
        {/* Input oculto */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {preview ? (
          // Mostrar previsualización de la imagen
          <img src={preview} alt="INE Preview" className="absolute inset-0 w-full h-full object-contain p-2 opacity-80" />
        ) : (
          <>
            <div className="bg-primary/10 p-4 rounded-full text-primary">
              <Camera size={40} />
            </div>
            <div className="text-center z-10">
              <p className="font-medium text-foreground">Sube una foto de tu INE</p>
              <p className="text-sm text-muted-foreground mt-1">Arrastre y suelte o haga clic para explorar</p>
            </div>
          </>
        )}
      </div>

      {/* Botón de acción */}
      <div className="mt-6 flex justify-center">
        <button 
          onClick={file ? handleUpload : handleDivClick}
          disabled={loading}
          className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Analizando...</>
          ) : file ? (
            <><CheckCircle2 size={18} /> Procesar INE</>
          ) : (
            <><UploadCloud size={18} />Elige un archivo</>
          )}
        </button>
      </div>

      {/* Mostrar Errores */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

    </div>
  );
}