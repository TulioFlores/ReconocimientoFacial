'use client';

import { useState } from 'react';

interface FiscalFormProps {
  initialCurp?: string; 
  initialCp?: string;   
  // initialAddress?: string; // Lo puedes mantener si lo necesitas, pero ahora se usarán campos separados
  onSubmitSuccess: () => void;
}

export default function FiscalForm({ initialCurp = '', initialCp = '', onSubmitSuccess }: FiscalFormProps) {
  // Pre-llenamos el RFC con los primeros 10 caracteres de la CURP
  const initialRfc = initialCurp.length >= 10 ? initialCurp.substring(0, 10) : '';

  // Actualizamos el estado para coincidir con la estructura de la tabla de la base de datos
  const [formData, setFormData] = useState({
    rfc: initialRfc,
    codigo_postal: initialCp,
    tipo_vialidad: '',
    nombre_vialidad: '',
    numero_exterior: '',
    numero_interior: '',
    colonia: '',
    localidad: '',
    municipio: '',
    entidad_federativa: '',
    entre_calle_1: '',
    entre_calle_2: '',
    regimen_fiscal: '',
    situacion_contribuyente: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/fiscal/guardar', { // Ajusta tu URL base
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Enviamos el estado de React directo
      });

      if (!response.ok) {
        throw new Error('Error al guardar los datos');
      }

      const result = await response.json();
      console.log('Respuesta del servidor:', result);
      
      onSubmitSuccess(); // Cierra el slide-over
    } catch (error) {
      console.error('Hubo un problema:', error);
      // Aquí podrías mostrar una alerta de error al usuario
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
      <p className="text-sm text-gray-500 mb-2">
        Para generar tu Constancia, necesitamos completar tu expediente. Hemos pre-llenado algunos datos usando tu INE.
      </p>

      {/* Datos Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
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
      </div>

      <hr className="border-gray-200" />
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Domicilio Fiscal</h3>

      {/* Vialidad y Números */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label htmlFor="tipo_vialidad" className="block text-sm font-medium text-gray-700">Tipo de Vialidad</label>
          <input
            type="text"
            name="tipo_vialidad"
            id="tipo_vialidad"
            value={formData.tipo_vialidad}
            onChange={handleChange}
            required
            placeholder="Ej. Calle, Avenida"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="nombre_vialidad" className="block text-sm font-medium text-gray-700">Nombre de Vialidad</label>
          <input
            type="text"
            name="nombre_vialidad"
            id="nombre_vialidad"
            value={formData.nombre_vialidad}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none"
          />
        </div>
        <div>
          <label htmlFor="numero_exterior" className="block text-sm font-medium text-gray-700">No. Exterior</label>
          <input
            type="text"
            name="numero_exterior"
            id="numero_exterior"
            value={formData.numero_exterior}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none"
          />
        </div>
        <div>
          <label htmlFor="numero_interior" className="block text-sm font-medium text-gray-700">No. Interior</label>
          <input
            type="text"
            name="numero_interior"
            id="numero_interior"
            value={formData.numero_interior}
            onChange={handleChange}
            placeholder="Opcional"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none"
          />
        </div>
      </div>

      {/* Ubicación Geográfica */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="colonia" className="block text-sm font-medium text-gray-700">Colonia</label>
          <input
            type="text"
            name="colonia"
            id="colonia"
            value={formData.colonia}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none"
          />
        </div>
        <div>
          <label htmlFor="localidad" className="block text-sm font-medium text-gray-700">Localidad</label>
          <input
            type="text"
            name="localidad"
            id="localidad"
            value={formData.localidad}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none"
          />
        </div>
        <div>
          <label htmlFor="municipio" className="block text-sm font-medium text-gray-700">Municipio o Alcaldía</label>
          <input
            type="text"
            name="municipio"
            id="municipio"
            value={formData.municipio}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none"
          />
        </div>
        <div>
          <label htmlFor="entidad_federativa" className="block text-sm font-medium text-gray-700">Entidad Federativa</label>
          <input
            type="text"
            name="entidad_federativa"
            id="entidad_federativa"
            value={formData.entidad_federativa}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none"
          />
        </div>
      </div>

      {/* Entre Calles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="entre_calle_1" className="block text-sm font-medium text-gray-700">Entre Calle 1</label>
          <input
            type="text"
            name="entre_calle_1"
            id="entre_calle_1"
            value={formData.entre_calle_1}
            onChange={handleChange}
            placeholder="Opcional"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none"
          />
        </div>
        <div>
          <label htmlFor="entre_calle_2" className="block text-sm font-medium text-gray-700">Entre Calle 2</label>
          <input
            type="text"
            name="entre_calle_2"
            id="entre_calle_2"
            value={formData.entre_calle_2}
            onChange={handleChange}
            placeholder="Opcional"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border outline-none"
          />
        </div>
      </div>

      <hr className="border-gray-200" />
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Datos Fiscales</h3>

      {/* Régimen y Situación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      {/* Botón Guardar */}
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