from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional

# IMPORTANTE: Ajusta esta ruta a donde hayas guardado la función de arriba
from app.db.fiscal_repository import insert_fiscal_data 

# 1. Creamos el router para agrupar lo relacionado a datos fiscales
router = APIRouter(
    prefix="/fiscal", # Todas las rutas aquí empezarán con /fiscal
    tags=["Datos Fiscales"]
)

# 2. Definimos el esquema de Pydantic basado en tu formulario de React
class FiscalDataCreate(BaseModel):
    rfc: str
    codigo_postal: str
    tipo_vialidad: str
    nombre_vialidad: str
    numero_exterior: str
    numero_interior: Optional[str] = None  # Opcional
    colonia: str
    localidad: Optional[str] = None        # Opcional
    municipio: str
    entidad_federativa: str
    entre_calle_1: Optional[str] = None    # Opcional
    entre_calle_2: Optional[str] = None    # Opcional
    regimen_fiscal: str
    situacion_contribuyente: str

# 3. Definimos el endpoint POST
@router.post("/guardar")
async def save_fiscal_data(data: FiscalDataCreate, request: Request):
    """
    Endpoint que recibe los datos fiscales del form, verifica la sesión
    y los inserta en la base de datos.
    """
    # Verificamos qué usuario está mandando los datos usando la cookie
    user_id = request.cookies.get("user_session")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="No hay sesión activa. Por favor, inicia sesión.")
        
    try:
        # Convertimos el modelo de Pydantic a un diccionario
        datos_dict = data.model_dump() # Extrae todos los campos a un dict
        
        # LLAMADA A LA BASE DE DATOS: 
        # Pasamos el user_id y los datos al repositorio
        resultado = insert_fiscal_data(user_id=user_id, datos=datos_dict)
        
        print(f"Datos insertados en BD correctamente: {resultado}")
        
        return {
            "status": "success", 
            "message": "Datos fiscales guardados correctamente",
            "data": resultado # Le podemos devolver al frontend lo que se guardó
        }
        
    except Exception as e:
        print(f"Error en endpoint /fiscal/guardar: {str(e)}")
        # Si la base de datos falla, le avisamos al frontend
        raise HTTPException(status_code=500, detail=str(e))
    

    # routers/fiscal.py

