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
        # Lógica de negocio sencilla: limpiar espacios extra por separado
        nombres_limpios = " ".join(payload.nombre.strip().split())
        paterno_limpio = " ".join(payload.apellido_paterno.strip().split())
        
        # El materno a veces no existe en algunas personas, lo manejamos seguro
        materno_limpio = ""
        if payload.apellido_materno:
            materno_limpio = " ".join(payload.apellido_materno.strip().split())
        
        # Llamar a la capa de base de datos pasando los campos separados
        resultado = create_user_with_biometrics(
            nombre=nombres_limpios,
            primer_apellido=paterno_limpio,
            segundo_apellido=materno_limpio,
            curp=payload.curp,
            email=payload.email,
            facial_vector=payload.vector_facial
        )
        
        return resultado
        
    except HTTPException:
        raise # Dejamos pasar los errores 400 controlados (CURP duplicado, etc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")