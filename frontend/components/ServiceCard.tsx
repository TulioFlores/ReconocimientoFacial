import React, { ElementType } from 'react';

interface ServiceCardProps {
  // ElementType es el tipo ideal para componentes que se pasan como props
  icon: ElementType; 
  title: string;
  description: string;
  buttonText: string;
  // Limitamos las variantes a los strings específicos permitidos
  variant?: "primary" | "secondary";
  // Opcional: callback para el click del botón
  onClick?: () => void;
}

export default function ServiceCard({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  variant = "primary",
  onClick
}: ServiceCardProps) {
  
  // Estilos base para el botón
  const baseButtonStyles = "w-full py-2.5 rounded-lg font-medium transition-all text-sm";
  
  // Variantes de estilo con lógica de Tailwind
  const buttonStyles = variant === "primary" 
    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200" 
    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Contenedor del Icono */}
      <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
        <Icon size={24} />
      </div>

      <h3 className="text-gray-800 font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 grow">
        {description}
      </p>

      <button 
        onClick={onClick}
        className={`${baseButtonStyles} ${buttonStyles}`}
      >
        {buttonText}
      </button>
    </div>
  );
}