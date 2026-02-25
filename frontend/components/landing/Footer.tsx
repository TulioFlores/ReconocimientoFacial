import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        
        {/* Sección Izquierda: Logo y Copyright */}
        <div className="flex items-center gap-3">
          {/* Ícono de GobID (Mismo del Navbar pero un poco más pequeño) */}
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-5 h-5"
            >
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm text-muted-foreground">
            © 2026 GobID. Todos los derechos reservados.
          </span>
        </div>

        {/* Sección Derecha: Enlaces */}
        <nav className="flex items-center gap-6">
          <Link 
            href="/privacidad" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Política de Privacidad
          </Link>
          <Link 
            href="/terminos" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Términos de Servicio
          </Link>
          <Link 
            href="/contacto" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Contacto
          </Link>
        </nav>

      </div>
    </footer>
  );
}