from fastapi import HTTPException
from app.config.config import supabase
from typing import List, Dict, Any
import json

def create_user_with_biometrics(
    nombre: str, 
    primer_apellido: str, 
    segundo_apellido: str, 
    curp: str, 
    email: str, 
    facial_vector: list[float]
):
    """
    Capa de Acceso a Datos (DAL). 
    Única función autorizada para hablar con Supabase sobre este tema.
    """
    try:
        # 1. Guardar en users_metadata con las columnas separadas
        # NOTA: Asegúrate de que las llaves del diccionario coincidan EXACTAMENTE 
        # con cómo nombraste las columnas en Supabase (ej. "nombres" o "nombre")
        user_data = {
            "nombre": nombre,  
            "primer_apellido": primer_apellido,
            "segundo_apellido": segundo_apellido,
            "curp": curp,
            "email": email
        }
        
        user_response = supabase.table("users_metadata").insert(user_data).execute()
        user_id = user_response.data[0]['id']

        # 2. Guardar en face_embeddings (esto no cambia)
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
            raise HTTPException(status_code=400, detail=f"La CURP {curp} ya está registrada.")
        elif "users_metadata_email_key" in error_msg:
            raise HTTPException(status_code=400, detail=f"El correo {email} ya está registrado.")
            
        raise HTTPException(status_code=500, detail="Error en la base de datos.")


def get_all_embeddings() -> list[dict[str, Any]]:
    """
    Obtiene todos los embeddings faciales de la base de datos con la información del usuario.
    """
    try:
        print(f"\n[DB DEBUG] Consultando embeddings de Supabase...")
        
        # 1. EL CAMBIO CLAVE: Pedimos las columnas nuevas en el JOIN
        response = supabase.table("face_embeddings")\
            .select("id, user_id, embedding, users_metadata(id, nombre, primer_apellido, segundo_apellido, curp, email)")\
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
                
                # Manejo del STRING JSON
                if isinstance(embedding, str):
                    print(f"[DB DEBUG]   ⚠️ El embedding está como STRING JSON, parseando...")
                    try:
                        embedding = json.loads(embedding)
                    except json.JSONDecodeError as e:
                        print(f"[DB DEBUG]   ❌ Error al parsear JSON: {str(e)}")
                        embedding = []
                
                if isinstance(user_info, list):
                    user_info = user_info[0] if user_info else {}
                
                # 2. EXTRAEMOS LAS NUEVAS COLUMNAS (nombre en singular)
                nombre = user_info.get('nombre', '')
                primer_apellido = user_info.get('primer_apellido', '')
                segundo_apellido = user_info.get('segundo_apellido', '')
                
                # 3. RECONSTRUIMOS EL FULL NAME AQUÍ MISMO PARA EVITAR ERRORES EN OTROS LADOS
                partes_nombre = [nombre, primer_apellido, segundo_apellido]
                full_name_reconstruido = " ".join([p for p in partes_nombre if p]).strip()
                
                print(f"[DB DEBUG]   - Usuario: {full_name_reconstruido}")
                
                # 4. ARMAMOS EL DICCIONARIO CON TODAS LAS LLAVES POSIBLES
                embeddings_data.append({
                    'embedding_id': record.get('id'),
                    'user_id': record.get('user_id'),
                    'embedding': embedding,
                    'nombre': nombre,
                    'nombres': nombre, # Alias por si en el router usamos "nombres"
                    'primer_apellido': primer_apellido,
                    'segundo_apellido': segundo_apellido,
                    'full_name': full_name_reconstruido, # ¡Magia! El router anterior funcionará perfecto
                    'curp': user_info.get('curp', ''),
                    'email': user_info.get('email', '')
                })
        
        print(f"\n[DB DEBUG] Total de embeddings retornados: {len(embeddings_data)}\n")
        return embeddings_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener embeddings: {str(e)}")

        

def get_user_profile(user_id: str) -> dict:
    """
    Busca a un usuario por su ID en la base de datos y formatea su perfil.
    """
    try:
        # 1. Buscar en la tabla users_metadata
        user_response = supabase.table("users_metadata").select("*").eq("id", user_id).execute()
        
        if not user_response.data:
            return None # Si no encuentra al usuario, regresamos None
            
        user_data = user_response.data[0]
        
        # 2. Revisar si tiene datos en la tabla fiscal_data
        # (Si aún no creas esta tabla en Supabase, esto podría dar error, 
        # por eso lo envolvemos en un try/except pequeñito)
        has_fiscal_data = False
        try:
            fiscal_response = supabase.table("fiscal_data").select("id").eq("user_id", user_id).execute()
            if fiscal_response.data and len(fiscal_response.data) > 0:
                has_fiscal_data = True
        except Exception as e:
            print(f"[DB WARNING] No se pudo verificar fiscal_data (¿quizá no existe la tabla?): {e}")

        # 3. Reconstruir el nombre completo con las columnas nuevas
        nombre = user_data.get('nombre', '')
        apellido1 = user_data.get('primer_apellido', '')
        apellido2 = user_data.get('segundo_apellido', '')
        
        partes_nombre = [nombre, apellido1, apellido2]
        full_name = " ".join([p for p in partes_nombre if p]).strip()
        
        # 4. Retornar el diccionario listo para el frontend
        return {
            "user_id": user_id,
            "full_name": full_name,
            "curp": user_data.get('curp', ''),
            "email": user_data.get('email', ''),
            "has_fiscal_data": has_fiscal_data
        }
        
    except Exception as e:
        print(f"[DB ERROR] Error al obtener perfil de usuario: {str(e)}")
        raise Exception(f"Error interno al buscar usuario: {str(e)}")