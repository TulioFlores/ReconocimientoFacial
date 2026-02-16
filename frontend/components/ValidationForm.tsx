import InputField from './InputField';

export default function ValidationForm() {
  // Estos datos vendrían de tu OCR más adelante
  const mockData = {
    curp: "MEXJ850915HDFLRNO2",
    fullName: "Juan Carlos Méndez López",
    address: "Av. Reforma 123, Col. Centro, CDMX",
    electoralKey: "MEXJCL8509151234H500"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h2 className="text-gray-700 font-semibold mb-6">Data Validation Form</h2>
      
      <div className="space-y-1">
        <InputField label="CURP" value={mockData.curp} />
        <InputField label="Full Name" value={mockData.fullName} />
        <InputField label="Address" value={mockData.address} />
        <InputField label="Electoral Key" value={mockData.electoralKey} />
      </div>
    </div>
  );
}