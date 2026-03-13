from fastapi import HTTPException
from app.config.config import supabase
from typing import List, Dict, Any
import json

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


def get_all_embeddings() -> List[Dict[str, Any]]:
    """
    Obtiene todos los embeddings faciales de la base de datos con la información del usuario.
    
    Returns:
        Lista de diccionarios con estructura:
        {
            'embedding_id': int,
            'user_id': int,
            'embedding': list[float],
            'full_name': str,
            'curp': str,
            'email': str
        }
    
    Raises:
        HTTPException: Error al acceder a la base de datos
    """
    try:
        print(f"\n[DB DEBUG] Consultando embeddings de Supabase...")
        # Hacer join entre face_embeddings y users_metadata
        response = supabase.table("face_embeddings")\
            .select("id, user_id, embedding, users_metadata(id, full_name, curp, email)")\
            .execute()
        
        print(f"[DB DEBUG] Respuesta de Supabase recibida")
        print(f"[DB DEBUG] Total de registros: {len(response.data) if response.data else 0}")
        
        embeddings_data = []
        
        if response.data:
            for idx, record in enumerate(response.data):
                embedding = record.get('embedding', [])
                user_info = record.get('users_metadata', {})
                
                print(f"\n[DB DEBUG] Registro {idx + 1}:")
                print(f"[DB DEBUG]   - ID embedding: {record.get('id')}")
                print(f"[DB DEBUG]   - user_id: {record.get('user_id')}")
                print(f"[DB DEBUG]   - Tipo de embedding (RAW): {type(embedding)}")
                
                # ⚠️ SOLUCIÓN: Si el embedding es un STRING JSON, parsearlo
                if isinstance(embedding, str):
                    print(f"[DB DEBUG]   ⚠️ El embedding está como STRING JSON, parseando...")
                    try:
                        embedding = json.loads(embedding)
                        print(f"[DB DEBUG]   ✓ Parseado correctamente")
                    except json.JSONDecodeError as e:
                        print(f"[DB DEBUG]   ❌ Error al parsear JSON: {str(e)}")
                        embedding = []
                
                print(f"[DB DEBUG]   - Tipo de embedding (DESPUÉS): {type(embedding)}")
                print(f"[DB DEBUG]   - Longitud embedding: {len(embedding) if isinstance(embedding, (list, tuple)) else 'N/A'}")
                
                if len(embedding) > 0 and len(embedding) <= 10:
                    print(f"[DB DEBUG]   - Primeros valores: {embedding}")
                elif len(embedding) > 10:
                    print(f"[DB DEBUG]   - Primeros 5 valores: {embedding[:5]}")
                
                if isinstance(user_info, list):
                    user_info = user_info[0] if user_info else {}
                    print(f"[DB DEBUG]   - user_info era lista, tomando primer elemento")
                
                full_name = user_info.get('full_name', '')
                print(f"[DB DEBUG]   - Usuario: {full_name}")
                
                embeddings_data.append({
                    'embedding_id': record.get('id'),
                    'user_id': record.get('user_id'),
                    'embedding': embedding,
                    'full_name': full_name,
                    'curp': user_info.get('curp', ''),
                    'email': user_info.get('email', '')
                })
        
        print(f"\n[DB DEBUG] Total de embeddings retornados: {len(embeddings_data)}\n")
        return embeddings_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener embeddings: {str(e)}")