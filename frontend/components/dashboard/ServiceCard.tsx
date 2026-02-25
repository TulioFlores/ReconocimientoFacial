import React, { ElementType } from 'react';

interface ServiceCardProps {
  icon: ElementType; 
  title: string;
  description: string;
  buttonText: string;
  variant?: "primary" | "secondary";
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
  
  // Variantes de estilo utilizando variables globales
  const buttonStyles = variant === "primary" 
    ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20" 
    : "bg-background text-foreground border border-border hover:bg-muted";

  return (
    <div className="bg-background p-6 rounded-xl shadow-sm border border-border flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Contenedor del Icono */}
      <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-4">
        <Icon size={24} />
      </div>

      <h3 className="text-foreground font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 grow">
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