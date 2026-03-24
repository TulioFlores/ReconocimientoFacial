from fastapi import APIRouter, HTTPException, Response
from app.models.schemas import LoginRequest, LoginResponse, LoginErrorResponse, LoginVectorRequest
from app.services.face_service import extract_facial_encoding, compare_facial_encodings
from app.db.user_repository import get_all_embeddings
from app.utils.image_utils import decode_base64_to_opencv

# Creamos un router específico para todo lo relacionado con login
router = APIRouter()


@router.post("/login/verify", response_model=LoginResponse)
async def verify_login_with_vector(payload: LoginVectorRequest, response: Response):
    """
    Endpoint para hacer login usando un vector facial pre-extraído.
    """
    try:
        # 1. Validar que el vector tenga 128 dimensiones
        print(f"\n[LOGIN DEBUG] --- Inicio verificación de login ---")
        
        if len(payload.vector_facial) != 128:
            raise HTTPException(
                status_code=400,
                detail=f"El vector debe tener exactamente 128 dimensiones, se recibieron {len(payload.vector_facial)}"
            )
        
        login_vector = payload.vector_facial
        
        # 2. Obtener todos los embeddings de la base de datos
        all_embeddings = get_all_embeddings()
        
        if not all_embeddings:
            raise HTTPException(
                status_code=401, 
                detail="No hay usuarios registrados en el sistema"
            )
        
        # 3. Comparar con todos los embeddings y encontrar la mejor coincidencia
        best_match = None
        best_distance = float('inf')
        
        for idx, embedding_record in enumerate(all_embeddings):
            stored_vector = embedding_record.get('embedding', [])
            
            # Reconstruimos el nombre temporalmente solo para los logs
            temp_name = f"{embedding_record.get('nombre', '')} {embedding_record.get('primer_apellido', '')}".strip()
            
            if len(stored_vector) != 128:
                print(f"[LOGIN DEBUG] ⚠️ Vector inválido en usuario {temp_name}, saltando...")
                continue
            
            # Calcular distancia euclidiana
            distance = compare_facial_encodings(login_vector, stored_vector)
            
            # Mantener track de la mejor coincidencia
            if distance < best_distance:
                best_distance = distance
                best_match = embedding_record
        
        # 4. Validar si hay coincidencia válida (tolerancia por defecto 0.6)
        if best_match is None or best_distance >= 0.6:
            raise HTTPException(
                status_code=401,
                detail="No se encontró coincidencia. Rostro no reconocido en el sistema."
            )
        
        # --- AQUÍ ESTÁ LA CORRECCIÓN CLAVE ---
        # Reconstruimos el nombre completo a partir de las nuevas columnas
        nombre = best_match.get('nombre', '')
        apellido1 = best_match.get('primer_apellido', '')
        apellido2 = best_match.get('segundo_apellido', '')
        
        # Unimos las partes, ignorando las vacías (por si no tiene segundo apellido)
        partes_nombre = [nombre, apellido1, apellido2]
        full_name_reconstruido = " ".join([p for p in partes_nombre if p]).strip()
        
        print(f"[LOGIN DEBUG] ✓ Coincidencia encontrada: {full_name_reconstruido}")
        
        # 5. Calcular nivel de confianza
        confidence = max(0.0, 1.0 - (best_distance / 0.6))
        
        # Establecer cookie de sesión
        response.set_cookie(
            key="user_session",
            value=best_match['user_id'],
            httponly=True,
            max_age=86400,
            samesite="lax",
            secure=False
        )
        
        # 6. Retornar información del usuario
        return LoginResponse(
            status="success",
            message=f"Bienvenido {full_name_reconstruido}",
            user_id=best_match['user_id'],
            full_name=full_name_reconstruido, # Enviamos el nombre reconstruido al frontend
            curp=best_match.get('curp', ''),
            email=best_match.get('email', ''),
            confidence=confidence
        )
    
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Error en el vector: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")


