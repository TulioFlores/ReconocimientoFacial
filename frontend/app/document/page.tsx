import { CheckCircle2, Download, Home } from 'lucide-react';
import { DocumentPreview } from '@/components/document/DocumentPreview';
import { TransactionDetails } from '@/components/document/ProcedureStatus';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Columna Izquierda: Preview */}
        <div className="flex flex-col items-center lg:items-start">
          <h2 className="text-muted-foreground font-bold mb-6 self-start lg:ml-4">Document Preview</h2>
          <DocumentPreview />
        </div>

        {/* Columna Derecha: Contenido y Acciones */}
        <div className="space-y-8 max-w-md">
          <div className="space-y-4">
            {/* Ícono de éxito (Usamos primary, pero si tienes --success en tu CSS, puedes cambiarlo a text-success) */}
            <CheckCircle2 className="w-16 h-16 text-primary" strokeWidth={1.5} />
            <h1 className="text-4xl font-bold text-foreground">Procedure Successful</h1>
            <p className="text-muted-foreground text-lg">
              Your transaction has been completed and verified successfully.
            </p>
          </div>

          <TransactionDetails />

          <div className="space-y-3">
            {/* Botón Principal (Download) */}
            <button className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
              <Download size={20} />
              Download PDF
            </button>
            
            {/* Botón Secundario (Return) */}
            <button className="w-full bg-background hover:bg-muted text-foreground font-semibold py-4 rounded-xl border border-border flex items-center justify-center gap-2 transition-all">
              <Home size={20} />
              Return to Home
            </button>
          </div>

          {/* Mensaje inferior */}
          <p className="text-sm text-muted-foreground/80 text-center lg:text-left">
            A copy of this document has been saved to your account.
          </p>
        </div>

      </div>
    </main>
  );
}