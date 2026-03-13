"""
============================================================
DOCUMENTACIÓN - ENDPOINT: POST /api/v1/extract-vector
============================================================

DESCRIPCIÓN:
Extrae características faciales (embedding de 128 dimensiones) de una imagen
de rostro mediante file upload. Utiliza la librería face_recognition para 
detectar y procesar el rostro.

UBICACIÓN EN CÓDIGO:
- Endpoint: backend/app/main.py
- Modelos: backend/app/models/schemas.py
  └─ VectorExtractionResponse: Modelo de respuesta

============================================================
ESTRUCTURA DE REQUEST
============================================================

POST /api/v1/extract-vector
Content-Type: multipart/form-data

[File Upload]
file: <binary image data>

Parámetro:
  - file (binary, requerido): Archivo de imagen.
    ✓ Soporta JPG, PNG y otros formatos de imagen
    ✓ Requiere mínimo 100x100 píxeles
    ✓ Debe contener exactamente 1 rostro detectable

============================================================
ESTRUCTURA DE RESPONSE (ÉXITO - 200 OK)
============================================================

{
  "status": "success",
  "vector": [0.123, -0.456, 0.789, ..., 0.234]
}

Campos:
  - status: Siempre "success" en caso de éxito
  - vector: Array de 128 números flotantes (embedding facial)
    └─ Generado por face_recognition (dlib)
    └─ Usable para comparación de similitud facial

============================================================
CÓDIGOS DE ERROR
============================================================

400 Bad Request:
  - Archivo no es imagen: "El archivo enviado no es una imagen válida"
  - Imagen no se puede decodificar: "No se pudo decodificar la imagen"
  - Sin rostro detectado: "Error en detección facial: No se detectó rostro..."
  - Múltiples rostros: "Error en detección facial: Se detectaron múltiples..."
  - Dimensiones insuficientes: "Formato de imagen inválido: Dimensiones..."

501 Not Implemented:
  - Problema con librería face_recognition

500 Internal Server Error:
  - Error inesperado en el procesamiento

============================================================
EJEMPLOS DE USO
============================================================

Ejemplo 1: Python con requests
------------------------------
import requests

# Abrir imagen local y hacer request
with open("rostro.jpg", "rb") as f:
    files = {"file": f}
    response = requests.post(
        "http://localhost:8000/api/v1/extract-vector",
        files=files
    )

if response.status_code == 200:
    data = response.json()
    print(f"✓ Vector extraído: {len(data['vector'])} dimensiones")
else:
    print(f"✗ Error: {response.json()['detail']}")


Ejemplo 2: JavaScript/TypeScript (Frontend)
--------------------------------------------
const formData = new FormData();
const fileInput = document.querySelector('input[type="file"]');
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:8000/api/v1/extract-vector', {
  method: 'POST',
  body: formData  // FormData maneja multipart/form-data automáticamente
});

if (response.ok) {
  const data = await response.json();
  console.log('Vector facial:', data.vector);
  console.log('Dimensiones:', data.vector.length);
} else {
  const error = await response.json();
  console.error('Error:', error.detail);
}


Ejemplo 3: cURL desde terminal
------------------------------
curl -X POST http://localhost:8000/api/v1/extract-vector \\
  -F "file=@rostro.jpg"

# Response (exitoso):
# {"status":"success","vector":[0.123,-0.456,...]}


Ejemplo 4: Comparar dos vectores faciales
------------------------------------------
import numpy as np
from scipy.spatial.distance import euclidean

# Obtener dos vectores de diferentes imágenes
vector1 = extract_vector_from_file("rostro1.jpg")
vector2 = extract_vector_from_file("rostro2.jpg")

# Calcular similitud euclidiana
distance = euclidean(vector1, vector2)

# Threshold típico: < 0.6 = mismo rostro
similarity = "MATCH" if distance < 0.6 else "NO MATCH"
print(f"Distancia: {distance:.4f} -> {similarity}")

============================================================
DIFERENCIAS CON OTROS ENDPOINTS
============================================================

Endpoint               | Entrada          | Salida
────────────────────────────────────────────────────────
/api/v1/scan-ine       | File (imagen)    | texto_completo
/api/v1/scan-ine-parsed| File (imagen)    | INE estructurado
/api/v1/enroll         | File + CURP      | Status + message
/api/v1/extract-vector | File (imagen)    | Vector 128D ✨
────────────────────────────────────────────────────────

============================================================
CARACTERÍSTICAS CLAVE
============================================================

✓ ENTRADA: File upload (compatible con FormData del frontend)
✓ SALIDA: Array de 128 flotantes (embedding de face_recognition)
✓ DETECCIÓN: Valida exactamente 1 rostro
✓ VALIDACIÓN: Verifica dimensiones mínimas (100x100)
✓ MANEJO DE ERRORES: Mensajes descriptivos para cada caso
✓ PERFORMANCE: ~0.5-1 segundo por imagen (después de carga inicial)

============================================================
CASOS DE USO
============================================================

1. BÚSQUEDA BIOMÉTRICA:
   Comparar foto de entrada contra base de datos de vectores almacenados

2. VERIFICACIÓN DE IDENTIDAD:
   Validar que la persona en la foto es quien dice ser

3. ANÁLISIS FORENSE:
   Buscar coincidencias en sistemas de vigilancia

4. CONTROL DE ACCESO:
   Verificación facial para entrada a zonas restringidas

5. AUTENTICACIÓN:
   Factor biométrico adicional en sistemas de 2FA

============================================================
NOTAS IMPORTANTES
============================================================

1. REQUISITOS DE IMAGEN:
   ✓ Debe contener exactamente 1 rostro
   ✓ Mínimo 100x100 píxeles
   ✓ Rostro debe estar visible y bien iluminado
   ✓ Evitar gafas de sol, sombreros que cubran cara
   ✓ Formatos soportados: JPG, PNG, GIF, BMP, TIFF

2. SEGURIDAD:
   ⚠ No almacenar imágenes originales (usar solo vectores)
   ⚠ Encriptar vectores si se guardan en BD
   ⚠ Validar que usuario tenga permisos para upload

3. VECTOR FACIAL:
   └─ Generado por face_recognition (usa red neuronal dlib)
   └─ 128 dimensiones (estándar de la librería)
   └─ Comprimido (mayor velocidad vs foto original)
   └─ Invariante a cambios menores de iluminación/ángulo

4. COMPARACIÓN:
   └─ Usar distancia euclidiana entre vectores
   └─ Threshold sugerido: 0.6 (ajustable según precisión requerida)
   └─ Threshold más bajo = más estricto, menos falsos positivos
   └─ Threshold más alto = más permisivo, más falsos positivos

============================================================
"""

if __name__ == "__main__":
    print(__doc__)
