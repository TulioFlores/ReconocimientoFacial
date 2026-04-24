import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('user_session');
  const { pathname } = request.nextUrl;

  // Si el usuario tiene sesión y trata de entrar a login o signup, redirigir al dashboard
  if (session && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si el usuario NO tiene sesión y trata de entrar al dashboard, redirigir al login
  // (Opcional, pero recomendado para proteger el dashboard)
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*'],
};
