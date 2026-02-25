import Link from 'next/link';
import Logo from '@/components/Logo'
export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo/>
        {/* Botones de Acción */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-medium border-2 border-primary text-primary bg-transparent rounded-lg hover:bg-muted transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/registration"
            className="px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Registrarse
          </Link>
        </div>

      </div>
    </nav>
  );
}