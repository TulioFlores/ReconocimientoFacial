from pydantic import BaseModel, Field
from typing import Optional


class TextExtractionResponse(BaseModel):
    """Respuesta con el texto extraído de la INE"""
    texto_completo: str = Field(..., description="Texto completo extraído de la imagen INE")