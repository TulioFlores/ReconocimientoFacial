#!/usr/bin/env python
"""
Script para capturar el error 500 completo
"""
import cv2
import numpy as np
import requests
import os
import tempfile

BASE_URL = "http://localhost:8000"
ENDPOINT = "/api/v1/extract-vector"
temp_dir = tempfile.gettempdir()

print("=" * 80)
print("CAPTURANDO ERROR 500 COMPLETO")
print("=" * 80)

# Crear imagen 100x100
img = np.ones((100, 100, 3), dtype=np.uint8) * 200
test_image_path = os.path.join(temp_dir, "test_100x100.png")
cv2.imwrite(test_image_path, img)

print(f"\n📤 Enviando request...")
try:
    with open(test_image_path, "rb") as f:
        files = {"file": ("test_100x100.png", f, "image/png")}
        response = requests.post(
            f"{BASE_URL}{ENDPOINT}",
            files=files,
            timeout=10
        )
    
    print(f"📥 Status Code: {response.status_code}")
    print(f"   Content-Type: {response.headers.get('content-type', 'N/A')}")
    print(f"   Content-Length: {len(response.text)} bytes")
    
    print("\n--- Raw Response ---")
    print(response.text[:2000])  # Primeros 2000 caracteres
    print("--- End Response ---\n")
    
    # Intentar parsear como JSON
    try:
        data = response.json()
        print("✓ JSON válido detectado")
        print(data)
    except Exception as e:
        print(f"✗ No es JSON válido: {e}")
    
except Exception as e:
    print(f"\n❌ Error en request: {e}")

finally:
    try:
        os.remove(test_image_path)
    except:
        pass
