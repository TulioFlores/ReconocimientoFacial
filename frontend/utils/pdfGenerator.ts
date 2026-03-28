
/**
 * Utilidad para generar documentos PDF con los datos del usuario
 * Los datos ahora provienen directamente del backend (/me)
 */

// Definimos la interfaz aquí mismo para reemplazar lo que venía de cookieUtils
export interface UserData {
  user_id: string;
  full_name: string;
  curp: string;
  email: string;
  has_fiscal_data?: boolean;
  // Campos fiscales (opcionales porque pueden no estar llenos aún)
  rfc?: string;
  regimen_fiscal?: string;
  situacion_contribuyente?: string;
  tipo_vialidad?: string;
  nombre_vialidad?: string;
  numero_exterior?: string;
  numero_interior?: string;
  colonia?: string;
  codigo_postal?: string;
  municipio?: string;
  entidad_federativa?: string;
}

/**
 * Genera un PDF de Certificado de Registro en GobID
 * Retorna el PDF como Blob
 */
export async function generateGobIDCertificatePDF(userData: UserData): Promise<Blob> {
  try {
    // Dinámicamente importar jsPDF para evitar problemas de SSR
    const { jsPDF } = await import('jspdf');

    const doc = new (jsPDF as any)({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    // Encabezado decorativo
    doc.setFillColor(33, 150, 243); // Azul
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Título en el encabezado
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('CERTIFICADO OFICIAL', pageWidth / 2, 25, { align: 'center' });

    // Línea decorativa
    doc.setDrawColor(33, 150, 243);
    doc.setLineWidth(0.5);
    doc.line(margin, 55, pageWidth - margin, 55);

    // Resetear color de texto
    doc.setTextColor(0, 0, 0);
    yPosition = 70;

    // Título del certificado
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Certificado de Registro en GobID', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 25;

    // Introducción
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const introText =
      'Este documento certifica que la persona identificada a continuación se ha registrado exitosamente en la plataforma de GobID con verificación biométrica facial.';
    
    const splitIntro = doc.splitTextToSize(introText, maxWidth);
    doc.text(splitIntro, margin, yPosition);
    yPosition += splitIntro.length * 7 + 15;

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 12;

    // Datos del usuario
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('DATOS DEL USUARIO', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const dataFields = [
      { label: 'Nombre Completo:', value: userData.full_name || 'No disponible' },
      { label: 'CURP:', value: userData.curp || 'No disponible' },
      { label: 'Correo Electrónico:', value: userData.email || 'No disponible' },
      { label: 'Estado de Verificación:', value: 'VERIFICADO BIOMÉTRICAMENTE' },
    ];

    dataFields.forEach((field) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${field.label}`, margin + 5, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(field.value, margin + 50, yPosition);
      yPosition += 10;
    });

    // Espacio
    yPosition += 5;

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 12;

    // Información adicional
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);

    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const additionalInfo = `Este certificado fue generado automáticamente el ${dateString} como comprobante de registro exitoso en la plataforma GobID. La verificación biométrica facial ha sido realizada exitosamente.`;
    
    const splitAdditional = doc.splitTextToSize(additionalInfo, maxWidth);
    doc.text(splitAdditional, margin, yPosition);
    yPosition += splitAdditional.length * 5 + 10;

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);

    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('GobID - Identificación Biométrica Gubernamental', pageWidth / 2, pageHeight - 20, {
      align: 'center',
    });
    doc.text(`ID: ${userData.user_id}`, pageWidth / 2, pageHeight - 14, { align: 'center' });

    // Retornar como Blob
    return doc.output('blob') as Promise<Blob>;
  } catch (error) {
    console.error('[PDF] Error generando certificado:', error);
    throw new Error('Error al generar el certificado PDF');
  }
}
/**
 * Genera un PDF de Constancia de Situación Fiscal
 * Retorna el PDF como Blob
 */
export async function generateConstanciaFiscalPDF(userData: UserData): Promise<Blob> {
  try {
    const { jsPDF } = await import('jspdf');

    const doc = new (jsPDF as any)({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    // Encabezado decorativo (Color más sobrio/institucional para temas fiscales)
    doc.setFillColor(76, 81, 109); // Gris azulado oscuro
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Título en el encabezado
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('CONSTANCIA DE SITUACIÓN FISCAL', pageWidth / 2, 25, { align: 'center' });

    // Línea decorativa
    doc.setDrawColor(76, 81, 109);
    doc.setLineWidth(0.5);
    doc.line(margin, 55, pageWidth - margin, 55);

    // Resetear color de texto
    doc.setTextColor(0, 0, 0);
    yPosition = 70;

    // Título del documento
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Datos de Identificación del Contribuyente', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Datos Personales
    doc.setFontSize(10);
    
    const datosPersonales = [
      { label: 'Nombre Completo:', value: userData.full_name || 'N/A' },
      { label: 'CURP:', value: userData.curp || 'N/A' },
      { label: 'RFC:', value: userData.rfc || 'N/A' },
      { label: 'Régimen Fiscal:', value: userData.regimen_fiscal || 'N/A' },
      { label: 'Situación:', value: userData.situacion_contribuyente || 'ACTIVO' },
    ];

    datosPersonales.forEach((field) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${field.label}`, margin + 5, yPosition);
      doc.setFont(undefined, 'normal');
      // Aumentamos a 50 el margen para darle más respiro al texto
      doc.text(field.value, margin + 50, yPosition); 
      yPosition += 8;
    });

    yPosition += 10;

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 12;

    // Datos del Domicilio
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Datos del Domicilio Registrado', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    doc.setFontSize(10);
    
    // Construimos la dirección completa (con validaciones por si viene vacío algún campo)
    const numeroInt = userData.numero_interior ? ` Int. ${userData.numero_interior}` : '';
    const direccionLine1 = `${userData.tipo_vialidad || ''} ${userData.nombre_vialidad || ''} Ext. ${userData.numero_exterior || ''}${numeroInt}`.trim();
    const direccionLine2 = `Col. ${userData.colonia || ''}, C.P. ${userData.codigo_postal || ''}`;
    const direccionLine3 = `${userData.municipio || ''}, ${userData.entidad_federativa || ''}`;

    const datosDomicilio = [
      { label: 'Calle y Número:', value: direccionLine1 || 'N/A' },
      { label: 'Colonia y C.P.:', value: direccionLine2 || 'N/A' },
      { label: 'Municipio/Entidad:', value: direccionLine3 || 'N/A' },
    ];

    datosDomicilio.forEach((field) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${field.label}`, margin + 5, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(field.value, margin + 50, yPosition);
      yPosition += 8;
    });

    // Información adicional al pie
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    
    yPosition += 20;
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    const additionalInfo = `Documento generado el ${dateString} a través de la plataforma GobID. Los datos mostrados corresponden a la información declarada por el contribuyente.`;
    
    const splitAdditional = doc.splitTextToSize(additionalInfo, maxWidth);
    doc.text(splitAdditional, margin, yPosition);

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('GobID - Sistema de Constancias Fiscales', pageWidth / 2, pageHeight - 20, { align: 'center' });
    doc.text(`ID de Usuario: ${userData.user_id}`, pageWidth / 2, pageHeight - 14, { align: 'center' });

    return doc.output('blob') as Promise<Blob>;
  } catch (error) {
    console.error('[PDF] Error generando constancia fiscal:', error);
    throw new Error('Error al generar la constancia fiscal PDF');
  }
}
export async function generateCurpPDF(userData: UserData): Promise<Blob> {
  try {
    const { jsPDF } = await import('jspdf');

    const doc = new (jsPDF as any)({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    let yPosition = margin;

    // Encabezado con color institucional (Guinda Gobierno)
    doc.setFillColor(157, 36, 73); 
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Título principal en blanco
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('ESTADOS UNIDOS MEXICANOS', pageWidth / 2, 18, { align: 'center' });
    doc.setFontSize(14);
    doc.text('CONSTANCIA DE CLAVE ÚNICA DE REGISTRO DE POBLACIÓN', pageWidth / 2, 28, { align: 'center' });

    // Resetear color para el texto normal
    doc.setTextColor(0, 0, 0);
    yPosition = 60;

    // Subtítulo
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Datos del Ciudadano Registrado en GobID', margin, yPosition);
    
    doc.setDrawColor(157, 36, 73);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 3, pageWidth - margin, yPosition + 3);
    yPosition += 20;

    // Extraer datos básicos directamente de la cadena de la CURP (si es válida)
    const curp = userData.curp || 'XXXXXXXXXXXXXXXXXX';
    let sexo = 'N/A';
    let fechaNacimiento = 'N/A';
    
    if (curp.length >= 18) {
      sexo = curp[10] === 'H' ? 'HOMBRE' : curp[10] === 'M' ? 'MUJER' : 'N/A';
      const yearStr = curp.substring(4, 6);
      const monthStr = curp.substring(6, 8);
      const dayStr = curp.substring(8, 10);
      const year = parseInt(yearStr);
      // Lógica simple para determinar el siglo (asumiendo que < 50 es 2000+)
      const fullYear = year < 50 ? 2000 + year : 1900 + year; 
      fechaNacimiento = `${dayStr}/${monthStr}/${fullYear}`;
    }

    // Nombre (Grande)
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Nombre:', margin, yPosition);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(userData.full_name || 'N/A', margin, yPosition + 8);
    
    yPosition += 25;

    // CURP (Muy Grande)
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('CURP:', margin, yPosition);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(157, 36, 73); // Guinda
    doc.text(curp, margin, yPosition + 10);
    
    doc.setTextColor(0, 0, 0); // Reset a negro
    yPosition += 30;

    // Fecha de Nacimiento y Sexo
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Fecha de Nacimiento:', margin, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(fechaNacimiento, margin, yPosition + 6);

    doc.setFont(undefined, 'bold');
    doc.text('Sexo:', margin + 70, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(sexo, margin + 70, yPosition + 6);

    yPosition += 20;

    // Recuadro decorativo simulando código de barras o folio
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPosition, pageWidth - (margin * 2), 25, 'FD');
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Folio Interno GobID:', margin + 5, yPosition + 8);
    doc.setFont(undefined, 'bold');
    doc.text(userData.user_id || 'N/A', margin + 5, yPosition + 15);

    // Texto legal al pie
    const currentDate = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    yPosition = pageHeight - 30;
    
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    
    const disclaimer = `Este documento es una representación impresa emitida por GobID el ${currentDate}. Sirve como comprobante interno de verificación de identidad dentro de la plataforma y no sustituye el documento oficial emitido por la Secretaría de Gobernación (RENAPO).`;
    const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - (margin * 2));
    doc.text(splitDisclaimer, margin, yPosition);

    return doc.output('blob') as Promise<Blob>;
  } catch (error) {
    console.error('[PDF] Error generando CURP:', error);
    throw new Error('Error al generar la constancia de CURP PDF');
  }
}
/**
 * Descarga un PDF
 */
export function downloadPDF(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Abre un PDF en una nueva ventana para previsualización
 */
export function previewPDF(blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  window.open(url, '_blank');
}