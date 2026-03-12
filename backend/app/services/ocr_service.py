from typing import List
import numpy as np
import cv2

try:
    import easyocr
except Exception:
    easyocr = None

# Diccionario para reutilizar el lector y no cargar el modelo en cada petición
_readers = {}

def _get_reader(lang: str = "es"):
    """
    Carga el modelo de EasyOCR solo una vez (Singleton) para ahorrar RAM.
    """
    if easyocr is None:
        raise RuntimeError("EasyOCR no instalado. Ejecuta: pip install easyocr")

    if lang not in _readers:
        # gpu=False si no tienes tarjeta NVIDIA configurada con CUDA
        _readers[lang] = easyocr.Reader([lang], gpu=False)
    return _readers[lang]

def extract_text_from_image(image: np.ndarray, lang: str = "es") -> str:
    """
    Extrae todo el texto de la imagen INE.
    Devuelve el texto completo como string.
    """
    try:
        reader = _get_reader(lang)

        # Extraer texto sin coordenadas (solo el contenido)
        results = reader.readtext(
            image,
            detail=0,  # Solo devuelve el texto sin coordenadas
            paragraph=False,
            contrast_ths=0.1,
            adjust_contrast=0.5,
            text_threshold=0.6,
            link_threshold=0.4,
            mag_ratio=1.5
        )

        # Unir todas las líneas extraídas
        full_text = "\n".join(results)

        return full_text

    except Exception as e:
        print(f"Error crítico en la extracción OCR: {e}")
        return ""