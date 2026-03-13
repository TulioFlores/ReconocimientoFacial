#!/usr/bin/env python
"""
Script para debuggear el error 500 del endpoint extract-vector
"""
import requests
import os
import tempfile
import json

BASE_URL = "http://localhost:8000"
ENDPOINT = "/api/v1/extract-vector"

print("=" * 80)
print("DEBUGGING ENDPOINT - /api/v1/extract-vector (ERROR 500)")
print("=" * 80)

temp_dir = tempfile.gettempdir()

# PNG válido 1x1 píxel
png_bytes = bytes([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
])

test_image_file = os.path.join(temp_dir, "debug_image.png")
with open(test_image_file, "wb") as f:
    f.write(png_bytes)

print(f"\n🔍 Intentando subir imagen: {test_image_file}")
print(f"   Tamaño: {len(png_bytes)} bytes")

try:
    with open(test_image_file, "rb") as f:
        files = {"file": (os.path.basename(test_image_file), f, "image/png")}
        
        print(f"\n📤 Enviando request a {BASE_URL}{ENDPOINT}")
        response = requests.post(
            f"{BASE_URL}{ENDPOINT}",
            files=files,
            timeout=10
        )
    
    print(f"\n📥 Response Status Code: {response.status_code}\n")
    
    if response.status_code == 500:
        print("❌ ERROR 500 DETECTADO")
        print("-" * 80)
        print("Response Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
        
        print("\nResponse Body:")
        try:
            data = response.json()
            print(json.dumps(data, indent=2))
        except:
            print(f"  {response.text}")
        
        print("\n" + "=" * 80)
        print("ANÁLISIS POSIBLES CAUSAS:")
        print("=" * 80)
        print("1. extract_facial_encoding() lanza exception no capturada")
        print("2. Problema con numpy/cv2 en el procesamiento")
        print("3. Error en validación de imagen")
        print("4. Problema con módulo face_service")
        
    else:
        print(f"✓ Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
except requests.exceptions.Timeout:
    print("❌ TIMEOUT - Servidor no responde en 10 segundos")
    print("   Posible causa: extract_facial_encoding() se queda colgado")
except Exception as e:
    print(f"❌ ERROR EN REQUEST: {e}")

finally:
    try:
        os.remove(test_image_file)
    except:
        pass
