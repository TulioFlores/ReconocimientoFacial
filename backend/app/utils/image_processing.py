import cv2
import numpy as np

def preprocess_image(image):
    """
    Preprocesamiento de imagen para limpiar la INE antes de OCR.
    Elimina hologramas, fondos complejos y ruido.
    
    Args:
        image: Imagen en formato OpenCV (BGR)
    
    Returns:
        Imagen preprocesada y limpia para OCR
    """
    # 1. Convertir a escala de grises
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # 2. Redimensionar si la imagen es muy pequeña (mejorar OCR)
    height, width = gray.shape
    if height < 800 or width < 800:
        scale_factor = max(1.5, min(800/height, 800/width))
        gray = cv2.resize(gray, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_CUBIC)
    
    # 3. Aplicar threshold adaptativo para eliminar fondos complejos y hologramas
    # Esto convierte la imagen en blanco y negro, separando texto del fondo
    thresh = cv2.adaptiveThreshold(
        gray, 
        255, 
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 
        11,  # Tamaño del bloque
        2    # Constante restada
    )
    
    # 4. Invertir la imagen si es necesario (EasyOCR prefiere texto oscuro en fondo claro)
    # Contar píxeles negros vs blancos para decidir si invertir
    black_pixels = np.sum(thresh == 0)
    white_pixels = np.sum(thresh == 255)
    
    if black_pixels > white_pixels:
        thresh = cv2.bitwise_not(thresh)
    
    # 5. Operaciones morfológicas leves para mejorar calidad de texto
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 1))
    morphed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    
    return morphed