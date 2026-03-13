"""
============================================================
DOCUMENTACIÓN - ENDPOINT: POST /api/v1/extract-vector
============================================================

DESCRIPCIÓN:
Extrae características faciales (embedding de 128 dimensiones) de una imagen
de rostro en formato Base64. Utiliza la librería face_recognition para detectar
y procesar el rostro.

UBICACIÓN EN CÓDIGO:
- Endpoint: backend/app/main.py (líneas detectadas automáticamente)
- Modelos: backend/app/models/schemas.py
  └─ VectorExtractionRequest: Modelo de entrada
  └─ VectorExtractionResponse: Modelo de salida

============================================================
ESTRUCTURA DE REQUEST
============================================================

POST /api/v1/extract-vector
Content-Type: application/json

{
  "foto_rostro": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAA..."
}

Parámetro:
  - foto_rostro (string, requerido): Imagen codificada en Base64. 
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
  - Base64 inválido: "Error decodificando imagen Base64: ..."
  - Imagen no válida: "Formato de imagen inválido: ..."
  - Sin rostro detectado: "Error en detección facial: No se detectó rostro..."
  - Múltiples rostros: "Error en detección facial: Se detectaron múltiples..."
  - Dimensiones insuficientes: "Formato de imagen inválido: Dimensiones..."

501 Not Implemented:
  - Problema con librería face_recognition

500 Internal Server Error:
  - Error inesperado en el procesamiento

============================================================
EJEMPLOS DE USO CON PYTHON
============================================================

Ejemplo 1: Extracción básica con requests
-----------------------------------------
import requests
import base64

# Leer imagen local y convertir a Base64
with open("rostro.jpg", "rb") as f:
    base64_image = base64.b64encode(f.read()).decode("utf-8")

# Hacer request
response = requests.post(
    "http://localhost:8000/api/v1/extract-vector",
    json={"foto_rostro": base64_image}
)

if response.status_code == 200:
    data = response.json()
    print(f"Vector extraído: {data['vector']}")
    print(f"Dimensiones: {len(data['vector'])}")
else:
    print(f"Error: {response.json()['detail']}")


Ejemplo 2: Con manejo de errores
---------------------------------
import requests
import base64
from typing import Optional

def extract_facial_vector(image_path: str) -> Optional[list[float]]:
    \"\"\"
    Extrae el vector facial de una imagen.
    
    Args:
        image_path: Ruta a la imagen local
        
    Returns:
        Lista de 128 números flotantes o None si hay error
    \"\"\"
    try:
        # Leer y codificar imagen
        with open(image_path, "rb") as f:
            base64_image = base64.b64encode(f.read()).decode("utf-8")
        
        # Request al endpoint
        response = requests.post(
            "http://localhost:8000/api/v1/extract-vector",
            json={"foto_rostro": base64_image},
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json()["vector"]
        else:
            error_msg = response.json().get("detail", "Error desconocido")
            print(f"Error ({response.status_code}): {error_msg}")
            return None
            
    except FileNotFoundError:
        print(f"Archivo no encontrado: {image_path}")
        return None
    except requests.exceptions.Timeout:
        print("Timeout en la request")
        return None
    except Exception as e:
        print(f"Error inesperado: {e}")
        return None


# Uso:
vector = extract_facial_vector("mi_rostro.jpg")
if vector:
    print(f"Éxito: Vector de {len(vector)} dimensiones")


Ejemplo 3: Comparar dos vectores faciales
------------------------------------------
import numpy as np
from scipy.spatial.distance import euclidean

# Asumir que ya tienes dos vectores extraídos
vector1 = [...]  # Del endpoint 1
vector2 = [...]  # Del endpoint 2

# Calcular similitud euclidiana
distance = euclidean(vector1, vector2)

# Threshold típico: < 0.6 = mismo rostro
if distance < 0.6:
    print("✓ Es el mismo rostro (similitud alta)")
else:
    print("✗ Rostros diferentes")

============================================================
COMPARACIÓN CON OTROS ENDPOINTS
============================================================

Endpoint               | Función                      | Output
─────────────────────────────────────────────────────────
/api/v1/scan-ine       | Extrae texto de INE          | Texto OCR
/api/v1/scan-ine-parsed| Extrae + parsea INE          | Campos estructurados
/api/v1/enroll         | Guarda biometría (CURP+vec)  | Status + mensaje
/api/v1/extract-vector | Solo extrae vector facial    | Vector 128D ✨ NUEVO
────────────────────────────────────────────────────────

============================================================
NOTAS IMPORTANTES
============================================================

1. REQUISITOS DE IMAGEN:
   ✓ Debe contener exactamente 1 rostro
   ✓ Mínimo 100x100 píxeles
   ✓ Rostro debe estar visible y bien iluminado
   ✓ Formatos soportados: JPG, PNG, GIF, BMP, TIFF

2. PERFORMANCE:
   └─ Primer request: ~2-5 segundos (carga de modelos dlib)
   └─ Requests subsecuentes: ~0.5-1 segundo

3. VECTOR FACIAL:
   └─ Generado por face_recognition (que usa dlib)
   └─ 128 dimensiones (estándar de la librería)
   └─ Invariante a rostros del mismo individuo
   └─ Útil para comparación y búsqueda biométrica

4. DIFERENCIA CON /api/v1/enroll:
   ├─ extract-vector: Solo extrae vector (útil para búsqueda)
   └─ enroll: Guarda vector + CURP + metadata (persistencia)

============================================================
"""

# Mostrar documentación
if __name__ == "__main__":
    print(__doc__)
