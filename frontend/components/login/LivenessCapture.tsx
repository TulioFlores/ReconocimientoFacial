import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiUrl } from '@/utils/api';

export default function LivenessCapture({ onVectorSuccess }: { onVectorSuccess: (vector: number[]) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [fase, setFaseState] = useState('apagado'); // 'apagado' -> 'cargando' -> 'centrar' -> 'acercar' -> 'capturando' -> 'completado'
    const [mensaje, setMensaje] = useState('Presiona el botón para iniciar la verificación');
    const [isStreamActive, setIsStreamActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const faseRef = useRef('apagado');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const setFase = (nuevaFase: string) => {
        faseRef.current = nuevaFase;
        setFaseState(nuevaFase);
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsStreamActive(false);
    };

    const startCamera = async () => {
        setFase('cargando');
        setMensaje('Iniciando cámara e IA...');
        setError(null);

        try {
            // 1. Cargar modelos si no están cargados (face-api suele cachearlos)
            if (!faceapi.nets.tinyFaceDetector.params) {
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            }

            // 2. Encender la cámara
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setIsStreamActive(true);
            setFase('centrar');
            setMensaje('Coloca tu rostro en el centro del óvalo');
        } catch (err) {
            console.error("Error al iniciar cámara:", err);
            setError("No se pudo acceder a la cámara. Por favor, revisa los permisos.");
            setFase('apagado');
        }
    };

    // Al desmontar, apagar todo
    useEffect(() => {
        return () => stopCamera();
    }, []);

    const handleVideoPlay = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(async () => {
            const currentFase = faseRef.current;

            // Si ya estamos capturando o completado, no hacer nada más en el bucle
            if (['capturando', 'completado', 'apagado', 'cargando'].includes(currentFase) || !videoRef.current) {
                return;
            }

            const detection = await faceapi.detectSingleFace(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks();

            if (!detection) {
                if (currentFase !== 'centrar') {
                    setFase('centrar');
                    setMensaje('Rostro perdido. Vuelve al centro');
                }
                return;
            }

            const box = detection.detection.box;
            const videoW = videoRef.current.videoWidth || 640;
            const videoH = videoRef.current.videoHeight || 480;
            const faceCenterX = box.x + box.width / 2;
            const faceCenterY = box.y + box.height / 2;

            // REGLA 1: CENTRAR
            if (currentFase === 'centrar') {
                if (
                    box.width > 80 &&
                    faceCenterX > videoW * 0.3 && faceCenterX < videoW * 0.7 &&
                    faceCenterY > videoH * 0.2 && faceCenterY < videoH * 0.8
                ) {
                    setFase('acercar');
                    setMensaje('¡Bien! Ahora acércate un poco más');
                }
            }
            // REGLA 2: ACERCAR Y CAPTURAR AUTOMÁTICAMENTE
            else if (currentFase === 'acercar') {
                if (box.width > 170) { // Umbral de cercanía
                    setFase('capturando');
                    setMensaje('¡Perfecto! Mantente quieto...');

                    // Detener el intervalo antes de capturar para evitar múltiples disparos
                    if (intervalRef.current) clearInterval(intervalRef.current);

                    setTimeout(() => {
                        tomarFotoYExtraerVector();
                    }, 500); // Pequeña pausa para estabilizar
                }
            }
        }, 200);
    };

    const tomarFotoYExtraerVector = async () => {
        if (!videoRef.current) return;
        setIsLoading(true);

        try {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                // Efecto espejo para coincidir con la preview
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            }

            const base64Image = canvas.toDataURL('image/jpeg', 0.9);

            // 1. Convertir a Blob para el FormData
            const fetchRes = await fetch(base64Image);
            const blob = await fetchRes.blob();
            const formData = new FormData();
            formData.append("file", blob, "face.jpg");

            // 2. Llamada a la API
            const response = await fetch(apiUrl('/api/v1/extract-vector'), {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al analizar rostro");
            }

            const data = await response.json();

            setFase('completado');
            setMensaje('¡Verificación exitosa!');
            stopCamera();

            // 3. Notificar éxito al padre
            onVectorSuccess(data.vector);

        } catch (err: any) {
            console.error("Error en captura/extracción:", err);
            setError(err.message || "Error al procesar la imagen");
            setFase('centrar'); // Permitir reintentar
            setMensaje('Error al procesar. Intenta centrarte de nuevo');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-sm mx-auto">
            {/* Header / Mensajes */}
            <div className="mb-6 text-center w-full">
                <h3 className={`text-lg font-bold min-h-[50px] flex items-center justify-center px-4 rounded-lg transition-colors ${error ? 'text-red-600 bg-red-50' : 'text-slate-800'
                    }`}>
                    {isLoading ? (
                        <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Procesando biometría...</span>
                    ) : error ? (
                        <span className="flex items-center gap-2 text-sm"><AlertCircle size={18} /> {error}</span>
                    ) : (
                        mensaje
                    )}
                </h3>
            </div>

            {/* Zona de Cámara / Óvalo */}
            <div className="relative group">
                <div className={`relative w-[280px] h-[360px] overflow-hidden rounded-[140px] border-4 transition-all duration-500 shadow-2xl bg-slate-900 ${fase === 'acercar' ? 'border-blue-400 scale-[1.02]' :
                    fase === 'capturando' ? 'border-yellow-400 animate-pulse' :
                        fase === 'completado' ? 'border-green-500' : 'border-slate-200'
                    }`}>
                    {/* El video siempre debe estar presente para que la ref no sea null y se pueda asignar el stream */}
                    <video
                        ref={videoRef}
                        onPlay={handleVideoPlay}
                        autoPlay
                        muted
                        playsInline
                        className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-500 ${isStreamActive ? 'opacity-100' : 'opacity-0 absolute'}`}
                    />

                    {!isStreamActive && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 p-8 text-center z-10">
                            <div className="bg-slate-800 p-6 rounded-full">
                                <Camera size={48} className="opacity-20" />
                            </div>
                            <p className="text-xs font-medium uppercase tracking-wider opacity-40">Cámara Desactivada</p>
                        </div>
                    )}

                    {/* Overlay de Carga */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-20">
                            <Loader2 size={40} className="text-white animate-spin" />
                        </div>
                    )}
                </div>

                {/* Guía Visual (Óvalo transparente dentro) */}
                {isStreamActive && !isLoading && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className={`w-[240px] h-[320px] rounded-[120px] border-2 border-dashed transition-opacity duration-300 ${fase === 'acercar' ? 'border-blue-400/50 opacity-100' : 'border-white/20 opacity-40'
                            }`} />
                    </div>
                )}
            </div>

            {/* Botonera */}
            <div className="mt-8 w-full px-4">
                {!isStreamActive && !isLoading && (
                    <button
                        onClick={startCamera}
                        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <Camera size={22} />
                        {error ? 'Reintentar Cámara' : 'Iniciar Escaneo'}
                    </button>
                )}

                {isStreamActive && (
                    <button
                        onClick={stopCamera}
                        disabled={isLoading}
                        className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </div>
    );
}
