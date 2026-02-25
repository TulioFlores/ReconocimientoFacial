import IdUploader from '../../components/registration/IdUploader';
import ValidationForm from '../../components/registration/ValidationForm';
import ActionBar from '../../components/registration/ActionBar';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        
        {/* Título de la sección */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Verificacion de identidad</h2>
          <p className="text-gray-500 mt-1">Please upload your official ID and verify your information</p>
        </div>

        {/* Grid Principal: 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Columna Izquierda */}
          <section>
            <IdUploader />
          </section>

          {/* Columna Derecha */}
          <section>
            <ValidationForm />
          </section>

        </div>

        {/* Barra de Acciones Inferior */}
        <ActionBar />

      </main>
    </div>
  );
}

export default App;