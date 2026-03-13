'use client'
import { useRef, useState, useCallback } from 'react';
import { Camera, ScanFace, RefreshCw, CheckCircle2 } from 'lucide-react';

interface CameraZoneProps {
  onVectorSuccess: (vector: number[]) => void;
}

export default function CameraZone({ onVectorSuccess }: CameraZoneProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Nuevos estados para la API
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Encender la cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
        setCapturedImage(null);
        setError(null);
        setSuccessMessage(null); // Limpiar mensajes anteriores
      }
    } catch (err) {
      setError("No se pudo acceder a la cámara. Revisa los permisos de tu navegador.");
      console.error(err);
    }
  };

  // 2. Apagar la cámara
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsStreamActive(false);
    }
  }, []);

  // 3. Tomar la foto
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(base64Image);
        stopCamera();
      }
    }
  };

  // 4. Enviar a FastAPI
  const extractVector = async () => {
    if (!capturedImage) return;
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // 1. Convertir el Base64 (capturedImage) en un archivo binario (Blob)
      const fetchResponse = await fetch(capturedImage);
      const blob = await fetchResponse.blob();

      // 2. Crear un formulario simulado (FormData) para enviar el archivo
      const formData = new FormData();
      // El nombre "file" debe coincidir EXACTAMENTE con el parámetro de FastAPI
      formData.append("file", blob, "rostro_capturado.jpg"); 

      // 3. Enviar a FastAPI
      const response = await fetch("http://localhost:8000/api/v1/extract-vector", {
        method: "POST",
        // NOTA: Cuando usamos FormData, NO debemos poner el "Content-Type". 
        // El navegador lo pone automáticamente como "multipart/form-data".
        body: formData, 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error al extraer el vector facial");
      }

      // ¡Éxito!
      console.log("Vector extraído:", data.vector);
      setSuccessMessage("¡Rostro analizado correctamente! Registro completado.");
      onVectorSuccess(data.vector);
    } catch (err: any) {
      console.error("Error en la API:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background p-4 rounded-xl shadow-sm border border-border h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-foreground font-semibold">Zona de cámara en vivo</h2>
        {isStreamActive && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
            </span>
            <span className="text-xs font-medium text-destructive">Transmisión en vivo</span>
          </div>
        )}
      </div>

      {/* Manejo de mensajes de Error y Éxito */}
      {error && (
        <div className="mb-4 p-2 bg-destructive/10 text-destructive text-sm rounded-md text-center">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 text-sm rounded-md text-center flex items-center justify-center gap-2">
          <CheckCircle2 size={16} /> {successMessage}
        </div>
      )}

      {/* Área del Video / Foto */}
      <div className="relative bg-muted/50 rounded-lg h-80 flex items-center justify-center overflow-hidden">
        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Rostro capturado" 
            className="w-full h-full object-cover transform -scale-x-100" 
          />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover transform -scale-x-100 ${isStreamActive ? 'opacity-100' : 'opacity-0 absolute'}`}
          />
        )}

        {!isStreamActive && !capturedImage && (
          <div className="flex flex-col items-center z-0">
            <div className="text-muted-foreground bg-muted p-6 rounded-full opacity-50 mb-4">
               <Camera size={48} />
            </div>
            <p className="text-muted-foreground text-sm">La cámara está apagada</p>
          </div>
        )}

        {isStreamActive && !capturedImage && (
          <div className="absolute w-full h-1 bg-primary/30 top-10 animate-scan z-10 pointer-events-none"></div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controles de la cámara */}
      <div className="mt-6 flex gap-3 px-2">
        {!isStreamActive && !capturedImage && (
          <button 
            onClick={startCamera} 
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium transition-opacity hover:opacity-90 flex justify-center items-center gap-2"
          >
            <Camera size={18} /> Encender Cámara
          </button>
        )}

        {isStreamActive && (
          <button 
            onClick={capturePhoto} 
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium transition-opacity hover:opacity-90 shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
          >
            <ScanFace size={18} /> Capturar Rostro
          </button>
        )}

        {capturedImage && (
          <>
            <button 
              onClick={startCamera}
              disabled={isLoading}
              className="flex-1 bg-muted text-foreground hover:bg-muted/80 py-2.5 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={18} /> Repetir
            </button>
            <button 
              onClick={extractVector}
              disabled={isLoading}
              className="flex-[2] bg-primary text-primary-foreground hover:opacity-90 py-2.5 rounded-lg font-medium shadow-lg shadow-primary/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? "Procesando IA..." : <><ScanFace size={18} /> Usar esta foto</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}