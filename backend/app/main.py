from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import cv2

from app.models.ine_model import TextExtractionResponse, INEResponse
from app.models.schemas import BiometricEnrollResponse, VectorExtractionResponse
from app.services.ocr_service import extract_text_from_image, parse_ine_text
from app.services.face_service import extract_facial_encoding
from app.utils.image_utils import validate_image_format
from app.api.routes import enrollment, login, user_session, fiscal, logout
app = FastAPI(title="AutoTramite OCR Service")

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(enrollment.router)
app.include_router(login.router)
app.include_router(user_session.router)
app.include_router(fiscal.router)
app.include_router(logout.router)
@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/v1/scan-ine", response_model=TextExtractionResponse)
async def scan_ine(file: UploadFile = File(...)):
    """
    Endpoint para extraer texto de una imagen de INE.
    
    Args:
        file: Archivo de imagen (JPG, PNG, etc.)
    
    Returns:
        TextExtractionResponse con el texto completo extraído
    """
    if not (file.content_type and file.content_type.startswith("image/")):
        raise HTTPException(status_code=400, detail="El archivo enviado no es una imagen")

    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="No se pudo decodificar la imagen")

        # Extracción de texto con PaddleOCR
        extracted_text = extract_text_from_image(img, lang="es")
        
        # Validar que se extrajo texto
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="No se pudo extraer texto de la imagen")
        
        return {"texto_completo": extracted_text}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando la imagen: {str(e)}")


@app.post("/api/v1/scan-ine-parsed", response_model=INEResponse)
async def scan_ine_parsed(file: UploadFile = File(...)):
    """
    Endpoint para extraer y parsear texto de una imagen de INE.
    
    Returns el texto extraído dividido en campos estructurados:
    - nombre, apellido_paterno, apellido_materno
    - sexo, curp, clave_elector, fecha_nacimiento
    - domicilio, sección
    
    Args:
        file: Archivo de imagen (JPG, PNG, etc.)
    
    Returns:
        INEResponse con los campos estructurados extraídos
    """
    if not (file.content_type and file.content_type.startswith("image/")):
        raise HTTPException(status_code=400, detail="El archivo enviado no es una imagen")

    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="No se pudo decodificar la imagen")

        # 1. Extracción de texto con PaddleOCR
        extracted_text = extract_text_from_image(img, lang="es")
        
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="No se pudo extraer texto de la imagen")
        
        # 2. Parsear el texto extraído
        ine_data = parse_ine_text(extracted_text)
        
        return ine_data

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando la imagen: {str(e)}")


""" @app.post("/api/v1/enroll", response_model=BiometricEnrollResponse)
async def enroll_biometric(curp: str = Form(...), file: UploadFile = File(...)):
    
    Endpoint para enrolamiento biométrico facial.
    
    Recibe una imagen del rostro en un archivo, la decodifica, extrae las características
    faciales y las guarda asociadas a la CURP del usuario.
    
    Args:
        curp: CURP del usuario (Form parameter)
        file: Archivo de imagen del rostro (JPG, PNG, etc.)
        
    Returns:
        BiometricEnrollResponse con el estatus de la operación
        
    Raises:
        HTTPException 400: Si la imagen es inválida o no se detecta rostro
        HTTPException 500: Si hay error en la extracción de características
    
    try:
        # Validar que sea una imagen
        if not (file.content_type and file.content_type.startswith("image/")):
            raise HTTPException(
                status_code=400,
                detail="El archivo enviado no es una imagen válida"
            )
        
        # Validar CURP
        if not curp or len(curp) != 18:
            raise HTTPException(
                status_code=400,
                detail="CURP inválida. Debe tener exactamente 18 caracteres"
            )
        
        print(f"[INFO] Iniciando enrolamiento para CURP: {curp}")
        
        # 1. Leer y decodificar imagen
        try:
            contents = await file.read()
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise HTTPException(
                    status_code=400,
                    detail="No se pudo decodificar la imagen"
                )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error al leer la imagen: {str(e)}"
            )
        
        # 2. Validar dimensiones de imagen
        try:
            validate_image_format(img, min_width=100, min_height=100)
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Formato de imagen inválido: {str(e)}"
            )
        
        print(f"[INFO] Imagen decodificada. Dimensiones: {img.shape}")
        
        # 3. Extraer características faciales (embedding)
        print(f"[INFO] Extrayendo características faciales...")
        try:
            facial_encoding = extract_facial_encoding(img)
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=f"No se detectó rostro en la imagen: {str(e)}"
            )
        except NotImplementedError as e:
            raise HTTPException(
                status_code=501,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error extrayendo características faciales: {str(e)}"
            )
        
        # 4. Simular guardado en base de datos
        # TODO: Reemplazar con código real de persistencia
        print(f"[INFO] Guardando en DB: CURP={curp}, encoding_dim={len(facial_encoding)}")
        
        # Simulamos que se guardó correctamente
        # En producción aquí iría:
        # - Conexión a base de datos (SQLAlchemy, MongoDB, etc.)
        # - Encriptación del vector de características
        # - Guardado de CURP + facial_encoding + metadata
        
        success = True  # Simulado
        
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Error al guardar los datos biométricos en la base de datos"
            )
        
        print(f"[INFO] Biometría enrolada exitosamente para CURP: {curp}")
        
        return BiometricEnrollResponse(
            status="success",
            message=f"Biometría enrolada correctamente para la CURP: {curp}",
            curp=curp
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error inesperado en enrolamiento: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error inesperado: {str(e)}"
        )
 """

@app.post("/api/v1/extract-vector", response_model=VectorExtractionResponse)
async def extract_vector(file: UploadFile = File(...)):
    """
    Endpoint para extracción de vector facial (embedding).
    
    Recibe una imagen de rostro mediante file upload y retorna el vector de características
    faciales de 128 dimensiones extraído usando face_recognition.
    
    Args:
        file: Archivo de imagen (JPG, PNG, etc.)
    
    Returns:
        VectorExtractionResponse con el vector facial extraído
        
    Raises:
        HTTPException 400: Si no se detecta rostro, hay múltiples rostros o imagen inválida
        HTTPException 500: Si hay error inesperado en la extracción
    """
    try:
        # Validar que sea una imagen
        if not (file.content_type and file.content_type.startswith("image/")):
            raise HTTPException(
                status_code=400,
                detail="El archivo enviado no es una imagen válida"
            )
        
        print(f"[INFO] Iniciando extracción de vector facial")
        
        # 1. Leer y decodificar archivo a numpy array (BGR)
        try:
            contents = await file.read()
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise HTTPException(
                    status_code=400,
                    detail="No se pudo decodificar la imagen"
                )
            
            print(f"[INFO] Imagen decodificada. Dimensiones: {img.shape}")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error al leer la imagen: {str(e)}"
            )
        
        # 2. Validar formato de imagen
        try:
            validate_image_format(img, min_width=100, min_height=100)
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Formato de imagen inválido: {str(e)}"
            )
        
        print(f"[INFO] Validación de imagen completada")
        
        # 3. Extraer vector facial (embedding)
        try:
            print(f"[INFO] Extrayendo características faciales...")
            facial_vector = extract_facial_encoding(img)
        except ValueError as e:
            # Esto ocurre cuando no se detecta rostro o detecta múltiples rostros
            raise HTTPException(
                status_code=400,
                detail=f"Error en detección facial: {str(e)}"
            )
        except NotImplementedError as e:
            raise HTTPException(
                status_code=501,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error inesperado extrayendo características: {str(e)}"
            )
        
        print(f"[INFO] Vector extraído exitosamente. Dimensiones: {len(facial_vector)}")
        
        return VectorExtractionResponse(
            status="success",
            vector=facial_vector
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error inesperado en extracción de vector: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error inesperado: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
