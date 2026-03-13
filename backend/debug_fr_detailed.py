#!/usr/bin/env python
"""
Debug del import de face_recognition
"""
import sys
import os

print("Python executable:", sys.executable)
print("Python version:", sys.version)
print("Site packages:")

import site
for path in site.getsitepackages():
    print(f"  {path}")

print("\nBuscando face_recognition...")
try:
    import face_recognition
    print("✓ face_recognition importado")
except ImportError as e:
    print(f"✗ Error al importar face_recognition: {e}")
    
print("\nBuscando face_recognition_models...")
try:
    import face_recognition_models
    print("✓ face_recognition_models importado")
    print(f"  Ubicación: {face_recognition_models.__file__}")
except ImportError as e:
    print(f"✗ Error al importar face_recognition_models: {e}")
    
print("\nIntentando cargar modelos de dlib...")
try:
    import face_recognition
    print("  Comprobando atributos de face_recognition:")
    print(f"    - face_locations disponible: {hasattr(face_recognition, 'face_locations')}")
    print(f"    - face_encodings disponible: {hasattr(face_recognition, 'face_encodings')}")
    
    # Intenta cargar los archivos de modelos
    import face_recognition_models.models as models_module
    print("  Models module cargado")
    print(f"    - Ubicación: {models_module.__file__}")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
