'use client';
import Image from 'next/image';
import Lottie from 'lottie-react';
import animationData from '../../public/animation/data copy.json';
import { useRef, useEffect } from 'react';

export default function Hero() {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.4); // Mas despacio
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero Section */}
      <main className="relative h-screen flex items-center overflow-hidden">

        {/* Contenedor de la Imagen de Fondo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png" // REEMPLAZA ESTO CON LA RUTA DE TU IMAGEN
            alt="Mujer escaneo biométrico GobID"
            fill
            className="object-cover object-right"
            priority
          />
          {/* Polarizado general de la imagen (Overlay negro suave) */}
          <div className="absolute inset-0 bg-black/70 z-[1]" />

          {/* Gradiente oscuro sutil a la izquierda para asegurar que el texto blanco se lea bien */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/30 to-transparent z-[2]" />

          {/* ANIMACIÓN DE ESCÁNER: Posicionada a la derecha sobre el rostro */}
          <div className="absolute right-0 lg:right-47 top-4/9 -translate-y-1/3 z-[3] w-[600px] h-[600px] hidden lg:block opacity-80 pointer-events-none">
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              loop={true}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Contenido de Texto y Botón */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight mb-4">
              GobID: Tu rostro, tu llave digital
            </h1>

            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 font-normal">
              Plataforma de Verificación Biométrica
            </p>

            <button className="px-8 py-4 bg-background text-primary text-lg font-medium rounded-lg shadow-lg hover:bg-muted hover:text-primary transition-colors">
              Descubre cómo funciona
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}