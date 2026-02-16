import { CheckCircle2, Download, Home } from 'lucide-react';
import { DocumentPreview } from '@/components/DocumentPreview';
import { TransactionDetails } from '@/components/ProcedureStatus';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Columna Izquierda: Preview */}
        <div className="flex flex-col items-center lg:items-start">
          <h2 className="text-gray-600 font-bold mb-6 self-start lg:ml-4">Document Preview</h2>
          <DocumentPreview />
        </div>

        {/* Columna Derecha: Contenido y Acciones */}
        <div className="space-y-8 max-w-md">
          <div className="space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" strokeWidth={1.5} />
            <h1 className="text-4xl font-bold text-slate-900">Procedure Successful</h1>
            <p className="text-gray-500 text-lg">
              Your transaction has been completed and verified successfully.
            </p>
          </div>

          <TransactionDetails />

          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200">
              <Download size={20} />
              Download PDF
            </button>
            
            <button className="w-full bg-white hover:bg-gray-50 text-gray-600 font-semibold py-4 rounded-xl border border-gray-200 flex items-center justify-center gap-2 transition-all">
              <Home size={20} />
              Return to Home
            </button>
          </div>

          <p className="text-sm text-gray-400 text-center lg:text-left">
            A copy of this document has been saved to your account.
          </p>
        </div>

      </div>
    </main>
  );
}