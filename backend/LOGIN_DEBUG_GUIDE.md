# Guía de Debugging para el Login Biométrico

## 📋 Logs Agregados

He agregado logs de debugging en 3 puntos clave para validar el flujo completo del login:

### 1. **Verificación de Login** (`/login/verify`)
Ubicación: [app/api/routes/login.py](app/api/routes/login.py#L99)

```
[LOGIN DEBUG] --- Inicio verificación de login ---
[LOGIN DEBUG] Tipo de vector recibido: <class 'list'>
[LOGIN DEBUG] Longitud del vector: 128
[LOGIN DEBUG] Primeros 5 valores del vector: [0.123, -0.456, ...]
```

**Qué buscar:**
- ✅ Vector debe ser `<class 'list'>` 
- ✅ Longitud debe ser exactamente `128`
- ✅ Los valores deben ser números (floats), no strings

---

### 2. **Recuperación de Embeddings de Supabase** (`get_all_embeddings`)
Ubicación: [app/db/user_repository.py](app/db/user_repository.py#L46)

```
[DB DEBUG] Consultando embeddings de Supabase...
[DB DEBUG] Respuesta de Supabase recibida
[DB DEBUG] Total de registros: 2

[DB DEBUG] Registro 1:
[DB DEBUG]   - ID embedding: 1
[DB DEBUG]   - user_id: 1
[DB DEBUG]   - Tipo de embedding: <class 'list'>
[DB DEBUG]   - Longitud embedding: 128
[DB DEBUG]   - Usuario: Juan Pérez López
```

**Qué buscar:**
- ✅ `Total de registros` debe ser > 0 (significa que hay usuarios registrados)
- ✅ `Tipo de embedding` debe ser `<class 'list'>` 
- ✅ `Longitud embedding` debe ser exactamente `128`
- ⚠️ Si el tipo de embedding es algo diferente (dict, string, etc.), hay un problema de serialización

---

### 3. **Comparación de Vectores** (`compare_facial_encodings`)
Ubicación: [app/services/face_service.py](app/services/face_service.py#L100)

```
[COMPARE DEBUG] Comparando vectores:
[COMPARE DEBUG]   - enc1 tipo: <class 'numpy.ndarray'>, dtype: float64
[COMPARE DEBUG]   - enc2 tipo: <class 'numpy.ndarray'>, dtype: float64
[COMPARE DEBUG] Distancia calculada: 0.456789
```

**Qué buscar:**
- ✅ Ambos deben ser `<class 'numpy.ndarray'>`
- ✅ El dtype debe ser numérico (float64, float32, etc.), no strings
- ✅ La distancia debe ser un número decimal entre 0 y 1+

---

### 4. **Comparación de Todos los Usuarios**
En `/login/verify` se muestran logs para cada usuario:

```
[LOGIN DEBUG] Iniciando comparación de vectores...

[LOGIN DEBUG] Usuario 1: Juan Pérez López
[LOGIN DEBUG]   - Tipo de vector almacenado: <class 'list'>
[LOGIN DEBUG]   - Longitud: 128
[LOGIN DEBUG]   - Primeros 5 valores: [0.123, -0.456, ...]
[LOGIN DEBUG]   - Distancia: 0.4567
[LOGIN DEBUG]   ✓ Nueva mejor coincidencia encontrada

[LOGIN DEBUG] Usuario 2: María García López
[LOGIN DEBUG]   - Tipo de vector almacenado: <class 'list'>
[LOGIN DEBUG]   - Longitud: 128
[LOGIN DEBUG]   - Primeros 5 valores: [0.789, -0.012, ...]
[LOGIN DEBUG]   - Distancia: 0.8234
```

**Qué buscar:**
- ✅ Se debe ver el nombre de cada usuario
- ✅ La distancia debe ser diferente para cada usuario
- ✅ El usuario con la distancia más baja (mejor coincidencia) debe tener una ✓
- ✅ La mejor distancia debe ser < 0.6 para que el login sea exitoso

---

### 5. **Resultado Final**

```
[LOGIN DEBUG] Mejor distancia encontrada: 0.4567
[LOGIN DEBUG] Tolerancia máxima: 0.6
[LOGIN DEBUG] ✓ Coincidencia encontrada: Juan Pérez López
[LOGIN DEBUG] Confianza calculada: 23.88%
[LOGIN DEBUG] --- Fin de verificación de login ---
```

**Resultado esperado:**
- ✅ Si la mejor distancia < 0.6 → Login exitoso
- ❌ Si la mejor distancia >= 0.6 → "No se encontró coincidencia"

---

## 🔍 Posibles Problemas y Soluciones

### Problema 1: "Total de registros: 0"
**Causa:** No hay usuarios registrados en Supabase
**Solución:** Primero realiza un registro para que haya vectores almacenados

---

### Problema 2: "Tipo de embedding: <class 'dict'>" o "Tipo de embedding: <class 'str'>"
**Causa:** Supabase está devolviendo el embedding en formato incorrecto
**Solución:** El embedding en Supabase debe ser un array/lista JSON nativo, no serializado como string

---

### Problema 3: "Longitud embedding: 256" o número diferente a 128
**Causa:** El vector está duplicado o mal formado
**Solución:** Verifica cómo se guarda el vector en Supabase durante el enrollment

---

### Problema 4: "Distancia: 1.5" o valores muy altos
**Causa:** Posiblemente los vectores no son compatibles
**Solución:** Verifica que ambos vectores sean realmente de face_recognition

---

### Problema 5: Login siempre falla aunque debería pasar
**Causa:** La mejor distancia es > 0.6
**Soluciones posibles:**
- Aumentar la tolerancia temporalmente (cambiar 0.6 a 0.7)
- Tomar fotos de mejor calidad para el registro
- Tomar fotos en condiciones similares para login

---

## 🛠️ Cómo Hacerlo

1. **Inicia el servidor backend:**
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```

2. **Abre la consola donde está corriendo uvicorn** para ver los logs

3. **Realiza un registro** (enrollment) en el frontend
   - Busca logs como `[INFO] Iniciando extracción de vector facial`

4. **Realiza un login** en el frontend
   - Todos los logs `[LOGIN DEBUG]`, `[DB DEBUG]`, `[COMPARE DEBUG]` aparecerán en orden

5. **Analiza los logs** siguiendo esta guía

---

## 📊 Datos de Ejemplo de Logs Exitosos

### Login Exitoso:
```
[LOGIN DEBUG] --- Inicio verificación de login ---
[LOGIN DEBUG] Tipo de vector recibido: <class 'list'>
[LOGIN DEBUG] Longitud del vector: 128
[LOGIN DEBUG] Primeros 5 valores del vector: [0.15, -0.23, 0.45, -0.12, 0.34]
[LOGIN DEBUG] Vector de login validado correctamente ✓
[LOGIN DEBUG] Obteniendo embeddings de Supabase...
[DB DEBUG] Consultando embeddings de Supabase...
[DB DEBUG] Total de registros: 1
[DB DEBUG] Registro 1:
[DB DEBUG]   - Tipo de embedding: <class 'list'>
[DB DEBUG]   - Longitud embedding: 128
[DB DEBUG]   - Usuario: Juan Pérez López
[LOGIN DEBUG] Total de usuarios registrados: 1
[LOGIN DEBUG] Iniciando comparación de vectores...
[LOGIN DEBUG] Usuario 1: Juan Pérez López
[LOGIN DEBUG]   - Distancia: 0.3456
[LOGIN DEBUG]   ✓ Nueva mejor coincidencia encontrada
[COMPARE DEBUG] Distancia calculada: 0.345600
[LOGIN DEBUG] Comparación completada.
[LOGIN DEBUG] Mejor distancia encontrada: 0.3456
[LOGIN DEBUG] ✓ Coincidencia encontrada: Juan Pérez López
[LOGIN DEBUG] Confianza calculada: 42.40%
```

---

## ✅ Checklist de Validación

- [ ] El vector de login tiene longitud 128
- [ ] Los embeddings de Supabase tienen longitud 128
- [ ] Los embeddings son del tipo `<class 'list'>`
- [ ] Se muestra al menos un usuario en los logs
- [ ] La distancia se calcula para cada usuario
- [ ] La mejor distancia es menor a 0.6
- [ ] El login es exitoso

Si todos los puntos se cumplen ✅, entonces el sistema está funcionando correctamente.
