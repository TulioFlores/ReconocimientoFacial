# Tech Stack & Arquitectura

## Gestor de paquetes
- **Gestor:** PNPM.

## Frontend & API Gateway
- **Framework:** Next.js 14 (App Router).
- **Lenguaje:** TypeScript.
- **Estilos:** Tailwind CSS.

## Backend de IA (Microservicio)
- **Lenguaje:** Python 3.10+.
- **Framework:** FastAPI (Ideal para conectar con Next.js).
- **Librerías Clave:** - `EasyOCR` o `Pytesseract` (Para leer el INE).
    - `face_recognition` o `OpenCV` (Para validar identidad).
    - `ReportLab` o `PyPDF2` (Para generar el PDF del trámite).

## Integración
- La comunicación entre Next.js y Python se hará mediante peticiones HTTP (REST API).