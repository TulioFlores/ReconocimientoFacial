/**
 * Utilidad para manejar autenticación y logout
 */

import { useRouter } from 'next/navigation';
import { deleteUserCookie, getUserCookie } from './cookieUtils';

export function useAuth() {
  const router = useRouter();

  const logout = () => {
    console.log('[AUTH] Cerrando sesión...');
    deleteUserCookie();
    router.push('/login');
  };

  const isAuthenticated = () => {
    return getUserCookie() !== null;
  };

  return { logout, isAuthenticated };
}
