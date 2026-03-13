from fastapi import HTTPException
from app.config.config import supabase

def create_user_with_biometrics(full_name: str, curp: str, email: str, facial_vector: list[float]):
    """
    Capa de Acceso a Datos (DAL). 
    Única función autorizada para hablar con Supabase sobre este tema.
    """
    try:
        # 1. Guardar en users_metadata
        user_data = {
            "full_name": full_name,
            "curp": curp,
            "email": email
        }
        
        user_response = supabase.table("users_metadata").insert(user_data).execute()
        user_id = user_response.data[0]['id']

        # 2. Guardar en face_embeddings
        embedding_data = {
            "user_id": user_id,
            "embedding": facial_vector 
        }
        
        supabase.table("face_embeddings").insert(embedding_data).execute()

        return {
            "status": "success", 
            "user_id": user_id,
            "message": "Usuario registrado correctamente"
        }

    except Exception as e:
        error_msg = str(e)
        if "users_metadata_curp_key" in error_msg:
            raise HTTPException(status_code=400, detail=f"El CURP {curp} ya está registrado.")
        elif "users_metadata_email_key" in error_msg:
            raise HTTPException(status_code=400, detail=f"El correo {email} ya está registrado.")
            
        raise HTTPException(status_code=500, detail="Error en la base de datos.")