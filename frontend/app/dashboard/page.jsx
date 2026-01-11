import { FileText, CreditCard } from 'lucide-react'; // Iconos para las tarjetas
import Header from '../components/Header';
import UserProfileCard from '../components/UserProfileCard';
import ServiceCard from '../components/ServiceCard';

function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header /> {/* Reutilizado (nota: podrías pasarle un prop title="Government Portal" si lo hiciste dinámico) */}

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        
        {/* Layout Asimétrico: 1 Columna Izquierda (Perfil) + 2 Columnas Derecha (Contenido) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: Perfil (Ocupa 4 de 12 espacios) */}
          <div className="lg:col-span-4 sticky top-6">
            <UserProfileCard />
          </div>

          {/* COLUMNA DERECHA: Catálogo (Ocupa 8 de 12 espacios) */}
          <div className="lg:col-span-8">
            
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Procedures Catalog</h1>
              <p className="text-gray-500">Access and manage your government services</p>
            </div>

            {/* Grid interno para las tarjetas de servicios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tarjeta 1: Academic (Botón Negro) */}
              <ServiceCard 
                icon={FileText}
                title="Academic Certificate"
                description="Request an official PDF copy of your academic records and certifications for professional or educational purposes."
                buttonText="Request PDF"
                variant="primary" 
              />

              {/* Tarjeta 2: Library (Botón Blanco) */}
              <ServiceCard 
                icon={CreditCard}
                title="Library Credential"
                description="Register and obtain your national library access credential to enjoy digital and physical library services."
                buttonText="Register"
                variant="secondary"
              />

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default DashboardPage;