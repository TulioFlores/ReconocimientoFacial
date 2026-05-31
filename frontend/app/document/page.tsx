'use client'

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCookie } from '@/utils/getCookie';
import { CheckCircle2, Download, Home, FileText, Loader } from 'lucide-react';
import {generateConstanciaFiscalPDF, generateGobIDCertificatePDF, downloadPDF, generateCurpPDF} from '@/utils/pdfGenerator'
import { apiUrl } from '@/utils/api';

interface UserData {
  full_name: string;
  curp: string;
  email: string;
  has_fiscal_data?: boolean;
  ocrCp?: string;
  ocrAddress?: string;
  confidence?: number;
  [key: string]: any;
}

export default function DocumentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const documentType = searchParams.get('type');

  // Asegúrate de que tu interface UserData incluya los campos que trae el /me
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentNombre, setDocumentNombre] = useState<string | null>(null);
   const [confidence, setConfidence] = useState<string | null>(null);
   useEffect(() => {
     // 2. Buscamos la cookie SOLO cuando el componente se monta en el cliente
     const savedConfidence = getCookie('login_confidence');
     
     if (savedConfidence) {
       setConfidence(savedConfidence);
     }
   }, []); // El array vacío asegura que esto solo corra una vez
  // Cargar datos del usuario y generar PDF
  useEffect(() => {
    const loadAndGeneratePDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Obtener datos del usuario desde el backend usando la cookie
        const response = await fetch(apiUrl('/me'), {
          method: 'GET',
          credentials: 'include', // Súper importante para que envíe la sesión
        });

        // Manejamos si no hay sesión (401 Unauthorized)
        if (response.status === 401) {
          setError('No hay sesión activa. Por favor, inicia sesión nuevamente.');
          setIsLoading(false);
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        if (!response.ok) {
          throw new Error('No se pudo obtener el perfil del usuario');
        }

        const user = await response.json();
        setUserData(user);

        // 2. Generar el PDF según el tipo
        if (documentType === 'gobid-certificate') {
          setIsGenerating(true);
          // Le pasamos el objeto user que acabamos de recibir de la base de datos
          const blob = await generateGobIDCertificatePDF(user); 
          setPdfBlob(blob);
          setIsGenerating(false);
          setDocumentNombre("Certificado GobID");
        } 
        // Aquí puedes agregar la condición para tu nueva constancia fiscal
        else if (documentType === 'constancia-fiscal') {
          if (!user.has_fiscal_data) {
             // Si de casualidad llega aquí sin datos fiscales, lo regresamos
             setError('No cuentas con datos fiscales registrados.');
             return;
          }
          setIsGenerating(true);
          const blob = await generateConstanciaFiscalPDF(user);
          setPdfBlob(blob);
          setIsGenerating(false);
          setDocumentNombre("Constancia Fiscal");

        }
        else if (documentType === 'curp') {
          setIsGenerating(true);
          const blob = await generateCurpPDF(user);
          setPdfBlob(blob);
          setIsGenerating(false);
          setDocumentNombre("CURP");

        } 
        else {
          setError('Tipo de documento no reconocido.');
        }

      } catch (err) {
        console.error('Error generando documento:', err);
        setError('Error al generar el documento. Intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAndGeneratePDF();
  }, [documentType, router]);

  const handleDownload = () => {
    if (pdfBlob && userData) {
      // Ajustamos el nombre de descarga según el tipo de documento
      const fileName = documentType === 'gobid-certificate' 
        ? `Certificado_GobID_${userData.curp}.pdf` 
        : `Constancia_${userData.curp}.pdf`;

      downloadPDF(pdfBlob, fileName);
    }
  };

  const handleReturnHome = () => {
    router.push('/dashboard');
  };

  // Estado de carga inicial
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6 font-sans">
        <div className="space-y-4 text-center">
          <Loader className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Generando documento...</p>
        </div>
      </main>
    );
  }

  // Estado de error
  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6 font-sans">
        <div className="space-y-4 text-center max-w-md">
          <p className="text-destructive font-semibold">{error}</p>
          <button
            onClick={handleReturnHome}
            className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Home size={20} />
            Volver al Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <button
          onClick={handleReturnHome}
          className="text-primary hover:underline text-sm mb-6 flex items-center gap-2"
        >
          <Home size={16} />
          Volver al Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Columna Izquierda: Preview del PDF */}
          <div className="flex flex-col items-center">
            <h2 className="text-muted-foreground font-bold mb-6 w-full text-left">Vista Previa del Documento</h2>
            
            <div className="w-full bg-white border-2 border-border rounded-lg shadow-lg p-6 min-h-96 flex flex-col items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader className="w-8 h-8 animate-spin" />
                  <p>Generando PDF...</p>
                </div>
              ) : pdfBlob ? (
                <div className="w-full text-center space-y-4">
                  <FileText className="w-16 h-16 text-primary mx-auto" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">PDF Generado Exitosamente</p>
                    <p className="font-semibold text-foreground">{documentNombre}</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                    ✓ Listo para descargar
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Error al generar vista previa</p>
              )}
            </div>
          </div>

          {/* Columna Derecha: Contenido y Acciones */}
          <div className="space-y-8 max-w-md flex flex-col justify-start">
            <div className="space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-600" strokeWidth={1.5} />
              <h1 className="text-4xl font-bold text-foreground">¡Documento Listo!</h1>
              <p className="text-muted-foreground text-lg">
                Su certificado de registro en GobID ha sido generado exitosamente con verificación biométrica.
              </p>
            </div>

            {/* Detalles del documento */}
            <div className="bg-muted/50 p-6 rounded-lg space-y-3 border border-border">
              <h3 className="font-semibold text-foreground">Información del Documento</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium text-foreground">Certificado Oficial</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usuario:</span>
                  <span className="font-medium text-foreground truncate">{userData?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CURP:</span>
                  <span className="font-medium text-foreground font-mono text-xs">{userData?.curp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confianza:</span>
                  <span className="font-medium text-green-600">{confidence}%</span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-3">
              {/* Botón Principal (Download) */}
              <button
                onClick={handleDownload}
                disabled={!pdfBlob || isGenerating}
                className="w-full bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
              >
                <Download size={20} />
                {isGenerating ? 'Generando...' : 'Descargar PDF'}
              </button>

              {/* Botón Secundario (Return) */}
              <button
                onClick={handleReturnHome}
                className="w-full bg-background hover:bg-muted text-foreground font-semibold py-4 rounded-xl border border-border flex items-center justify-center gap-2 transition-all"
              >
                <Home size={20} />
                Volver al Dashboard
              </button>
            </div>

            {/* Mensaje inferior */}
            <p className="text-sm text-muted-foreground/80 text-center">
              Este documento está asociado a su cuenta y puede ser descargado en cualquier momento desde su perfil.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
