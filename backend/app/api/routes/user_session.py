# Archivo: routers/users.py (o donde guardes tus rutas)

from fastapi import APIRouter, Request, HTTPException
# Importa tu función de base de datos desde donde la tengas
from app.db.user_repository import get_user_profile 

# 1. Creamos el router para agrupar todo lo relacionado a usuarios
router = APIRouter(
    tags=["Perfil de Usuario"]
)

# 2. Definimos el endpoint usando el router que acabamos de crear
@router.get("/me")
async def get_current_user(request: Request):
    """
    Endpoint que lee la cookie de sesión y devuelve los datos del usuario logueado.
    """
    user_id = request.cookies.get("user_session")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="No hay sesión activa")
        
    try:
        user_profile = get_user_profile(user_id)
        
        if not user_profile:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
            
        return user_profile
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))