import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero Section */}
      <main className="relative h-screen flex items-center">

        {/* Contenedor de la Imagen de Fondo */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/hero.png" // REEMPLAZA ESTO CON LA RUTA DE TU IMAGEN
            alt="Mujer escaneo biométrico GobID"
            fill
            className="object-cover object-right"
            priority
          />
          {/* Polarizado general de la imagen (Overlay negro suave) */}
          <div className="absolute inset-0 bg-black/40 z-[1]" />

          {/* Gradiente oscuro sutil a la izquierda para asegurar que el texto blanco se lea bien */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/30 to-transparent z-[2]" />
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