# Endpoint de Login por Reconocimiento Facial

## Descripción
El endpoint `/login` permite autenticar usuarios comparando el vector facial de una imagen enviada con todos los vectores almacenados en la base de datos de Supabase.

## URL
```
POST /login
```

## Autenticación
No requiere autenticación previa

## Request Body
```json
{
  "foto_rostro": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjeLawAAAABJRU5ErkJggg=="
}
```

### Parámetros

| Parámetro    | Tipo   | Requerido | Descripción |
|--------------|--------|-----------|-------------|
| `foto_rostro` | string | Sí        | Imagen del rostro en formato Base64 |

## Response

### Respuesta Exitosa (HTTP 200)
```json
{
  "status": "success",
  "message": "Bienvenido Juan Pérez López",
  "user_id": 1,
  "full_name": "Juan Pérez López",
  "curp": "FORT040617HJCLMLA9",
  "email": "juan@example.com",
  "confidence": 0.92
}
```

### Campos de la Respuesta

| Campo       | Tipo   | Descripción |
|-------------|--------|-------------|
| `status`    | string | Estado de la operación: "success" |
| `message`   | string | Mensaje de bienvenida con el nombre del usuario |
| `user_id`   | int    | ID del usuario en la base de datos |
| `full_name` | string | Nombre completo del usuario |
| `curp`      | string | CURP del usuario |
| `email`     | string | Email del usuario |
| `confidence`| float  | Nivel de confianza de la coincidencia (0.0 a 1.0) |

### Errores

#### 400 - Error en la Imagen (Bad Request)
```json
{
  "detail": "Error en la imagen: No se detectó ningún rostro en la imagen"
}
```

**Posibles causas:**
- Imagen en formato Base64 inválido
- No se detectó un rostro en la imagen
- Se detectaron múltiples rostros
- Dimensiones de imagen insuficientes

#### 401 - Sin Coincidencia (Unauthorized)
```json
{
  "detail": "No se encontró coincidencia. Rostro no reconocido en el sistema."
}
```

**Posibles causas:**
- El usuario no está registrado
- La similitud facial es menor a 0.6 (umbral de tolerancia)

#### 500 - Error del Servidor (Internal Server Error)
```json
{
  "detail": "Error inesperado: [descripción del error]"
}
```

## Algoritmo de Comparación

1. **Extracción de Vector**: Se extrae un vector facial (embedding) de 128 dimensiones de la imagen enviada
2. **Obtención de Base de Datos**: Se obtienen todos los vectores almacenados en la tabla `face_embeddings`
3. **Comparación**: Se calcula la distancia euclidiana entre el vector enviado y cada vector almacenado
4. **Búsqueda de Mejor Coincidencia**: Se selecciona la coincidencia con la distancia menor
5. **Validación**: Si la distancia es menor a 0.6, se considera una coincidencia válida
6. **Cálculo de Confianza**: `confidence = max(0.0, 1.0 - (distance / 0.6))`

## Tolerancia de Distancia

- **Distancia < 0.4**: Coincidencia muy alta (confianza > 0.33)
- **Distancia 0.4 - 0.5**: Coincidencia alta (confianza 0.17 - 0.33)
- **Distancia 0.5 - 0.6**: Coincidencia aceptable (confianza 0.0 - 0.17)
- **Distancia >= 0.6**: Sin coincidencia (rechazado)

## Ejemplo de Uso con JavaScript/Fetch

```javascript
async function loginWithFace(imageBase64) {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        foto_rostro: imageBase64
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error:', error.detail);
      return null;
    }

    const data = await response.json();
    console.log('Login exitoso:', data);
    return data;
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}
```

## Ejemplo de Uso con Python

```python
import requests
import base64

# Leer imagen y convertir a base64
with open('face_image.jpg', 'rb') as f:
    image_base64 = base64.b64encode(f.read()).decode('utf-8')

# Enviar request al servidor
response = requests.post(
    'http://localhost:8000/login',
    json={'foto_rostro': image_base64}
)

if response.status_code == 200:
    user_data = response.json()
    print(f"Bienvenido {user_data['full_name']}")
    print(f"Confianza: {user_data['confidence']:.2%}")
else:
    print(f"Error: {response.json()['detail']}")
```

## Notas Importantes

- El vector facial se extrae utilizando `face_recognition` (basado en dlib)
- Se utiliza el modelo 'hog' para la detección de rostros (más rápido pero menos preciso)
- La imagen debe contener exactamente un rostro
- El algoritmo es tolerante a cambios menores en iluminación y ángulo
- Para mejorar la precisión, se recomienda usar imágenes de buena calidad con el rostro claramente visible

## Estructuras de Base de Datos Utilizadas

### Tabla: users_metadata
```sql
- id (int, primary key)
- full_name (string)
- curp (string, unique)
- email (string, unique)
```

### Tabla: face_embeddings
```sql
- id (int, primary key)
- user_id (int, foreign key → users_metadata.id)
- embedding (array[float], 128 dimensiones)
```
