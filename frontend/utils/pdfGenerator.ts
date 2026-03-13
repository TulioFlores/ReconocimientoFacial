/**
 * Utilidad para generar documentos PDF con los datos del usuario
 */

import { UserData } from './cookieUtils';

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
      { label: 'Nombre Completo:', value: userData.full_name },
      { label: 'CURP:', value: userData.curp },
      { label: 'Correo Electrónico:', value: userData.email },
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
