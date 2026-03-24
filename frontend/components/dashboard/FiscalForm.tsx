'use client';

import { useState } from 'react';

interface FiscalFormProps {
  initialCurp?: string; 
  initialCp?: string;   
  initialAddress?: string; 
  onSubmitSuccess: () => void;
}

export default function FiscalForm({ initialCurp = '', initialCp = '', initialAddress = '', onSubmitSuccess }: FiscalFormProps) {
  // Pre-llenamos el RFC con los primeros 10 caracteres de la CURP
  const initialRfc = initialCurp.length >= 10 ? initialCurp.substring(0, 10) : '';

  const [formData, setFormData] = useState({
    rfc: initialRfc,
    codigo_postal: initialCp,
    domicilio_fiscal: initialAddress,
    regimen_fiscal: '',
    situacion_contribuyente: '', // Lo dejamos vacío para obligar al usuario a elegir
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí harías tu petición POST a tu API para guardar en la tabla `fiscal_data`
    console.log('Guardando datos fiscales:', formData);
    
    // Simulamos un delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    onSubmitSuccess(); // Cierra el slide-over y dispara la constancia
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
      <p className="text-sm text-gray-500 mb-2">
        Para generar tu Constancia, necesitamos completar tu expediente. Hemos pre-llenado algunos datos usando tu INE.
      </p>

      {/* RFC */}
      <div>
        <label htmlFor="rfc" className="block text-sm font-medium text-gray-700">RFC (con homoclave)</label>
        <input
          type="text"
          name="rfc"
          id="rfc"
          value={formData.rfc}
          onChange={handleChange}
          required
          maxLength={13}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none"
          placeholder="Ej. GOML901231HDF"
        />
        <p className="text-xs text-gray-400 mt-1">Sugerido desde tu CURP. Agrega tu homoclave.</p>
      </div>

      {/* Código Postal */}
      <div>
        <label htmlFor="codigo_postal" className="block text-sm font-medium text-gray-700">Código Postal</label>
        <input
          type="text"
          name="codigo_postal"
          id="codigo_postal"
          value={formData.codigo_postal}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none"
        />
      </div>

      {/* Domicilio (Corregido el onChange) */}
      <div>
        <label htmlFor="domicilio_fiscal" className="block text-sm font-medium text-gray-700">Domicilio Fiscal</label>
        <textarea
          name="domicilio_fiscal"
          id="domicilio_fiscal"
          rows={3}
          value={formData.domicilio_fiscal}
          onChange={handleChange} 
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none resize-none"
        />
      </div>

      {/* Régimen Fiscal */}
      <div>
        <label htmlFor="regimen_fiscal" className="block text-sm font-medium text-gray-700">Régimen Fiscal</label>
        <select
          name="regimen_fiscal"
          id="regimen_fiscal"
          value={formData.regimen_fiscal}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border bg-white outline-none"
        >
          <option value="">Selecciona tu régimen...</option>
          <option value="Sueldos y Salarios e Ingresos Asimilados a Salarios">Sueldos y Salarios</option>
          <option value="Régimen Simplificado de Confianza (RESICO)">RESICO</option>
          <option value="Personas Físicas con Actividades Empresariales">Actividades Empresariales</option>
        </select>
      </div>

      {/* Situación del Contribuyente (NUEVO) */}
      <div>
        <label htmlFor="situacion_contribuyente" className="block text-sm font-medium text-gray-700">Situación del Contribuyente</label>
        <select
          name="situacion_contribuyente"
          id="situacion_contribuyente"
          value={formData.situacion_contribuyente}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border bg-white outline-none"
        >
          <option value="">Selecciona tu situación...</option>
          <option value="Activo">Activo</option>
          <option value="Suspendido">Suspendido</option>
          <option value="Reactivado">Reactivado</option>
        </select>
      </div>

      {/* Botón Guardar - Adaptado a tus variables globales */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
        >
          Guardar y Generar Constancia
        </button>
      </div>
    </form>
  );
}