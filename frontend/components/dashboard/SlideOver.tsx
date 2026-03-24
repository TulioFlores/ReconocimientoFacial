'use client';

import { useEffect, useState } from 'react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SlideOver({ isOpen, onClose, title, children }: SlideOverProps) {
  const [isRendered, setIsRendered] = useState(false);

  // Retraso para la animación de entrada/salida
  useEffect(() => {
    if (isOpen) setIsRendered(true);
    else setTimeout(() => setIsRendered(false), 300); // 300ms es lo que dura la transición
  }, [isOpen]);

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div 
          className={`w-screen max-w-md transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="px-4 py-6 sm:px-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={onClose}
                >
                  <span className="sr-only">Cerrar panel</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}