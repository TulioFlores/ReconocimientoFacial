/**
 * Utilidad para manejar cookies del usuario
 * Almacena información del usuario autenticado
 */

export interface UserData {
  user_id: string;
  full_name: string;
  curp: string;
  email: string;
  confidence: number;
}

const COOKIE_NAME = 'user_data';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 días en segundos

/**
 * Guarda la información del usuario en una cookie
 */
export function saveUserCookie(userData: UserData) {
  try {
    const encodedData = encodeURIComponent(JSON.stringify(userData));
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + COOKIE_MAX_AGE);
    
    document.cookie = `${COOKIE_NAME}=${encodedData}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Strict`;
    console.log('[COOKIE] Datos de usuario guardados en cookie');
  } catch (error) {
    console.error('[COOKIE] Error guardando cookie:', error);
  }
}

/**
 * Obtiene la información del usuario de la cookie
 */
export function getUserCookie(): UserData | null {
  try {
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find(cookie => cookie.startsWith(`${COOKIE_NAME}=`));
    
    if (!userCookie) {
      console.log('[COOKIE] No se encontró cookie de usuario');
      return null;
    }
    
    const cookieValue = userCookie.split('=')[1];
    const decodedData = decodeURIComponent(cookieValue);
    const userData = JSON.parse(decodedData) as UserData;
    
    console.log('[COOKIE] Datos de usuario recuperados:', userData.full_name);
    return userData;
  } catch (error) {
    console.error('[COOKIE] Error recuperando cookie:', error);
    return null;
  }
}

/**
 * Elimina la cookie de usuario (logout)
 */
export function deleteUserCookie() {
  try {
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict`;
    console.log('[COOKIE] Cookie de usuario eliminada (logout)');
  } catch (error) {
    console.error('[COOKIE] Error eliminando cookie:', error);
  }
}

/**
 * Verifica si el usuario está autenticado
 */
export function isUserAuthenticated(): boolean {
  const userData = getUserCookie();
  return userData !== null;
}
