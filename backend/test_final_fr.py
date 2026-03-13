#!/usr/bin/env python
"""
Intento de debug del import de face_recognition
"""
import sys
import os

# Asegurarse de que face_recognition_models está en el path
sys.path.insert(0, r'C:\Users\tulio\AppData\Local\Programs\Python\Python313\Lib\site-packages')

print("Step 1: Cer que face_recognition_models existe")
try:
    import face_recognition_models
    print(f"✓ face_recognition_models located at: {face_recognition_models.__file__}")
except Exception as e:
    print(f"✗ Error importing face_recognition_models: {e}")
    sys.exit(1)

print("\nStep 2: Importar face_recognition")
try:
    import face_recognition
    print("✓ face_recognition imported successfully")
except Exception as e:
    print(f"✗ Error importing face_recognition: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\nStep 3: Verificar funciones")
print(f"  - face_locations: {hasattr(face_recognition, 'face_locations')}")
print(f"  - face_encodings: {hasattr(face_recognition, 'face_encodings')}")

print("\n✓ TODO FUNCIONANDO")
