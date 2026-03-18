from typing import List
import numpy as np
import cv2
import traceback
import re
import os

# Deshabilitar verificación de conectividad de PaddleOCR ANTES de importar
os.environ['PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK'] = 'True'

from app.models.ine_model import INEResponse

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
            lang=lang,               # <-- 1. Asegurar explícitamente el uso de CPU
            enable_mkldnn=False,          # <-- 2. Aceleración matemática (Si crashea en Windows, ponlo en False)
            cpu_threads=6,               # <-- 3. Asignar los hilos de tu Ryzen 5 (tiene 12 hilos, 6 es ideal)
            use_angle_cls=False,
            det_limit_side_len=760,      # <-- 4. ¡CRÍTICO! Limita la resolución interna para la detección
            ocr_version='PP-OCRv3'
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
        
        # --- NUEVO: REDIMENSIONAR IMAGEN ANTES DEL OCR ---
        # Si la imagen es más grande de 1200 píxeles, la achicamos manteniendo la proporción
        max_dimension = 1200
        alto, ancho = image.shape[:2]

        if max(alto, ancho) > max_dimension:
            escala = max_dimension / float(max(alto, ancho))
            nuevo_alto = int(alto * escala)
            nuevo_ancho = int(ancho * escala)
            # Sobrescribimos la variable 'image' con la versión pequeña
            image = cv2.resize(image, (nuevo_ancho, nuevo_alto), interpolation=cv2.INTER_AREA)
            print(f"[DEBUG] Imagen redimensionada a: {image.shape} para acelerar procesamiento")
        # -------------------------------------------------

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


def parse_ine_text(raw_text: str) -> INEResponse:
    """
    Extrae y parsea los campos de una INE mexicana desde texto OCR crudo.
    
    Utiliza expresiones regulares para identificar:
    - SEXO: H o M
    - CURP: 18 caracteres alpanuméricos
    - Clave de Elector: 18 caracteres alpanuméricos
    - Fecha de Nacimiento: DD/MM/YYYY
    - Sección: 4 dígitos
    - Nombre completo: Dividido en apellido_paterno, apellido_materno, nombre
    - Domicilio: Texto de dirección
    
    Args:
        raw_text: Texto crudo extraído por PaddleOCR
    
    Returns:
        INEResponse con los campos extraídos
    """
    # Limpiar espacios múltiples
    text = " ".join(raw_text.split())
    
    data = {}
    
    # 1. SEXO: H o M después de SEXO
    sexo_match = re.search(r'SEXO\s*([HM])', text, re.IGNORECASE)
    if sexo_match:
        data['sexo'] = sexo_match.group(1).upper()
    
    # 2. CURP: 4 letras, 6 números, H/M, 5 letras, 1 alfanumérico, 1 número (18 caracteres)
    curp_match = re.search(r'[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d', text)
    data['curp'] = curp_match.group(0) if curp_match else None
    
    # 3. Clave de Elector: 6 letras, 8 números, 1 letra, 3 números (18 caracteres)
    clave_match = re.search(r'[A-Z]{6}\d{8}[A-Z]\d{3}', text)
    data['clave_elector'] = clave_match.group(0) if clave_match else None
    
    # 4. Fecha de Nacimiento: DD/MM/YYYY
    fecha_match = re.search(r'\d{2}/\d{2}/\d{4}', text)
    data['fecha_nacimiento'] = fecha_match.group(0) if fecha_match else None
    
    # 5. Sección: 4 dígitos después de SECCIÓN
    seccion_match = re.search(r'SECCIÓN\s+(\d{4})', text, re.IGNORECASE)
    data['seccion'] = seccion_match.group(1) if seccion_match else None
    
    # 6. Nombre Completo: Entre SEXO [H/M] y DOMICILIO
    # Usamos \s* en lugar de \s+ antes del [HM] por si el OCR junta "SEXOH"
    nombre_match = re.search(r'SEXO\s*[HM]\s+(.+?)\s+DOMICILIO', text, re.IGNORECASE)
    
    if nombre_match:
        nombre_completo = nombre_match.group(1).strip()
        palabras = nombre_completo.split()
        
        # Dividir: primero y segundo par de palabras son apellidos
        if len(palabras) >= 3:
            data['apellido_paterno'] = palabras[0]
            data['apellido_materno'] = palabras[1]
            data['nombre'] = " ".join(palabras[2:])
        elif len(palabras) == 2:
            data['apellido_paterno'] = palabras[0]
            data['apellido_materno'] = palabras[1]
            data['nombre'] = None
        elif len(palabras) == 1:
            data['apellido_paterno'] = palabras[0]
            data['apellido_materno'] = None
            data['nombre'] = None
    else:
        data['apellido_paterno'] = None
        data['apellido_materno'] = None
        data['nombre'] = None
    
    # 7. Domicilio: Entre DOMICILIO y CLAVE DE ELECTOR
    domicilio_match = re.search(r'DOMICILIO\s+(.+?)\s+CLAVE DE ELECTOR', text, re.IGNORECASE)
    data['domicilio'] = domicilio_match.group(1).strip() if domicilio_match else None
    
    # Crear objeto INEResponse filtrando valores None
    return INEResponse(**{k: v for k, v in data.items() if v is not None})