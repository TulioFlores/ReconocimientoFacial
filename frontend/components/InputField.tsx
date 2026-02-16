import React from 'react';

// Definimos la interfaz para las propiedades del componente
interface InputFieldProps {
  label: string;
  value: string | number; // Aceptamos string o número para mayor flexibilidad
  readOnly?: boolean;     // El signo '?' indica que es opcional
}

export default function InputField({ 
  label, 
  value, 
  readOnly = true 
}: InputFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-gray-500 text-sm font-medium mb-1.5">
        {label}
      </label>
      <input 
        type="text" 
        value={value} 
        readOnly={readOnly}
        className="w-full bg-gray-100 text-gray-700 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}