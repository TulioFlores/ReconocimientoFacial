'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        document.cookie = "login_confidence=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      router.push('/');
    }
  };

  const isLanding = pathname === '/';

  const renderActions = () => {
    const isDark = isLanding ? isScrolled : false;

    // Caso 1: Landing Page
    if (isLanding) {
      return (
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/login"
            className={`px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-bold rounded-xl transition-all active:scale-95 border border-transparent text-white hover:bg-white/10 hover:backdrop-blur-sm`}
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/signup"
            className={`px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-bold rounded-xl transition-all active:scale-95 border-2 border-white/20 text-white hover:bg-white/10 hover:backdrop-blur-sm`}
          >
            Registrarse
          </Link>
        </div>
      );
    }

    // Casos de Login/Signup (Ahora serán estáticos con fondo blanco)
    if (pathname === '/login' || pathname === '/signup') {
      const isLogin = pathname === '/login';
      return (
        <div className="flex items-center gap-3">
          <span className="text-sm hidden sm:inline text-slate-500">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </span>
          <Link
            href={isLogin ? '/signup' : '/login'}
            className="text-sm font-bold text-primary hover:underline"
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </Link>
        </div>
      );
    }

    // Dashboard / Protected
    return (
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold border flex items-center gap-2 shadow-sm transition-colors bg-green-50 text-green-700 border-green-200">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span>Sesión Segura</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl transition-all border active:scale-95 text-slate-600 hover:text-red-600 hover:bg-red-50 border-slate-200 hover:border-red-100"
          title="Cerrar Sesión"
        >
          <LogOut size={18} />
          <span className="hidden md:inline">Cerrar Sesión</span>
        </button>
      </div>
    );
  };

  if (!isLanding) {
    return (
      <nav className="relative w-full z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo invert={false} />
          </Link>
          {renderActions()}
        </div>
      </nav>
    );
  }

  return (
    <div className={`fixed top-0 w-full z-50 flex justify-center transition-all duration-500 ease-in-out ${isScrolled ? 'pt-4 sm:pt-6' : 'pt-0'
      }`}>
      <nav className={`transition-all duration-500 ease-in-out border shadow-lg ${isScrolled
        ? 'w-[95%] max-w-5xl rounded-full bg-slate-900/40 backdrop-blur-md border-white/10'
        : 'w-full rounded-none bg-transparent border-transparent shadow-none'
        }`}>
        <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
          }`}>
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo invert={true} />
          </Link>

          {renderActions()}
        </div>
      </nav>
    </div>
  );
}