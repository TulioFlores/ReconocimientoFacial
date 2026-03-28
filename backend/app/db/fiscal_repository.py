from fastapi import HTTPException
from app.config.config import supabase

def insert_fiscal_data(user_id: str, datos: dict):
    """
    Separa los datos recibidos del formulario e inserta una parte 
    en la tabla 'domicilios' y otra en la tabla 'fiscal_data'.
    """
    try:
        # 1. Preparamos el diccionario exclusivo para la tabla 'domicilios'
        datos_domicilio = {
            "user_id": user_id,
            "codigo_postal": datos.get("codigo_postal"),
            "tipo_vialidad": datos.get("tipo_vialidad"),
            "nombre_vialidad": datos.get("nombre_vialidad"),
            "numero_exterior": datos.get("numero_exterior"),
            "numero_interior": datos.get("numero_interior"),
            "colonia": datos.get("colonia"),
            "localidad": datos.get("localidad"),
            "municipio": datos.get("municipio"),
            "entidad_federativa": datos.get("entidad_federativa"),
            "entre_calle_1": datos.get("entre_calle_1"),
            "entre_calle_2": datos.get("entre_calle_2")
        }

        # 2. Preparamos el diccionario exclusivo para la tabla 'fiscal_data'
        datos_fiscales = {
            "user_id": user_id,
            "rfc": datos.get("rfc"),
            "regimen_fiscal": datos.get("regimen_fiscal"),
            "situacion_contribuyente": datos.get("situacion_contribuyente")
            # created_at y updated_at se generan solos en Supabase
        }
        
        # 3. Hacemos el INSERT en la tabla 'domicilios'
        response_dom = supabase.table("domicilios").insert(datos_domicilio).execute()
        
        # 4. Hacemos el INSERT en la tabla 'fiscal_data'
        response_fisc = supabase.table("fiscal_data").insert(datos_fiscales).execute()
        
        # 5. Retornamos ambas respuestas por si el frontend necesita verificar algo
        return {
            "domicilio_guardado": response_dom.data,
            "fiscal_guardado": response_fisc.data
        }
        
    except Exception as e:
        print(f"[DB ERROR] Error al insertar datos en Supabase: {str(e)}")
        # Lanzamos el error para que el router lo atrape y envíe un código 500
        raise Exception(f"Error de base de datos al guardar la información: {str(e)}")

