export function getCookie(name: string): string | null {
  // Verificamos si estamos en el navegador
  if (typeof document === 'undefined') return null;

  const nameLenPlus = (name.length + 1);
  const cookieArr = document.cookie.split(';');

  for (let i = 0; i < cookieArr.length; i++) {
    let cookie = cookieArr[i].trim();
    if (cookie.substring(0, nameLenPlus) === `${name}=`) {
      return decodeURIComponent(cookie.substring(nameLenPlus));
    }
  }
  
  return null;
}