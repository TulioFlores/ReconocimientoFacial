"""
Utilidades para procesamiento de imágenes.
Conversión entre formatos Base64, numpy arrays, y OpenCV.
"""

import base64
import numpy as np
import cv2
from io import BytesIO


def decode_base64_to_opencv(base64_str: str) -> np.ndarray:
    """
    Decodifica una imagen en formato Base64 a un numpy array de OpenCV (BGR).
    
    Args:
        base64_str: String con la imagen en formato Base64
        
    Returns:
        numpy.ndarray: Imagen en formato BGR de OpenCV
        
    Raises:
        ValueError: Si la imagen Base64 es inválida o no se puede decodificar
        
    Example:
        >>> base64_image = "iVBORw0KGgoAAAANS..."
        >>> img = decode_base64_to_opencv(base64_image)
        >>> img.shape
        (480, 640, 3)
    """
    try:
        # Eliminar espacios en blanco
        base64_str = base64_str.strip()
        
        # Algunos prefijos de base64 incluyen schema, removerlos
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        
        # Decodificar el string Base64 a bytes
        img_bytes = base64.b64decode(base64_str)
        
        # Convertir bytes a numpy array
        nparr = np.frombuffer(img_bytes, np.uint8)
        
        # Decodificar la imagen con OpenCV (retorna BGR)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("La imagen Base64 decodificada no es válida")
        
        return img
        
    except Exception as e:
        raise ValueError(f"Error al decodificar imagen Base64: {str(e)}")


def encode_opencv_to_base64(img: np.ndarray, format: str = ".jpg") -> str:
    """
    Codifica una imagen de OpenCV a formato Base64.
    
    Args:
        img: Imagen de OpenCV (numpy array)
        format: Formato de imagen (ej. ".jpg", ".png")
        
    Returns:
        str: Imagen codificada en Base64
        
    Raises:
        ValueError: Si la imagen no se puede codificar
    """
    try:
        # Codificar la imagen al formato especificado
        success, encoded_img = cv2.imencode(format, img)
        
        if not success:
            raise ValueError(f"No se pudo codificar la imagen al formato {format}")
        
        # Convertir a Base64
        img_bytes = encoded_img.tobytes()
        base64_str = base64.b64encode(img_bytes).decode("utf-8")
        
        return base64_str
        
    except Exception as e:
        raise ValueError(f"Error al codificar imagen a Base64: {str(e)}")


def validate_image_format(img: np.ndarray, min_width: int = 100, min_height: int = 100) -> bool:
    """
    Valida que una imagen tenga dimensiones y formato válidos para procesamiento facial.
    
    Args:
        img: Imagen de OpenCV (numpy array)
        min_width: Ancho mínimo requerido
        min_height: Alto mínimo requerido
        
    Returns:
        bool: True si la imagen es válida
        
    Raises:
        ValueError: Si la imagen no es válida
    """
    if img is None:
        raise ValueError("La imagen es None")
    
    if not isinstance(img, np.ndarray):
        raise ValueError("La imagen no es un numpy array válido")
    
    if len(img.shape) != 3 or img.shape[2] != 3:
        raise ValueError("La imagen no tiene 3 canales (BGR/RGB)")
    
    height, width = img.shape[:2]
    
    if width < min_width or height < min_height:
        raise ValueError(
            f"Dimensiones de imagen insuficientes. "
            f"Se requiere mínimo {min_width}x{min_height}, obtenido {width}x{height}"
        )
    
    return True
