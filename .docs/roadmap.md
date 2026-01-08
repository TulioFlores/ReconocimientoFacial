# Roadmap: Plataforma de Trámites Automatizados "AutoTramite"

## Flujo de Usuario (User Journey)
1. **Registro con INE (OCR):**
   - Usuario sube foto de su INE (frente y vuelta).
   - El sistema (Python) extrae: Nombre, CURP, Dirección y Fecha de Nacimiento automáticamente.
   - El usuario confirma que los datos extraídos son correctos.

2. **Verificación de Identidad (Liveness/Face Match):**
   - El sistema pide acceso a la cámara web.
   - Se captura una foto del usuario en vivo.
   - Se compara la foto en vivo contra la foto extraída del INE.
   - Si coinciden > 90%, se crea la cuenta.

3. **Dashboard de Trámites:**
   - Usuario ve lista de trámites disponibles (ej: Constancia de Domicilio).
   - Al dar clic, el sistema genera el PDF usando los datos ya guardados.
   - Descarga inmediata.

## Estructura de Carpetas Propuesta
/frontend (Next.js + TS)
/backend-ai (Python + FastAPI)
/docs (Documentación)