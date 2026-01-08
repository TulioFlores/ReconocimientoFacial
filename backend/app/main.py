from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import cv2
import re

from app.services.ocr_service import extract_text_from_image
from app.utils.image_processing import preprocess_image

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


@app.post("/api/v1/scan-ine")
async def scan_ine(file: UploadFile = File(...)):
    if not (file.content_type and file.content_type.startswith("image/")):
        raise HTTPException(status_code=400, detail="El archivo enviado no es una imagen")

    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise HTTPException(status_code=400, detail="No se pudo decodificar la imagen")

        processed = preprocess_image(img)

        # extract_text_from_image should return a list of strings (lines)
        raw_text = extract_text_from_image(processed, lang="es")

        joined = "\n".join(raw_text) if isinstance(raw_text, (list, tuple)) else str(raw_text)
        upper = joined.upper()

        result = {"NOMBRE": None, "CURP": None, "DOMICILIO": None}

        # Buscar etiquetas explícitas
        for line in joined.splitlines():
            uline = line.upper()
            if "NOMBRE" in uline and not result["NOMBRE"]:
                result["NOMBRE"] = line.split(":", 1)[-1].strip() if ":" in line else line.strip()
            if "CURP" in uline and not result["CURP"]:
                m = re.search(r"[A-Z0-9]{18}", uline)
                result["CURP"] = m.group(0) if m else (line.split(":", 1)[-1].strip() if ":" in line else line.strip())
            if "DOMICILIO" in uline and not result["DOMICILIO"]:
                result["DOMICILIO"] = line.split(":", 1)[-1].strip() if ":" in line else line.strip()

        # Fallback: buscar CURP por patrón en todo el texto
        if not result["CURP"]:
            m = re.search(r"[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d", upper)
            if m:
                result["CURP"] = m.group(0)

        return {"success": True, "data": result, "raw_text": raw_text}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando la imagen: {e}")


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
