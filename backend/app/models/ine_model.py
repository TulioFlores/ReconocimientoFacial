from pydantic import BaseModel, Field, validator
from typing import Optional
import re

class TextExtractionResponse(BaseModel):
    """Respuesta con el texto extraído de la INE"""
    texto_completo: str = Field(..., description="Texto completo extraído de la imagen INE")


class INEResponse(BaseModel):
    sexo: Optional[str] = Field(None, pattern=r"^(H|M)$")
    nombre: Optional[str] = None
    apellido_paterno: Optional[str] = None
    apellido_materno: Optional[str] = None
    curp: Optional[str] = Field(None, pattern=r"^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$")
    clave_elector: Optional[str] = Field(None, pattern=r"^[A-Z]{6}\d{8}[A-Z]\d{3}$")
    fecha_nacimiento: Optional[str] = Field(None, pattern=r"^\d{2}/\d{2}/\d{4}$")
    domicilio: Optional[str] = None
    seccion: Optional[str] = Field(None, pattern=r"^\d{4}$")

    @validator('nombre', 'apellido_paterno', 'apellido_materno', pre=True, always=True)
    def clean_names(cls, v):
        if v:
            # Limpiar nombres: solo letras, espacios y caracteres especiales comunes en español
            clean = re.sub(r'[^A-ZÁÉÍÓÚÑ\s]', '', str(v).upper().strip())
            return clean if clean else None
        return v

    @validator('domicilio', pre=True, always=True)
    def clean_address(cls, v):
        if v:
            # Limpiar dirección: permitir letras, números, espacios y algunos símbolos comunes
            clean = re.sub(r'[^A-ZÁÉÍÓÚÑ0-9\s\.,#-]', '', str(v).upper().strip())
            return clean if clean else None
        return v