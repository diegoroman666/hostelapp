# 🚨 SOLUCIÓN AL ERROR 500: Internal Server Error en tabla managers

## ❌ El Problema
Error 500 al intentar acceder a la tabla `managers`. Esto indica un problema con las políticas de seguridad (RLS) de Supabase.

---

## ✅ SOLUCIÓN DEFINITIVA (3 minutos)

### PASO 1: Ve a Supabase SQL Editor

1. Abre **Supabase** (https://supabase.com)
2. Selecciona tu proyecto **scorpius-hostel**
3. En el panel izquierdo, haz clic en **"SQL Editor"**
4. Haz clic en **"New query"**

### PASO 2: Ejecuta el Script Completo

**Copia TODO este código** (desde `DROP POLICY` hasta el final):

```sql
-- Eliminar políticas problemáticas
DROP POLICY IF EXISTS "Managers can view managers" ON managers;
DROP POLICY IF EXISTS "Public can view managers" ON managers;
DROP POLICY IF EXISTS "Authenticated users can view managers" ON managers;

-- Asegurar que la tabla existe
CREATE TABLE IF NOT EXISTS managers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;

-- Crear política simple que funcione
CREATE POLICY "Authenticated users can read managers"
  ON managers FOR SELECT
  TO authenticated
  USING (true);

-- Insertar el manager
INSERT INTO managers (email, name) 
VALUES ('manager@scorpius.com', 'Admin Scorpius')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;

-- Verificar
SELECT * FROM managers;
```

### PASO 3: Ejecutar

1. **Pega** el código en el SQL Editor
2. Haz clic en **"Run"** (o presiona Ctrl+Enter)
3. Deberías ver en los resultados:
   - Una fila con `manager@scorpius.com`

---

## ✅ VERIFICAR QUE FUNCIONÓ

### Opción A: Verificar en Supabase
1. Ve a **Table Editor** > **`managers`**
2. Deberías ver la fila con `manager@scorpius.com`

### Opción B: Verificar las Políticas
1. Ve a **Authentication** > **Policies**
2. Busca la tabla `managers`
3. Deberías ver la política: **"Authenticated users can read managers"**

### Opción C: Probar el Login
1. Ve a tu aplicación: http://localhost:5173/login
2. Ingresa:
   - Email: `manager@scorpius.com`
   - Password: `Scorpius2024!`
3. Haz clic en **"Login"**
4. **¡Deberías entrar al Dashboard sin errores!** 🎉

---

## 🔍 ¿Por qué pasó esto?

El error 500 ocurre cuando:
1. Las políticas RLS están mal configuradas
2. Las políticas se contradicen entre sí
3. La política usa una subconsulta que falla

**La solución:** Simplificar las políticas RLS para que cualquier usuario autenticado pueda leer la tabla `managers`.

---

## 📝 ARCHIVOS DE AYUDA

- `fix-manager.sql` - Script SQL completo listo para copiar y pegar

---

## 🚨 SI AÚN NO FUNCIONA

Si después de ejecutar el script sigues viendo errores:

### 1. Verifica que el usuario esté autenticado
- Ve a Supabase > Authentication > Users
- Verifica que `manager@scorpius.com` esté **Confirmed** (verde)

### 2. Verifica las credenciales en .env
- Abre `.env`
- Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` sean correctos

### 3. Reinicia el servidor
```bash
Ctrl+C
npm run dev
```

### 4. Limpia la caché del navegador
- Presiona `Ctrl+Shift+R` en el navegador

---

**¡Ejecuta el script ahora y en 2 minutos estarás dentro!** 🚀
