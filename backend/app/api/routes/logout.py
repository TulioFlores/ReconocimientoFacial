from fastapi import APIRouter, HTTPException, Response
router = APIRouter()
@router.post("/logout")
async def logout(response: Response):
    """
    Endpoint para cerrar sesión eliminando las cookies.
    """
    # 1. Eliminamos la cookie de sesión (HttpOnly)
    response.delete_cookie(
        key="user_session",
        path="/",
        samesite="lax",
        httponly=True
    )
    
    # 2. Eliminamos la cookie de confianza (pública)
    response.delete_cookie(
        key="login_confidence",
        path="/",
        samesite="lax",
        httponly=False
    )
    
    return {"status": "success", "message": "Sesión cerrada correctamente"}