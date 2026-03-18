# 1. Usar una versión de Linux ligera con Python
FROM python:3.11-slim

# 2. Carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Instalar librerías del sistema que Paddle, OpenCV y Dlib necesitan
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    cmake \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. Copiar e instalar los requerimientos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# 5. Copiar todo el código de tu backend
COPY . .

# 6. Exponer el puerto de FastAPI
EXPOSE 8000

# 7. Arrancar el servidor
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]