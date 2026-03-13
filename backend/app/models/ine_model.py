from pydantic import BaseModel, Field
from typing import Optional


class TextExtractionResponse(BaseModel):
    """Respuesta con el texto extraído de la INE"""
    texto_completo: str = Field(..., description="Texto completo extraído de la imagen INE")


class INEResponse(BaseModel):
    """Datos extraídos y parseados de una credencial INE mexicana"""
    sexo: Optional[str] = Field(None, description="Sexo (H o M)")
    nombre: Optional[str] = Field(None, description="Nombre del titular")
    apellido_paterno: Optional[str] = Field(None, description="Apellido paterno")
    apellido_materno: Optional[str] = Field(None, description="Apellido materno")
    curp: Optional[str] = Field(None, description="CURP (18 caracteres)")
    clave_elector: Optional[str] = Field(None, description="Clave de elector (18 caracteres)")
    fecha_nacimiento: Optional[str] = Field(None, description="Fecha de nacimiento (DD/MM/YYYY)")
    domicilio: Optional[str] = Field(None, description="Domicilio del titular")
    seccion: Optional[str] = Field(None, description="Sección electoral (4 dígitos)")