#!/usr/bin/env python
"""
Script para debuggear dónde se cuelga extract_facial_encoding
"""
import sys
import os

sys.path.insert(0, r'C:\Users\tulio\OneDrive\Escritorio\ReconocimientoFacial\backend\app')
os.chdir(r'C:\Users\tulio\OneDrive\Escritorio\ReconocimientoFacial\backend\app')

print("Testing extract_facial_encoding with detailed debugging...")
print("=" * 80)

import cv2
import numpy as np

print("\n1. Crear imagen de prueba")
img = np.ones((100, 100, 3), dtype=np.uint8) * 200
print(f"   ✓ Imagen creada: shape={img.shape}, dtype={img.dtype}")

print("\n2. Importar face_service")
from services.face_service import _get_face_recognition
print("   ✓ face_service importado")

print("\n3. Obtener face_recognition")
try:
    face_rec = _get_face_recognition()
    print(f"   ✓ face_recognition obtenido: {face_rec}")
except Exception as e:
    print(f"   ✗ Error obteniendo face_recognition: {e}")
    sys.exit(1)

print("\n4. Convertir BGR a RGB")
try:
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    print(f"   ✓ Conversión exitosa: shape={img_rgb.shape}")
except Exception as e:
    print(f"   ✗ Error en cvtColor: {e}")
    sys.exit(1)

print("\n5. Detectar rostros (face_locations)...")
try:
    print("   Llamando face_recognition.face_locations()...")
    face_locations = face_rec.face_locations(img_rgb, model='hog')
    print(f"   ✓ face_locations completado: {len(face_locations)} rostros")
except Exception as e:
    print(f"   ✗ Error en face_locations: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n6. Extraer encodings...")
try:
    face_encodings = face_rec.face_encodings(img_rgb, face_locations)
    print(f"   ✓ face_encodings completado: {len(face_encodings)} encodings")
except Exception as e:
    print(f"   ✗ Error en face_encodings: {e}")
    sys.exit(1)

print("\n" + "=" * 80)
print("✓ TODOS LOS PASOS COMPLETADOS")
