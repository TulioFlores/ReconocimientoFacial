#!/usr/bin/env python
"""
Script para probar con imagen de mayor tamaño (100x100 mínimo)
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
print("PRUEBA CON IMAGEN MÍNIMA (100x100)")
print("=" * 80)

# Crear una imagen simple PNG 100x100 (sin rostro aún, solo para ver si pasa validaciones)
img = np.ones((100, 100, 3), dtype=np.uint8) * 200  # Imagen gris claro
test_image_path = os.path.join(temp_dir, "test_100x100.png")
cv2.imwrite(test_image_path, img)

print(f"\n✓ Imagen creada: {test_image_path}")
print(f"  Dimensiones: {img.shape}")
print(f"  Tamaño archivo: {os.path.getsize(test_image_path)} bytes")

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
    data = response.json()
    
    print("\nRespuesta:")
    import json
    print(json.dumps(data, indent=2))
    
    if response.status_code == 500:
        print("\n❌ ERROR 500 CONFIRMADO")
        print("   Error: " + data.get('detail', 'Sin detalles'))
    elif response.status_code == 400:
        print("\n⚠ ERROR 400:")
        print("   " + data.get('detail', 'Sin detalles'))
    
except Exception as e:
    print(f"\n❌ Error en request: {e}")

finally:
    try:
        os.remove(test_image_path)
    except:
        pass

print("\n" + "=" * 80)
print("PRÓXIMO PASO:")
print("=" * 80)
print("Si el error persiste en 500, probamente sea en extract_facial_encoding()")
print("Posibles causas:")
print("  1. cv2.cvtColor() falla con cierto tipo de imagen")
print("  2. face_recognition.face_locations() lanza error inesperado")
print("  3. Problema en imports de face_service")
