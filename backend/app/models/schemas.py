from pydantic import BaseModel, Field
from typing import List, Optional

class BiometricEnrollRequest(BaseModel):
    """
    Request para enrolamient biométrico facial.
    
    Recibe:
    - curp: CURP del usuario (18 caracteres)
    - foto_rostro: Imagen del rostro en formato Base64
    """
    curp: str = Field(
        ..., 
        min_length=18, 
        max_length=18,
        description="CURP del usuario (18 caracteres alfanuméricos)"
    )
    foto_rostro: str = Field(
        ..., 
        description="Imagen del rostro en formato Base64"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "curp": "FORT040617HJCLMLA9",
                "foto_rostro": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjeLawAAAABJRU5ErkJggg=="
            }
        }


class BiometricEnrollResponse(BaseModel):
    """Respuesta exitosa del enrolamiento biométrico"""
    status: str = Field(..., description="Estado de la operación (success)")
    message: str = Field(..., description="Mensaje descriptivo del resultado")
    curp: str = Field(..., description="CURP del usuario enrolado")


class VectorExtractionRequest(BaseModel):
    """
    Request para extracción de vector facial (embedding).
    
    Recibe:
    - foto_rostro: Imagen del rostro en formato Base64
    """
    foto_rostro: str = Field(
        ..., 
        description="Imagen del rostro en formato Base64"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "foto_rostro": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjeLawAAAABJRU5ErkJggg=="
            }
        }


class VectorExtractionResponse(BaseModel):
    """Respuesta con el vector facial extraído (embedding)"""
    status: str = Field(..., description="Estado de la operación (success)")
    vector: list[float] = Field(..., description="Vector facial de 128 dimensiones (embedding)")



class EnrollmentRequest(BaseModel):
    """Esquema de validación para los datos que llegan de React"""
    nombre: Optional[str] = ""
    apellido_paterno: Optional[str] = ""
    apellido_materno: Optional[str] = ""
    curp: str
    email: str
    vector_facial: List[float] # Lista de 128 dimensiones


class LoginRequest(BaseModel):
    """
    Request para hacer login usando reconocimiento facial.
    
    Recibe:
    - foto_rostro: Imagen del rostro en formato Base64
    """
    foto_rostro: str = Field(
        ..., 
        description="Imagen del rostro en formato Base64"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "foto_rostro": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjeLawAAAABJRU5ErkJggg=="
            }
        }


class LoginResponse(BaseModel):
    """Respuesta exitosa del login biométrico"""
    status: str = Field(..., description="Estado de la operación (success)")
    message: str = Field(..., description="Mensaje de bienvenida")
    user_id: str = Field(..., description="ID del usuario (UUID)")
    full_name: str = Field(..., description="Nombre completo del usuario")
    curp: str = Field(..., description="CURP del usuario")
    email: str = Field(..., description="Email del usuario")
    confidence: float = Field(..., description="Nivel de confianza de la coincidencia (0-1)")


class LoginErrorResponse(BaseModel):
    """Respuesta cuando no se encontró coincidencia"""
    status: str = Field(..., description="Estado de la operación (not_found/error)")
    message: str = Field(..., description="Mensaje de error o falta de coincidencia")


class LoginVectorRequest(BaseModel):
    """
    Request para hacer login usando un vector facial pre-extraído.
    
    Útil cuando el vector ya ha sido extraído en el cliente.
    """
    vector_facial: List[float] = Field(
        ..., 
        description="Vector facial de 128 dimensiones (embedding pre-extraído)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "vector_facial": [0.1, 0.2, 0.3, -0.1, -0.2]  # ... 128 valores total
            }
        }