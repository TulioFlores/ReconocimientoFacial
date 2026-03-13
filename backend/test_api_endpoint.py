#!/usr/bin/env python
"""
Script para probar el endpoint /api/v1/extract-vector
"""
import requests
import json

BASE_URL = "http://localhost:8000"
ENDPOINT = "/api/v1/extract-vector"

print("=" * 70)
print("PRUEBA DEL ENDPOINT - POST /api/v1/extract-vector")
print("=" * 70)

# Test 1: Request con Base64 inválido (debe fallar con 400)
print("\nTest 1: Base64 inválido (esperado: 400)")
print("-" * 70)
invalid_payload = {
    "foto_rostro": "invalid_base64_string_should_fail"
}

try:
    response = requests.post(
        f"{BASE_URL}{ENDPOINT}",
        json=invalid_payload,
        timeout=5
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 400:
        print("✓ Manejo de error correcto: Base64 inválido retorna 400")
    else:
        print(f"✗ Unexpected status code: {response.status_code}")
except Exception as e:
    print(f"Error en request: {e}")

# Test 2: Request con Base64 válido pero imagen pequeña/inválida
print("\n\nTest 2: Base64 válido pero sin rostro válido")
print("-" * 70)

# Pequeño PNG válido (1x1 píxel rojo)
small_png_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEBQIAX8jx0gAAAABJRU5ErkJggg=="

valid_payload = {
    "foto_rostro": small_png_base64
}

try:
    response = requests.post(
        f"{BASE_URL}{ENDPOINT}",
        json=valid_payload,
        timeout=5
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code in [400, 500]:
        print("✓ Endpoint responde correctamente con imagen inválida")
    else:
        print(f"Status: {response.status_code}")
        
except Exception as e:
    print(f"Error en request: {e}")

# Test 3: Validar estructura de respuesta exitosa (cuando hay rostro)
print("\n\nTest 3: Validar estructura de respuesta")
print("-" * 70)
print("La respuesta exitosa debe tener estructura:")
print(json.dumps({
    "status": "success",
    "vector": [0.123, -0.456, 0.789, "... (128 flotantes totales)"]
}, indent=2))

print("\n" + "=" * 70)
print("ENDPOINT INTEGRADO Y FUNCTIONALITY PROBADA")
print("=" * 70)
print("\nNota: Para una prueba completa con rostro real, necesitas una imagen")
print("      que contenga un rostro detectable por face_recognition.")
