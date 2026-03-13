"""
Servicio de reconocimiento facial.
Extrae características faciales (embeddings) de imágenes usando face_recognition.
"""

import numpy as np
import cv2
from typing import List
import contextlib
import io

# NOTA: face_recognition se importa con LAZY LOADING en las funciones que lo necesitan
# para evitar que el servidor se bloquee al cargar dlib durante la inicialización.

_face_recognition = None

def _get_face_recognition():
    """Importa face_recognition de forma lazy"""
    global _face_recognition
    if _face_recognition is None:
        f = io.StringIO()
        with contextlib.redirect_stdout(f), contextlib.redirect_stderr(f):
            import face_recognition
        _face_recognition = face_recognition
    return _face_recognition


def extract_facial_encoding(image: np.ndarray) -> List[float]:
    """
    Extrae un vector de características faciales (embedding de 128D) de una imagen.
    
    Utiliza face_recognition (basado en dlib) para detectar el rostro y extraer sus características.
    
    Args:
        image: Imagen en formato OpenCV (BGR numpy array)
        
    Returns:
        List[float]: Vector de 128 números que representan las características faciales
        
    Raises:
        ValueError: Si no se detecta exactamente un rostro en la imagen
        RuntimeError: Si face_recognition no está instalado
    """
    face_recognition = _get_face_recognition()
    
    if face_recognition is None:
        raise RuntimeError(
            "face_recognition no está instalado. "
            "Instálalo con: pip install face_recognition"
        )
    
    # Validar entrada
    if image is None or image.size == 0:
        raise ValueError("La imagen está vacía o es None")
    
    if len(image.shape) != 3 or image.shape[2] != 3:
        raise ValueError("La imagen debe estar en formato BGR con 3 canales")
    
    # face_recognition espera imágenes en RGB, OpenCV las carga en BGR
    # Convertir BGR → RGB
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Detectar rostros en la imagen
    # model='hog' es más rápido, 'cnn' es más preciso (requiere GPU para ser práctico)
    face_locations = face_recognition.face_locations(img_rgb, model='hog')
    
    # Validar que se detectó exactamente un rostro
    if len(face_locations) == 0:
        raise ValueError(
            "No se detectó ningún rostro en la imagen. "
            "Asegúrate de que el rostro sea claramente visible y la imagen sea de buena calidad."
        )
    
    if len(face_locations) > 1:
        raise ValueError(
            f"Se detectaron {len(face_locations)} rostros en la imagen. "
            "La imagen debe contener solamente un rostro."
        )
    
    # Extraer el encoding (embeddings de 128 dimensiones)
    # face_encodings retorna una lista de arrays de 128D
    face_encodings = face_recognition.face_encodings(img_rgb, face_locations)
    
    if not face_encodings:
        raise ValueError(
            "No se pudo extraer el vector de características del rostro detectado"
        )
    
    # Convertir el array numpy a lista de floats
    facial_encoding = face_encodings[0].tolist()
    
    print(f"[DEBUG] Rostro detectado y codificado. Vector de 128 dimensiones extraído.")
    
    return facial_encoding


def compare_facial_encodings(
    encoding1: List[float], 
    encoding2: List[float], 
    tolerance: float = 0.6
) -> float:
    """
    Compara dos vectores de rostro y retorna la distancia euclidiana.
    
    Una distancia menor a la tolerancia indica que los dos rostros pertenecen a la misma persona.
    
    Args:
        encoding1: Primer vector de características (128D)
        encoding2: Segundo vector de características (128D)
        tolerance: Tolerancia máxima para considerar que son el mismo rostro (0-1, default 0.6)
        
    Returns:
        float: Distancia euclidiana entre los dos vectores (0.0 = idénticos, 1.0+ = diferentes)
    """
    face_recognition = _get_face_recognition()
    
    if face_recognition is None:
        raise RuntimeError(
            "face_recognition no está instalado. "
            "Instálalo con: pip install face_recognition"
        )
    
    # Validar dimensiones
    if len(encoding1) != 128 or len(encoding2) != 128:
        raise ValueError(
            f"Los encoding deben tener exactamente 128 dimensiones. "
            f"Obtenido: {len(encoding1)} y {len(encoding2)}"
        )
    
    # Convertir a numpy arrays si es necesario
    enc1 = np.array(encoding1) if isinstance(encoding1, list) else encoding1
    enc2 = np.array(encoding2) if isinstance(encoding2, list) else encoding2
    
    # Calcular distancia euclidiana
    distance = face_recognition.face_distance([enc1], enc2)[0]
    
    return float(distance)

