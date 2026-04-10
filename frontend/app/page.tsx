import Hero from '../components/landing/Hero';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <main className="flex-grow">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Sección: Agiliza tus trámites */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Agiliza tus trámites
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                GobID reduce los tiempos de espera de días a segundos,
                eliminando la burocracia en tus gestiones más importantes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Accede a servicios gubernamentales sin largas filas ni
                documentación física. Tu identidad verificada al instante.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              {/* Círculo con Ícono de Reloj */}
              <div className="relative w-48 h-48 rounded-full bg-accent flex items-center justify-center shadow-sm">
                <div className="w-24 h-24 rounded-full bg-background shadow-md flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                {/* Insignia Check */}
                <div className="absolute bottom-6 right-6 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-4 border-background">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Sección: Seguridad sin precedentes */}
        <section className="py-24 bg-background border-t border-border/50">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              {/* Círculo con Ícono de Escudo */}
              <div className="relative w-48 h-48 rounded-full bg-accent flex items-center justify-center shadow-sm">
                <div className="w-24 h-24 rounded-full bg-background shadow-md flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Seguridad sin precedentes
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Nuestra tecnología biométrica asegura tu identidad con
                los más altos estándares, protegiéndote contra la suplantación.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Protocolos de encriptación de nivel militar garantizan que
                tus datos biométricos permanezcan completamente privados y seguros.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Sección: Estadísticas */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              Confianza respaldada por resultados
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
              Millones de ciudadanos confían en GobID para acceder a sus servicios
              gubernamentales de forma segura y eficiente.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-primary mb-2">2.5M+</span>
                <span className="text-sm text-muted-foreground">Usuarios verificados</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-primary mb-2">99.9%</span>
                <span className="text-sm text-muted-foreground">Precisión biométrica</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-primary mb-2">&lt;2s</span>
                <span className="text-sm text-muted-foreground">Tiempo de verificación</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-primary mb-2">24/7</span>
                <span className="text-sm text-muted-foreground">Disponibilidad</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Sección: Call to Action (CTA) */}
        <section className="py-24 bg-background">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-primary rounded-3xl p-10 md:p-16 text-center shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                ¿Listo para simplificar tu<br className="hidden md:block" /> acceso a servicios?
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-10 text-lg">
                Únete a millones de ciudadanos que ya disfrutan de una
                experiencia gubernamental moderna, segura y sin fricciones.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button className="w-full sm:w-auto px-8 py-3 bg-background text-primary font-medium rounded-lg hover:bg-muted transition-colors">
                  Crear cuenta gratuita
                </button>
                <button className="w-full sm:w-auto px-8 py-3 bg-transparent text-primary-foreground font-medium rounded-lg border border-primary-foreground/30 hover:bg-primary-foreground/10 transition-colors">
                  Ver demostración
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}