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
    
    Compara un vector facial pre-extraído con todos los vectores almacenados
    en la base de datos. Es más eficiente que /login cuando el vector ya ha sido
    extraído en el cliente.
    
    Args:
        payload: LoginVectorRequest con el vector facial de 128 dimensiones
        
    Returns:
        LoginResponse con información del usuario autenticado
        
    Raises:
        HTTPException 401: Si no se encontró coincidencia
        HTTPException 400: Si el vector tiene dimensiones incorrectas
        HTTPException 500: Si hay error en la base de datos
    """
    try:
        # 1. Validar que el vector tenga 128 dimensiones
        print(f"\n[LOGIN DEBUG] --- Inicio verificación de login ---")
        print(f"[LOGIN DEBUG] Tipo de vector recibido: {type(payload.vector_facial)}")
        print(f"[LOGIN DEBUG] Longitud del vector: {len(payload.vector_facial)}")
        print(f"[LOGIN DEBUG] Primeros 5 valores del vector: {payload.vector_facial[:5]}")
        
        if len(payload.vector_facial) != 128:
            raise HTTPException(
                status_code=400,
                detail=f"El vector debe tener exactamente 128 dimensiones, se recibieron {len(payload.vector_facial)}"
            )
        
        login_vector = payload.vector_facial
        print(f"[LOGIN DEBUG] Vector de login validado correctamente ✓")
        
        # 2. Obtener todos los embeddings de la base de datos
        print(f"[LOGIN DEBUG] Obteniendo embeddings de Supabase...")
        all_embeddings = get_all_embeddings()
        print(f"[LOGIN DEBUG] Total de usuarios registrados: {len(all_embeddings)}")
        
        if not all_embeddings:
            raise HTTPException(
                status_code=401, 
                detail="No hay usuarios registrados en el sistema"
            )
        
        # 3. Comparar con todos los embeddings y encontrar la mejor coincidencia
        best_match = None
        best_distance = float('inf')
        
        print(f"[LOGIN DEBUG] Iniciando comparación de vectores...")
        
        for idx, embedding_record in enumerate(all_embeddings):
            # Extraer el vector guardado de la base de datos
            stored_vector = embedding_record.get('embedding', [])
            
            print(f"\n[LOGIN DEBUG] Usuario {idx + 1}: {embedding_record.get('full_name', 'N/A')}")
            print(f"[LOGIN DEBUG]   - Tipo de vector almacenado: {type(stored_vector)}")
            print(f"[LOGIN DEBUG]   - Longitud: {len(stored_vector)}")
            if len(stored_vector) > 0:
                print(f"[LOGIN DEBUG]   - Primeros 5 valores: {stored_vector[:5]}")
            
            # Validar que el vector tenga 128 dimensiones
            if len(stored_vector) != 128:
                print(f"[LOGIN DEBUG]   ⚠️ Vector inválido (longitud: {len(stored_vector)}), saltando...")
                continue
            
            # Calcular distancia euclidiana
            distance = compare_facial_encodings(login_vector, stored_vector)
            print(f"[LOGIN DEBUG]   - Distancia: {distance:.4f}")
            
            # Mantener track de la mejor coincidencia
            if distance < best_distance:
                best_distance = distance
                best_match = embedding_record
                print(f"[LOGIN DEBUG]   ✓ Nueva mejor coincidencia encontrada")
        
        print(f"\n[LOGIN DEBUG] Comparación completada.")
        
        # 4. Validar si hay coincidencia válida (tolerancia por defecto 0.6)
        print(f"[LOGIN DEBUG] Mejor distancia encontrada: {best_distance:.4f}")
        print(f"[LOGIN DEBUG] Tolerancia máxima: 0.6")
        
        if best_match is None or best_distance >= 0.6:
            print(f"[LOGIN DEBUG] ❌ Sin coincidencia válida (distancia por encima del umbral)")
            raise HTTPException(
                status_code=401,
                detail="No se encontró coincidencia. Rostro no reconocido en el sistema."
            )
        
        print(f"[LOGIN DEBUG] ✓ Coincidencia encontrada: {best_match['full_name']}")
        
        # 5. Calcular nivel de confianza (invertir la distancia)
        # Distancia 0.0 = 100% confianza, Distancia 0.6 = ~0% confianza
        confidence = max(0.0, 1.0 - (best_distance / 0.6))
        print(f"[LOGIN DEBUG] Confianza calculada: {confidence:.2%}")
        print(f"[LOGIN DEBUG] --- Fin de verificación de login ---\n")
        
        # Establecer cookie de sesión
        response.set_cookie(
            key="user_session",
            value=best_match['user_id'],
            httponly=True,  # No accesible por JavaScript (mayor seguridad)
            max_age=86400,  # 24 horas
            samesite="lax",
            secure=False    # Cambiar a True en producción con HTTPS
        )
        
        # 6. Retornar información del usuario
        return LoginResponse(
            status="success",
            message=f"Bienvenido {best_match['full_name']}",
            user_id=best_match['user_id'],
            full_name=best_match['full_name'],
            curp=best_match['curp'],
            email=best_match['email'],
            confidence=confidence
        )
    
    except HTTPException:
        raise  # Dejamos pasar los errores HTTP controlados
    
    except ValueError as e:
        # Errores en la validación del vector
        raise HTTPException(status_code=400, detail=f"Error en el vector: {str(e)}")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")
