import { ScanFace, RefreshCw, Lock } from 'lucide-react';

export default function ActionBar({ onConfirm, onRetry }: { onConfirm: () => void; onRetry: () => void }) {
  return (
    <div className="mt-6">
      {/* Contenedor Principal (Card) */}
      <div className="bg-background p-4 rounded-xl shadow-sm border border-border flex flex-col sm:flex-row justify-center items-center gap-6">
        
        {/* Botón Principal */}
        <button onClick={onConfirm} className="bg-primary text-primary-foreground hover:opacity-90 px-8 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all w-full sm:w-auto justify-center">
          <ScanFace size={20} />
          Confirmar datos
        </button>

        {/* Botón Secundario */}
        <button 
          onClick={onRetry}
          className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg transition-colors"
        >
          <RefreshCw size={18} />
          Subir otra foto
        </button>

      </div>

      {/* Nota de Seguridad */}
      <div className="text-center mt-6 flex justify-center items-center gap-2 text-muted-foreground opacity-80 text-xs">
        <Lock size={12} />
        <p>Tus datos están encriptados y protegidos. Esta sesión expirará en 15 minutos.</p>
      </div>
    </div>
  );
}