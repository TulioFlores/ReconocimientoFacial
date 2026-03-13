# 📄 Generación de Certificados PDF - GobID

## ✅ Implementación Completada

He implementado un sistema completo para generar, previsualizar y descargar certificados PDF con los datos del usuario.

---

## 🎯 Flujo Completo

```
Dashboard
    ↓ (Click en "Generar PDF")
    ↓
/document?type=gobid-certificate
    ↓
Leer datos de cookie
    ↓
Generar PDF con jsPDF
    ↓
Mostrar preview
    ↓
Descargar o volver
```

---

## 📁 Archivos Creados/Actualizados

### 1. **[utils/pdfGenerator.ts](../utils/pdfGenerator.ts)** (NUEVO)
Funciones para generar PDFs:

```typescript
// Generar PDF del certificado
const blob = await generateGobIDCertificatePDF(userData);

// Descargar el PDF
downloadPDF(blob, 'Certificado_GobID_CURP.pdf');

// Previsualizar en nueva ventana
previewPDF(blob);
```

**Características del PDF:**
- ✅ Encabezado azul con título
- ✅ Datos del usuario (nombre, CURP, email)
- ✅ Estado de verificación biométrica
- ✅ Fecha de generación
- ✅ ID del usuario para referencia
- ✅ Diseño profesional y limpio

### 2. **[app/dashboard/page.tsx](../app/dashboard/page.tsx)** (ACTUALIZADO)
Añadido onClick al ServiceCard:

```typescript
const handleGenerateGobIDCertificate = () => {
  router.push('/document?type=gobid-certificate');
};

<ServiceCard 
  // ...
  onClick={handleGenerateGobIDCertificate}
/>
```

### 3. **[app/document/page.tsx](../app/document/page.tsx)** (ACTUALIZADO)
Página completamente rediseñada:

```typescript
'use client'

// 1. Lee el parámetro ?type=gobid-certificate
const documentType = searchParams.get('type');

// 2. Obtiene datos del usuario de la cookie
const userData = getUserCookie();

// 3. Genera el PDF automáticamente
const blob = await generateGobIDCertificatePDF(userData);

// 4. Muestra preview y botones de descarga
```

### 4. **[package.json](../package.json)** (ACTUALIZADO)
Añadida dependencia:

```json
"jspdf": "^2.5.1"
```

---

## 📋 Contenido del Certificado PDF

El PDF generado contiene:

```
┌─────────────────────────────────────────┐
│         CERTIFICADO OFICIAL              │
├─────────────────────────────────────────┤
│  Certificado de Registro en GobID      │
│                                         │
│  Este documento certifica que la        │
│  persona identificada se ha registrado  │
│  exitosamente con verificación          │
│  biométrica facial.                     │
├─────────────────────────────────────────┤
│  DATOS DEL USUARIO                       │
│  Nombre Completo: TULIO ELIAS...        │
│  CURP: XXXX...                          │
│  Correo: user@example.com               │
│  Estado: VERIFICADO BIOMÉTRICAMENTE    │
├─────────────────────────────────────────┤
│  Generado: 13 de marzo de 2026          │
│  ID: cfe40086-686a-4b3b-831b-...       │
│                                         │
│  GobID - Identificación Biométrica     │
└─────────────────────────────────────────┘
```

---

## 🎨 Página /document

La página muestra:

### Lado Izquierdo:
- Vista previa visual del PDF generado
- Icono de documento
- Estado "Listo para descargar"

### Lado Derecho:
- ✓ Icono de éxito
- Título: "¡Documento Listo!"
- Descripción
- Detalles: Tipo, Usuario, CURP, Confianza
- Botón "Descargar PDF"
- Botón "Volver al Dashboard"
- Mensaje informativo

### Estados:
- 🔄 **Cargando:** Spinner mientras se genera el PDF
- ✅ **Éxito:** Documento listo para descargar
- ❌ **Error:** Mensaje de error con opción de reintentar

---

## 🚀 Cómo Funciona

### 1. Usuario hace click en "Generar PDF"
```typescript
// dashboard/page.tsx
handleGenerateGobIDCertificate() 
  → router.push('/document?type=gobid-certificate')
```

### 2. Se carga la página /document
```typescript
useEffect(() => {
  // Leer parámetro de URL
  const type = searchParams.get('type');
  
  // Obtener datos de cookie
  const userData = getUserCookie();
  
  // Generar PDF
  const blob = await generateGobIDCertificatePDF(userData);
  
  // Mostrar en estado
  setPdfBlob(blob);
})
```

### 3. Usuario descarga
```typescript
handleDownload()
  → downloadPDF(blob, 'Certificado_GobID_CURP.pdf')
```

---

## 📦 Instalación de Dependencias

Después de estos cambios, ejecuta:

```bash
cd frontend
npm install
# o
pnpm install
```

Esto instalará **jsPDF 2.5.1** necesario para generar PDFs.

---

## 🔒 Seguridad y Validación

✅ **Validaciones implementadas:**
- Solo un usuario autenticado puede generar certificados (verifica cookie)
- Redirige a login si no hay sesión
- El PDF contiene el ID único del usuario para auditoría
- Los datos se obtienen de la cookie segura

---

## 🛠️ Personalización

Puedes personalizar el PDF editando `generateGobIDCertificatePDF()`:

```typescript
// Cambiar color del encabezado
doc.setFillColor(33, 150, 243); // RGB

// Cambiar tamaño de fuente
doc.setFontSize(18);

// Cambiar contenido del certificado
const introText = "Tu texto aquí...";
```

---

## 📱 Tipos de Documentos (Extensible)

El sistema está diseñado para ser extensible. Puedes agregar más tipos:

```typescript
// En pdfGenerator.ts
export async function generateCURPCertificate(userData: UserData) {
  // Similar pero con contenido diferente
}

export async function generateFiscalCertificate(userData: UserData) {
  // Para constancia fiscal
}
```

**Luego en dashboard:**
```typescript
const handleGenerateCURP = () => {
  router.push('/document?type=curp-certificate');
};

const handleGenerateFiscal = () => {
  router.push('/document?type=fiscal-certificate');
};
```

---

## ✅ Checklist de Prueba

- [ ] **Instalé dependencias:** `npm install`
- [ ] **Inicie sesión** y llegue al dashboard
- [ ] **Hago click** en "Generar PDF" del certificado GobID
- [ ] **Veo página** /document cargando
- [ ] **Se genera** el PDF automáticamente
- [ ] **Descargo** el PDF exitosamente
- [ ] **El PDF contiene:**
  - ✓ Mi nombre completo
  - ✓ Mi CURP
  - ✓ Mi email
  - ✓ Estado "VERIFICADO BIOMÉTRICAMENTE"
  - ✓ Fecha de generación
  - ✓ Mi ID de usuario
- [ ] **Vuelvo al dashboard** sin problemas

---

## 🐛 Debugging

**Si no se descarga el PDF:**
1. Abre DevTools (F12)
2. Ve a Console
3. Busca errores de jsPDF
4. Verifica que las dependencias estén instaladas

**Logs útiles:**
```typescript
console.log('[PDF] Generando certificado...');
console.log('[PDF] PDF generado:', blob);
console.log('[PDF] Descargando archivo...');
```

---

## 🚀 Próximos Pasos

Para expandir el sistema puedes:

1. **Añadir más tipos de certificados:**
   - Constancia de registro fiscal
   - Certificado de residencia
   - Documento de verificación

2. **Almacenar certificados en servidor:**
   - Historial de descargas
   - Acceso desde perfil

3. **Firma digital:**
   - Agregar firma oficial del gobierno
   - Código QR para validación

4. **Internacionalización:**
   - Generar en español/inglés
   - Diferentes formatos por región
