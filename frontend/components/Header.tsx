'use client'; // Necesario para usar useRouter y eventos de clic

import React from 'react';
import Logo from './Logo';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/utils/api';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Llamada al backend para borrar cookies HttpOnly
      const response = await fetch(apiUrl('/logout'), {
        method: 'POST',
        // Importante: incluir las credenciales para que el navegador 
        // envíe las cookies que el servidor debe borrar
        credentials: 'include'
      });

      if (response.ok) {
        // 2. Limpiar cualquier rastro en el cliente por si acaso
        document.cookie = "login_confidence=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // 3. Redirigir
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Opcionalmente redirigir de todos modos si falla la red
      router.push('/');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Logo />

        <div className="flex items-center gap-4">
          {/* Badge de Sesión */}
          <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium border border-green-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="hidden sm:inline">Sesión Segura</span>
            <span className="sm:hidden">Secure</span>
          </div>

          {/* Botón de Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden md:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}
