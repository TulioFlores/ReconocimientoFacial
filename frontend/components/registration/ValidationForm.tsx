import InputField from '../InputField';
import { IneData } from '../../app/registration/page';

export default function ValidationForm({ data }: { data: IneData }) {
  
  // Prepara los datos para mostrarlos, usando un string vacío como fallback si una propiedad no existe.
  const displayData = {
    fullName: `${data.nombre || ''} ${data.apellido_paterno || ''} ${data.apellido_materno || ''}`.trim(),
    curp: data.curp || "",
    address: data.domicilio || "",
    electoralKey: data.clave_elector || "",
    sex: data.sexo || "",
    birthDate: data.fecha_nacimiento || ""
  };

  return (
    <div className="bg-background p-6 rounded-xl shadow-sm border border-border h-full">
      <h2 className="text-foreground font-semibold mb-6">Formulario de validación de datos</h2>
      
      <div className="space-y-4">
        {/* Nombre completo ocupa toda la fila */}
        <InputField label="Nombre completo" value={displayData.fullName} />
        
        {/* Dirección ocupa toda la fila */}
        <InputField label="Dirección" value={displayData.address} />

        {/* CURP ocupa toda la fila */}
        <InputField label="CURP" value={displayData.curp} />

        {/* Agrupamos Fecha de Nacimiento y Sexo en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Fecha de nacimiento" value={displayData.birthDate} />
          <InputField label="Sexo" value={displayData.sex} />
        </div>

        {/* Agrupamos Clave de Elector y Sección en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Clave de elector" value={displayData.electoralKey} />
          {/*<InputField label="Section" value={displayData.section} />*/}
        </div>
      </div>
    </div>
  );
}