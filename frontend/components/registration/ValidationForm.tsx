import InputField from '../InputField';
import { IneData } from '../../app/registration/page'; // Verifica bien esta ruta

export default function ValidationForm({ data }: { data: IneData | null }) {
  
  // Preparamos todos los datos, si no hay data mostramos un string vacío
  const displayData = {
    fullName: data ? `${data.nombre || ''} ${data.apellido_paterno || ''} ${data.apellido_materno || ''}`.trim() : "",
    curp: data?.curp || "",
    address: data?.domicilio || "",
    electoralKey: data?.clave_elector || "",
    sex: data?.sexo || "",
    birthDate: data?.fecha_nacimiento || "",
    section: data?.seccion || ""
  };

  return (
    <div className="bg-background p-6 rounded-xl shadow-sm border border-border h-full">
      <h2 className="text-foreground font-semibold mb-6">Data Validation Form</h2>
      
      <div className="space-y-4">
        {/* Nombre completo ocupa toda la fila */}
        <InputField label="Full Name" value={displayData.fullName} />
        
        {/* Dirección ocupa toda la fila */}
        <InputField label="Address" value={displayData.address} />

        {/* CURP ocupa toda la fila */}
        <InputField label="CURP" value={displayData.curp} />

        {/* Agrupamos Fecha de Nacimiento y Sexo en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Date of Birth" value={displayData.birthDate} />
          <InputField label="Sex" value={displayData.sex} />
        </div>

        {/* Agrupamos Clave de Elector y Sección en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Electoral Key" value={displayData.electoralKey} />
          {/*<InputField label="Section" value={displayData.section} />*/}
        </div>
      </div>
    </div>
  );
}