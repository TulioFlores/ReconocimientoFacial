'use client';
import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

// Función para calcular el Aspect Ratio del Ojo (EAR) para detectar parpadeo
const calculateEAR = (eye: any[]) => {
    // Euclidean distance
    const dist = (p1: any, p2: any) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    // Distancias verticales
    const v1 = dist(eye[1], eye[5]);
    const v2 = dist(eye[2], eye[4]);

    // Distancia horizontal
    const h = dist(eye[0], eye[3]);

    return (v1 + v2) / (2.0 * h);
};

export default function LivenessCapture({ onCaptureSuccess }: { onCaptureSuccess: (image: string) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    // Fases: 'cargando' -> 'centrar' -> 'acercar' -> 'parpadear' -> 'completado'
    const [fase, setFaseState] = useState('cargando');
    const [mensaje, setMensaje] = useState('Cargando modelos de IA...');
    
    // Usar useRef para tener la referencia actual dentro del setInterval
    const faseRef = useRef('cargando');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Controles para contador de parpadeos
    const blinkCountRef = useRef(0);
    const isEyeClosedRef = useRef(false);

    const setFase = (nuevaFase: string) => {
        faseRef.current = nuevaFase;
        setFaseState(nuevaFase);
    };

    useEffect(() => {
        let stream: MediaStream | null = null;
        
        const loadModelsAndStart = async () => {
            try {
                // 1. Cargar modelos desde la carpeta public/models
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

                // 2. Encender la cámara
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setFase('centrar');
                setMensaje('Coloca tu rostro en el centro');
            } catch (error) {
                console.error("Error cargando la IA o cámara:", error);
                setMensaje('Asegúrese de dar permisos a la cámara');
            }
        };

        loadModelsAndStart();

        // 4. Limpiar los eventos de la cámara al cerrar
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // 3. El Bucle de Validación (Se ejecuta cada 100ms para mayor precisión de parpadeo)
    const handleVideoPlay = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(async () => {
            const currentFase = faseRef.current;
            if (currentFase === 'completado' || !videoRef.current) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }

            const detection = await faceapi.detectSingleFace(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks();

            if (!detection) return;

            const box = detection.detection.box; // { x, y, width, height }
            const landmarks = detection.landmarks;

            // REGLA 1: CENTRAR (Validar la posición de detección)
            if (currentFase === 'centrar') {
                const videoW = videoRef.current.videoWidth || 640;
                const videoH = videoRef.current.videoHeight || 480;
                
                const faceCenterX = box.x + box.width / 2;
                const faceCenterY = box.y + box.height / 2;

                // Validación dinámica del centro (para pantallas de diferentes resoluciones)
                if (
                    box.width > 90 &&
                    faceCenterX > videoW * 0.25 && faceCenterX < videoW * 0.75 &&
                    faceCenterY > videoH * 0.1 && faceCenterY < videoH * 0.9
                ) {
                    setFase('acercar');
                    setMensaje('Bien. Ahora acércate un poco más a la cámara');
                }
            }

            // REGLA 2: ACERCARSE (Validar Tamaño que abarque la pantalla)
            else if (currentFase === 'acercar') {
                if (box.width > 180) { // Mayor ancho denota cercanía
                    setFase('parpadear');
                    blinkCountRef.current = 0;
                    isEyeClosedRef.current = false;
                    setMensaje('Parpadea 5 veces para confirmar (0/5)');
                }
            }

            // REGLA 3: PARPADEAR y CONTAR (Validar EAR)
            else if (currentFase === 'parpadear') {
                const leftEye = landmarks.getLeftEye();
                const rightEye = landmarks.getRightEye();

                const leftEAR = calculateEAR(leftEye);
                const rightEAR = calculateEAR(rightEye);
                const averageEAR = (leftEAR + rightEAR) / 2;

                // Si el EAR baja de 0.28, los ojos se cerraron
                if (averageEAR < 0.28) {
                    // Solo registrar como parpadeo si venían de estar abiertos
                    if (!isEyeClosedRef.current) {
                        isEyeClosedRef.current = true;
                        blinkCountRef.current += 1;
                        
                        if (blinkCountRef.current < 5) {
                            setMensaje(`Parpadea 5 veces para confirmar (${blinkCountRef.current}/5)`);
                        }
                    }
                } else {
                    // Si sube el EAR es porque los ojos se abrieron
                    isEyeClosedRef.current = false;
                }

                // Si alcanzó la meta
                if (blinkCountRef.current >= 5) {
                    setFase('completado');
                    setMensaje('¡Validación exitosa! Capturando...');

                    // Tomar la foto
                    tomarFotoYEnviar();
                }
            }
        }, 100);
    };

    const tomarFotoYEnviar = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Aplicar espejo real a la imagen base64 para que guarde como se veía la preview en la web
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        }

        const base64Image = canvas.toDataURL('image/jpeg');
        onCaptureSuccess(base64Image); // Mandas la foto al proceso principal
        
        // Apagar la cámara después de enviar la foto
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div className="relative w-full max-w-sm mx-auto flex flex-col items-center">
            {/* Mensaje de instrucciones */}
            <h3 className="text-center text-xl font-bold mb-4 min-h-[60px] flex items-center justify-center text-gray-800 dark:text-white">
                {mensaje}
            </h3>

            <div className="relative w-[260px] h-[340px] overflow-hidden rounded-[50%] border-4 border-green-500 shadow-2xl bg-black">
                <video
                    ref={videoRef}
                    onPlay={handleVideoPlay}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]" /* scale-x-[-1] hace el efecto espejo a la vista de render */
                />
            </div>
        </div>
    );
}