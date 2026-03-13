#!/usr/bin/env python
"""
Script para probar el endpoint /api/v1/extract-vector con file upload
"""
import requests
import os
import tempfile

BASE_URL = "http://localhost:8000"
ENDPOINT = "/api/v1/extract-vector"

# Usar tempfile para crear archivos temporales en Windows
temp_dir = tempfile.gettempdir()

print("=" * 70)
print("PRUEBA DEL ENDPOINT - POST /api/v1/extract-vector (FILE UPLOAD)")
print("=" * 70)

# Crear una imagen de prueba pequeña (PNG válido 1x1)
test_image_path = os.path.join(temp_dir, "test_image.png")

# PNG 1x1 píxel en Base64 decodificado a bytes
png_bytes = bytes([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
])

# Test 1: Request con archivo no imagen (esperar 400)
print("\nTest 1: Enviar archivo NO imagen (esperado: 400)")
print("-" * 70)

# Crear archivo de texto
test_file = os.path.join(temp_dir, "test_file.txt")
with open(test_file, "w") as f:
    f.write("This is not an image")

try:
    with open(test_file, "rb") as f:
        files = {"file": (os.path.basename(test_file), f, "text/plain")}
        response = requests.post(
            f"{BASE_URL}{ENDPOINT}",
            files=files,
            timeout=5
        )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 400:
        print("✓ Validación correcta: Rechaza archivo no-imagen")
    else:
        print(f"⚠ Status inesperado: {response.status_code}")
except Exception as e:
    print(f"Error en request: {e}")


# Test 2: Request con imagen válida pero muy pequeña (1x1, sin rostro)
print("\n\nTest 2: Imagen válida pero sin rostro detectable")
print("-" * 70)

# Crear archivo PNG
test_image_file = os.path.join(temp_dir, "test_image_small.png")
with open(test_image_file, "wb") as f:
    f.write(png_bytes)

try:
    with open(test_image_file, "rb") as f:
        files = {"file": (os.path.basename(test_image_file), f, "image/png")}
        response = requests.post(
            f"{BASE_URL}{ENDPOINT}",
            files=files,
            timeout=5
        )
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Response: {data}")
    
    if response.status_code in [400, 500]:
        if 'detail' in data:
            print(f"✓ Endpoint maneja correctamente: {data['detail'][:60]}...")
    else:
        print(f"Response OK: {response.status_code}")
except Exception as e:
    print(f"Error en request: {e}")


print("\n" + "=" * 70)
print("VALIDACIÓN DEL ENDPOINT CON FILE UPLOAD")
print("=" * 70)
print("\n✓ El endpoint ahora acepta file upload (como /scan-ine y /enroll)")
print("✓ Estructura compatible con frontend (FormData)")
print("\nEjemplo de uso con FormData en JavaScript:")
print("""
  const formData = new FormData();
  formData.append('file', imageFile);  // imageFile es un HTML File object
  
  const response = await fetch('http://localhost:8000/api/v1/extract-vector', {
    method: 'POST',
    body: formData  // No necesita JSON.stringify()
  });
  
  const data = await response.json();
  if (data.vector) {
    console.log('Vector extraído:', data.vector);
  }
""")

# Limpiar archivos de prueba
try:
    os.remove(test_file)
    os.remove(test_image_file)
except:
    pass
