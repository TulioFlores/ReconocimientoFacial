from fastapi import APIRouter, HTTPException
from app.models.schemas import EnrollmentRequest
from app.db.user_repository import create_user_with_biometrics

# Creamos un router específico para todo lo relacionado con registros
router = APIRouter()

@router.post("/enroll")
async def enroll_user(payload: EnrollmentRequest):
    """
    Endpoint para registrar un usuario nuevo con su biometría.
    """
    try:
        # Lógica de negocio sencilla: unir el nombre
        full_name = f"{payload.nombre} {payload.apellido_paterno} {payload.apellido_materno}".strip()
        full_name = " ".join(full_name.split()) # Limpiar espacios extra
        
        # Llamar a la capa de base de datos
        resultado = create_user_with_biometrics(
            full_name=full_name,
            curp=payload.curp,
            email=payload.email,
            facial_vector=payload.vector_facial
        )
        
        return resultado
        
    except HTTPException:
        raise # Dejamos pasar los errores 400 controlados (CURP duplicado, etc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")