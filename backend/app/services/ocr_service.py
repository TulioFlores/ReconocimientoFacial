from typing import List, Tuple
import numpy as np
import cv2

try:
    import easyocr
except Exception as e:
    easyocr = None


_readers = {}


def _get_reader(lang: str = "es"):
    if easyocr is None:
        raise RuntimeError("easyocr no está instalado. Instala con: pip install easyocr")
    if lang not in _readers:
        _readers[lang] = easyocr.Reader([lang], gpu=False)
    return _readers[lang]


def _bbox_top(bbox: List[Tuple[float, float]]) -> float:
    return min(pt[1] for pt in bbox)


def extract_text_from_image(image: np.ndarray, lang: str = "es") -> List[str]:
    """Extrae texto de una imagen (numpy array) usando EasyOCR.

    Args:
        image: Imagen en formato BGR/GRAY (OpenCV numpy array).
        lang: Código de idioma para EasyOCR (por defecto 'es').

    Returns:
        Lista de líneas de texto extraídas, ordenadas top->bottom.
    """
    if image is None:
        return []

    if not isinstance(image, np.ndarray):
        raise TypeError("image debe ser un numpy.ndarray")

    # Convertir a RGB (EasyOCR espera imágenes en formato similar a PIL RGB)
    img_rgb = None
    if image.ndim == 2:
        img_rgb = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    elif image.shape[2] == 4:
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
    else:
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    reader = _get_reader(lang)

    # readtext devuelve lista de tuples: (bbox, text, confidence)
    results = reader.readtext(img_rgb)

    if not results:
        return []

    # Ordenar por coordenada vertical superior del bbox
    results_sorted = sorted(results, key=lambda r: _bbox_top(r[0]))

    texts = [r[1] for r in results_sorted]
    return texts
