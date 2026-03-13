from typing import List
import numpy as np
import cv2
import traceback

try:
    from paddleocr import PaddleOCR
except Exception:
    PaddleOCR = None

# Diccionario para reutilizar el lector
_readers = {}

def _get_reader(lang: str = "es"):
    """
    Carga el modelo de PaddleOCR solo una vez (Singleton) para ahorrar RAM.
    """
    if PaddleOCR is None:
        raise RuntimeError("PaddleOCR no instalado. Ejecuta: pip install paddleocr")

    if lang not in _readers:
        # Parámetros optimizados para PaddleOCR:
        # - use_angle_cls=True: Detecta ángulos de rotación del texto
        # - lang: español
        # - enable_mkldnn=False: Evita crasheos de C++ en Windows
        _readers[lang] = PaddleOCR(
            use_angle_cls=True, 
            lang=lang, 
            enable_mkldnn=False
        )
    
    return _readers[lang]

def extract_text_from_image(image: np.ndarray, lang: str = "es") -> str:
    """
    Extrae texto de una imagen usando PaddleOCR.
    Pasa la imagen directamente en memoria sin guardarla a disco.
    """
    try:
        # Validar imagen
        if image is None or image.size == 0:
            print("\n[ERROR] La imagen llegó vacía al OCR.\n")
            return ""
        
        print(f"[DEBUG] Imagen recibida. Dimensiones: {image.shape}, Tipo: {image.dtype}")
        
        # Obtener reader de PaddleOCR
        reader = _get_reader(lang)
        
        # OPCIÓN 1: Pasar directamente la imagen en memoria (sin archivo temporal)
        # PaddleOCR puede procesar directamente arrays de numpy
        print("[DEBUG] Procesando imagen directamente en memoria...")
        results = reader.ocr(image)
        
        # Debug: mostrar estructura de resultados
        print(f"[DEBUG] Resultados brutos de PaddleOCR: {type(results)} con {len(results) if results else 0} páginas")
        if results and len(results) > 0:
            print(f"[DEBUG] Primera página contiene {len(results[0])} líneas detectadas" if results[0] else "[DEBUG] Primera página vacía")
        
        # Extraer texto de los resultados
        texto_completo = ""
        if results and len(results) > 0:
            result = results[0]
            
            # El resultado es un diccionario con 'rec_texts' (lista de textos) y 'rec_scores' (confianzas)
            if hasattr(result, '__getitem__') and 'rec_texts' in result:
                rec_texts = result.get('rec_texts', [])
                rec_scores = result.get('rec_scores', [])
                
                print(f"[DEBUG] Textos detectados: {rec_texts}")
                print(f"[DEBUG] Confianzas: {rec_scores}")
                
                # Concatenar todos los textos detectados
                texto_completo = " ".join(rec_texts)
        
        texto_completo = texto_completo.strip()
        
        if texto_completo:
            print(f"\n[OCR DEBUG] Texto extraído: {texto_completo}\n")
        else:
            print("\n[OCR DEBUG] No se extrajo texto de la imagen\n")
        
        return texto_completo

    except Exception as e:
        print(f"\n[OCR ERROR FATAL] Ocurrió un error en la extracción:")
        traceback.print_exc()
        return ""