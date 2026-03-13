#!/usr/bin/env python
"""
Script para ejecutar el servidor en foreground y ver los logs,
luego hacer request al endpoint
"""
import subprocess
import time
import os
import sys

# Cambiar al directorio del app
os.chdir(r'C:\Users\tulio\OneDrive\Escritorio\ReconocimientoFacial\backend\app')

print("=" * 80)
print("LANZANDO SERVIDOR CON LOGS ACTIVOS")
print("=" * 80)
print("\nEl servidor mostrará logs a continuación...")
print("En otra terminal, ejecuta:")
print("  cd backend && python capture_error.py")
print("\n" + "=" * 80 + "\n")

# Lanzar el servidor
try:
    subprocess.run([sys.executable, "main.py"], check=False)
except KeyboardInterrupt:
    print("\n\nServidor detenido por usuario")
