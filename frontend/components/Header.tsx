import React from 'react';
import Logo from './Logo';
export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Logo/>
        <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium border border-green-200 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="hidden sm:inline">Sesion Segura</span>
          <span className="sm:hidden">Secure</span>
        </div>
      </div>
    </header>
  );
}