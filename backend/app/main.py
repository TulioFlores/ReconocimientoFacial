from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import cv2
from models.ine_model import TextExtractionResponse
from services.ocr_service import extract_text_from_image

app = FastAPI(title="AutoTramite OCR Service")

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
