# 🍪 Sistema de Cookies para Autenticación

## Implementación Completada

He reemplazado `localStorage` por cookies en todo el sistema de autenticación.

---

## 📝 Archivos Creados

### 1. **[utils/cookieUtils.ts](../utils/cookieUtils.ts)**
Función principal para manejar cookies:

```typescript
// Guardar información del usuario
saveUserCookie({
  user_id: "...",
  full_name: "TULIO ELIAS FLORES RAMIREZ",
  curp: "...",
  email: "...",
  confidence: 0.5909
});

// Obtener información del usuario
const userData = getUserCookie();

// Eliminar cookie (logout)
deleteUserCookie();

// Verificar si está autenticado
isUserAuthenticated();
```

### 2. **[utils/authUtils.ts](../utils/authUtils.ts)**
Hook para autenticación con logout:

```typescript
const { logout, isAuthenticated } = useAuth();

// Logout
logout(); // Elimina cookie y redirige a /login

// Verificar autenticación
if (isAuthenticated()) {
  // Usuario autenticado
}
```

---

## 🔄 Cambios en Componentes

### [app/login/page.tsx](../app/login/page.tsx)
```typescript
// ❌ ANTES:
localStorage.setItem('user', JSON.stringify({...}));

// ✅ DESPUÉS:
saveUserCookie({
  user_id: data.user_id,
  full_name: data.full_name,
  // ...
});
```

### [components/dashboard/UserProfileCard.tsx](../components/dashboard/UserProfileCard.tsx)
```typescript
// ❌ ANTES:
const userData = JSON.parse(localStorage.getItem('user') || '{}');

// ✅ DESPUÉS:
const userData = getUserCookie();
```

---

## 🔒 Ventajas de Cookies vs localStorage

| Característica | localStorage | Cookies |
|---|---|---|
| **Seguridad** | ❌ Accesible por JavaScript (XSS) | ✅ Más seguro (SameSite) |
| **HTTPS** | ❌ Funciona en HTTP | ✅ Se puede restringir a HTTPS |
| **Duración** | Indefinida (manual) | ✅ Expira automáticamente |
| **Servidor** | ❌ Solo cliente | ✅ Se envía al servidor |
| **CORS** | ❌ No se envía cross-origin | ✅ Compatible con CORS |

---

## 🍪 Configuración de Cookies

```typescript
// Duración: 7 días
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

// Seguridad:
document.cookie = `${COOKIE_NAME}=${encodedData}; 
  path=/;                    // Disponible en toda la app
  expires=${expiryDate};     // Expira en 7 días
  SameSite=Strict`           // Protección contra CSRF
```

---

## 📋 Datos Almacenados en Cookie

```javascript
{
  user_id: "cfe40086-686a-4b3b-831b-86e57c9f34ca",
  full_name: "TULIO ELIAS FLORES RAMIREZ",
  curp: "XXXX...",
  email: "user@example.com",
  confidence: 0.5909  // 59.09% de confianza biométrica
}
```

---

## 🛡️ Seguridad

Las cookies se configura con:
- ✅ **`path=/`** - Disponible en toda la aplicación
- ✅ **`SameSite=Strict`** - Protección contra CSRF (Cross-Site Request Forgery)
- ✅ **`expires`** - Expira automáticamente en 7 días
- ✅ **JSON codificado** - Los datos se codifican con `encodeURIComponent`

---

## 🚀 Uso en Componentes

### Leer información del usuario:
```typescript
'use client'
import { useEffect, useState } from 'react';
import { getUserCookie, UserData } from '@/utils/cookieUtils';

export default function MyComponent() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const user = getUserCookie();
    setUserData(user);
  }, []);

  return <div>{userData?.full_name}</div>;
}
```

### Hacer logout:
```typescript
'use client'
import { useAuth } from '@/utils/authUtils';

export default function LogoutButton() {
  const { logout } = useAuth();

  return <button onClick={logout}>Cerrar Sesión</button>;
}
```

---

## 🔍 Debugging

Las funciones incluyen logs para debugging:

```
[COOKIE] Datos de usuario guardados en cookie
[COOKIE] Datos de usuario recuperados: TULIO ELIAS FLORES RAMIREZ
[COOKIE] No se encontró cookie de usuario
[COOKIE] Cookie de usuario eliminada (logout)
[AUTH] Cerrando sesión...
```

Ver en la consola del navegador (F12 → Console)

---

## ✅ Checklist de Implementación

- [x] Crear utilidad de cookies (`cookieUtils.ts`)
- [x] Crear hook de autenticación (`authUtils.ts`)
- [x] Actualizar login para usar cookies
- [x] Actualizar dashboard para leer de cookies
- [x] Mostrar datos del usuario en UserProfileCard
- [x] Mostrar confianza biométrica

---

## 🔄 Flujo de Autenticación

```
1. Usuario captura rostro
    ↓
2. /api/v1/extract-vector → Vector facial (128D)
    ↓
3. /login/verify → Comparación en Supabase
    ↓
4. ✅ Login exitoso
    ↓
5. saveUserCookie() → Datos guardados en cookie
    ↓
6. Router.push('/dashboard')
    ↓
7. UserProfileCard → Lee de cookie y muestra datos
    ↓
8. Usuario ve su perfil verificado biométricamente
```

---

## 📱 Duración de la Sesión

- **Duración:** 7 días
- **Expiración automática:** Después de 7 días sin actividad
- **Renovación:** Se puede renovar con cada login

---

## 🚀 Próximos Pasos (Opcional)

Si quieres mejorar aún más:

1. **Refresh token:** Renovar cookie automáticamente
2. **Server-side sessions:** Usar sesiones en el backend
3. **JWT (JSON Web Token):** Para APIs más seguras
4. **HttpOnly cookies:** Cookies inaccesibles desde JavaScript (máxima seguridad)
