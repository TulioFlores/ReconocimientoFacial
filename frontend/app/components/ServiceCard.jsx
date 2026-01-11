export default function ServiceCard({ icon: Icon, title, description, buttonText, variant = "primary" }) {
  // Definimos estilos base para el botón
  const baseButtonStyles = "w-full py-2.5 rounded-lg font-medium transition-all text-sm";
  
  // Variantes de estilo (Primary = Negro, Secondary = Borde gris)
  const buttonStyles = variant === "primary" 
    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200" 
    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      {/* Icono Azul */}
      <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
        <Icon size={24} />
      </div>

      <h3 className="text-gray-800 font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 grow">
        {description}
      </p>

      <button className={`${baseButtonStyles} ${buttonStyles}`}>
        {buttonText}
      </button>
    </div>
  );
}