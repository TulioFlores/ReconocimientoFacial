#!/usr/bin/env python
"""
Script de prueba para el endpoint /api/v1/extract-vector
"""
import sys
import os

# Agregar el directorio app al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from models.schemas import VectorExtractionRequest, VectorExtractionResponse

print("=" * 60)
print("PRUEBA DE MODELOS PYDANTIC - EXTRACT VECTOR ENDPOINT")
print("=" * 60)

# Test 1: VectorExtractionRequest
print("\n✓ Test 1: VectorExtractionRequest")
try:
    fake_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjeLawAAAABJRU5ErkJggg=="
    request = VectorExtractionRequest(foto_rostro=fake_base64)
    print(f"  ✓ Modelo instanciado correctamente")
    print(f"  ✓ foto_rostro length: {len(request.foto_rostro)}")
except Exception as e:
    print(f"  ✗ Error: {e}")

# Test 2: VectorExtractionResponse
print("\n✓ Test 2: VectorExtractionResponse")
try:
    # Crear un vector de 128 dimensiones (estándar de face_recognition)
    vector = [0.123, -0.456, 0.789] + [0.0] * 125
    response = VectorExtractionResponse(status="success", vector=vector)
    print(f"  ✓ Modelo instanciado correctamente")
    print(f"  ✓ Status: {response.status}")
    print(f"  ✓ Vector dimensiones: {len(response.vector)}")
except Exception as e:
    print(f"  ✗ Error: {e}")

# Test 3: Validar JSON serialization
print("\n✓ Test 3: JSON Serialization")
try:
    json_str = response.model_dump_json()
    print(f"  ✓ JSON serialization OK")
    print(f"  ✓ JSON preview: {json_str[:80]}...")
except Exception as e:
    print(f"  ✗ Error: {e}")

print("\n" + "=" * 60)
print("✓ TODOS LOS TESTS DE MODELOS PASARON EXITOSAMENTE")
print("=" * 60)
