#!/usr/bin/env python
"""
Script para verificar que todos los imports funcionan
cuando se ejecuta como en el servidor
"""
import sys
import os

# Agregar directorio app al path
sys.path.insert(0, r'C:\Users\tulio\OneDrive\Escritorio\ReconocimientoFacial\backend\app')
os.chdir(r'C:\Users\tulio\OneDrive\Escritorio\ReconocimientoFacial\backend\app')

print("=" * 80)
print("VERIFICANDO IMPORTS")
print("=" * 80)

# Step 1: Importar main
print("\n1️⃣ Importando main...")
try:
    from main import app
    print("   ✓ main importado")
except Exception as e:
    print(f"   ✗ Error: {e}")
    sys.exit(1)

# Step 2: Importar face_service
print("\n2️⃣ Importando face_service...")
try:
    from services.face_service import extract_facial_encoding
    print("   ✓ face_service importado")
except Exception as e:
    print(f"   ✗ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Step 3: Intentar llamar extract_facial_encoding con imagen de prueba
print("\n3️⃣ Probando extract_facial_encoding con imagen de prueba...")
try:
    import cv2
    import numpy as np
    
    # Crear imagen de prueba
    img = np.ones((100, 100, 3), dtype=np.uint8) * 200
    
    print("   Llamando extract_facial_encoding()...")
    result = extract_facial_encoding(img)
    print(f"   ✓ Resultado: {len(result)} dimensiones")
    
except ValueError as e:
    print(f"   ⚠ ValueError (esperado - sin rostro): {str(e)[:80]}")
except Exception as e:
    print(f"   ✗ Error inesperado: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 80)
print("✓ TODOS LOS IMPORTS Y FUNCIONES FUNCIONAN")
print("=" * 80)
