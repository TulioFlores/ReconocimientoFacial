"use client";

import { useState, useRef } from 'react';
import { Camera, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
import { IneData } from '../../app/registration/page';

export default function IdUploader({ onDataExtracted }: { onDataExtracted: (data: IneData) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleDivClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      setIsSuccess(false);
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

      onDataExtracted(data); 
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    // CAMBIO 1: Se quitó max-w-2xl mx-auto y se agregó w-full flex flex-col para igualar a ValidationForm
    <div className="bg-background p-6 rounded-xl shadow-sm border border-border h-full w-full flex flex-col">
      <h2 className="text-foreground font-semibold mb-6 text-xl">Zona de escaneo de INE</h2>
      
      {/* CAMBIO 2: flex-grow y min-h para que tome el alto restante si está junto al otro formulario */}
      <div 
        onClick={(!loading && !isSuccess) ? handleDivClick : undefined}
        className={`flex-grow border-2 border-dashed rounded-xl bg-muted/30 min-h-[320px] flex flex-col items-center justify-center gap-4 relative overflow-hidden transition-colors
          ${(!loading && !isSuccess) 
            ? "border-border/60 hover:bg-primary/5 cursor-pointer" // Estado normal/clickeable
            : "border-border/30 opacity-70 cursor-default" // Estado bloqueado (cargando o éxito)
          }
        `}
      >
        {/* Input oculto */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
          disabled={loading || isSuccess}
        />

        {preview ? (
          // Mostrar previsualización de la imagen
          <img src={preview} alt="INE Preview" className="absolute inset-0 w-full h-full object-contain p-2 opacity-80" />
        ) : (
          <>
            <div className="bg-primary/10 p-4 rounded-full text-primary">
              <Camera size={40} />
            </div>
            <div className="text-center z-10 px-4">
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
          disabled={loading || isSuccess} // <-- Se deshabilita si está cargando O si ya tuvo éxito
          className={`w-full sm:w-auto px-8 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-md disabled:cursor-not-allowed
            ${isSuccess 
              ? "bg-green-600 text-white disabled:opacity-100" // Estilo de éxito (verde)
              : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20 disabled:opacity-50" // Estilo normal
            }
          `}
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Analizando...</>
          ) : isSuccess ? (
            <><CheckCircle2 size={18} /> ¡Analizado con éxito!</> // <-- Mensaje de éxito
          ) : file ? (
            <><CheckCircle2 size={18} /> Procesar INE</>
          ) : (
            <><UploadCloud size={18} /> Elige un archivo</>
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