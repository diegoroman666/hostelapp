# 🌟 SCORPIUS HOSTEL - Guía Completa de Configuración Supabase

## 📋 Resumen
Esta guía te llevará paso a paso para configurar la base de datos de Supabase para tu hostel Scorpius.

---

## PASO 1: Crear Cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"**
3. Regístrate con:
   - GitHub (recomendado)
   - O email/contraseña

---

## PASO 2: Crear Nuevo Proyecto

1. Una vez dentro, haz clic en **"New Project"**
2. Completa la información:
   - **Name**: `scorpius-hostel`
   - **Database Password**: Crea una contraseña FUERTE y **guárdala en un lugar seguro**
   - **Region**: Selecciona la región más cercana a tus usuarios
   - **Pricing Plan**: Free (suficiente para empezar)
3. Haz clic en **"Create new project"**
4. **ESPERA 2-3 MINUTOS** mientras Supabase crea tu proyecto

---

## PASO 3: Ejecutar el Script de Base de Datos

### 3.1 Abrir el Editor SQL
1. En el panel izquierdo de Supabase, haz clic en **"SQL Editor"**
2. Haz clic en **"New query"**

### 3.2 Copiar y Ejecutar el Script
1. Abre el archivo `database-setup.sql` de tu proyecto
2. **Copia TODO el contenido** (Ctrl+A, Ctrl+C)
3. **Pega** en el editor SQL de Supabase (Ctrl+V)
4. Haz clic en **"Run"** (o presiona Ctrl+Enter)
5. Deberías ver: **"Success. No rows returned"**

### 3.3 Verificar que se crearon las tablas
1. En el panel izquierdo, haz clic en **"Table Editor"**
2. Deberías ver estas tablas:
   - ✅ `services` (10 servicios)
   - ✅ `room_prices` (6 tipos de habitaciones)
   - ✅ `bookings` (vacía por ahora)
   - ✅ `site_settings` (3 configuraciones)
   - ✅ `managers` (1 manager)

---

## PASO 4: Crear Usuario Manager

### 4.1 Ir a Authentication
1. En el panel izquierdo, haz clic en **"Authentication"**
2. Haz clic en **"Users"**

### 4.2 Crear el Usuario
1. Haz clic en **"Add user"** (botón verde)
2. Selecciona **"Create new user"**
3. Completa:
   - **Email**: `manager@scorpius.com`
   - **Password**: `Scorpius2024!`
   - ✅ **IMPORTANTE**: Marca la casilla **"Auto Confirm User"**
4. Haz clic en **"Create user"**

### 4.3 Verificar
- Deberías ver el usuario `manager@scorpius.com` en la lista
- Estado: **Confirmed** (verde)

---

## PASO 5: Obtener Credenciales de API

### 5.1 Ir a Settings
1. En el panel izquierdo, haz clic en **"Settings"** (ícono de engranaje)
2. Haz clic en **"API"**

### 5.2 Copiar las Credenciales
Necesitas copiar DOS valores:

#### A) Project URL
- Busca la sección **"Project URL"**
- Copia el valor (se ve como: `https://xxxxxxxxxxxxx.supabase.co`)

#### B) anon public Key
- Busca la sección **"Project API keys"**
- Copia el valor de **"anon public"** (es un string MUY largo)

---

## PASO 6: Configurar Variables de Entorno

### 6.1 Abrir el archivo .env
1. En tu proyecto, abre el archivo `.env`
2. Verás algo como esto:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 6.2 Reemplazar con tus Credenciales
1. Reemplaza `https://your-project.supabase.co` con tu **Project URL** real
2. Reemplaza `your-anon-key-here` con tu **anon public key** real

Ejemplo final:
```
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 6.3 Guardar el Archivo
- Guarda el archivo `.env` (Ctrl+S)

---

## PASO 7: Reiniciar el Servidor de Desarrollo

### 7.1 Detener el Servidor
1. Ve a la terminal donde está corriendo `npm run dev`
2. Presiona **Ctrl+C** para detenerlo

### 7.2 Iniciar Nuevamente
1. Ejecuta:
   ```bash
   npm run dev
   ```
2. Espera a que inicie (verás: `Local: http://localhost:5173/`)

---

## PASO 8: Probar la Aplicación

### 8.1 Abrir en el Navegador
1. Abre: http://localhost:5173
2. **El aviso "Demo Mode" debería DESAPARECER**

### 8.2 Probar una Reserva
1. Llena el formulario de reserva
2. Selecciona fechas, habitación, servicios
3. Haz clic en **"Confirm Reservation"**
4. Deberías ver: **"Booking submitted successfully!"**

### 8.3 Verificar en Supabase
1. Ve a Supabase > **Table Editor** > **bookings**
2. Deberías ver tu reserva guardada

### 8.4 Probar el Login de Manager
1. En la app, haz clic en **"Manager Login"**
2. Ingresa:
   - Email: `manager@scorpius.com`
   - Password: `Scorpius2024!`
3. Deberías entrar al **Dashboard**

### 8.5 Probar el Dashboard
1. Haz clic en las pestañas:
   - **Overview**: Ver estadísticas
   - **Services**: Editar servicios
   - **Rooms**: Editar habitaciones
   - **Bookings**: Ver reservas
   - **Settings**: Cambiar nombre del hostel

---

## ✅ VERIFICACIÓN FINAL

Marca cada item cuando lo completes:

- [ ] ✅ Proyecto Supabase creado
- [ ] ✅ Script SQL ejecutado correctamente
- [ ] ✅ 5 tablas creadas (services, room_prices, bookings, site_settings, managers)
- [ ] ✅ Usuario manager creado (manager@scorpius.com)
- [ ] ✅ Credenciales copiadas (URL + anon key)
- [ ] ✅ Archivo .env actualizado
- [ ] ✅ Servidor reiniciado
- [ ] ✅ Demo Mode desapareció
- [ ] ✅ Reserva de prueba funciona
- [ ] ✅ Login de manager funciona
- [ ] ✅ Dashboard accesible

---

## 🎨 PERSONALIZACIÓN

Una vez que todo funcione, personaliza tu hostel:

### 1. Cambiar Nombre y Descripción
1. Login como manager
2. Ve a **Settings**
3. Cambia:
   - Hostel Name
   - Hero Description
   - Hero Image URL

### 2. Editar Servicios
1. Ve a **Services**
2. Haz clic en **Edit** en cualquier servicio
3. Cambia precios, descripciones, imágenes

### 3. Editar Habitaciones
1. Ve a **Rooms**
2. Edita precios, capacidades, descripciones

### 4. Agregar Nuevos Servicios
1. Ve a **Services**
2. Haz clic en **"+ Add New Service"**
3. Completa el formulario

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### Problema: "Failed to fetch"
**Solución**:
- Verifica que las credenciales en `.env` sean correctas
- Reinicia el servidor (`Ctrl+C` y luego `npm run dev`)
- Verifica que el proyecto Supabase esté activo

### Problema: No puedo hacer login
**Solución**:
- Verifica que el usuario exista en Supabase > Authentication > Users
- Verifica que el email esté en la tabla `managers`
- Verifica que el usuario esté **Confirmed** (no Unconfirmed)

### Problema: Las reservas no se guardan
**Solución**:
- Verifica que el script SQL se haya ejecutado correctamente
- Verifica que la tabla `bookings` exista
- Revisa la consola del navegador (F12) para ver errores

### Problema: No veo los servicios/habitaciones
**Solución**:
- Verifica que el script SQL se haya ejecutado
- Ve a Supabase > Table Editor > `services` y `room_prices`
- Verifica que `is_active = true`

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa la consola del navegador (F12 > Console)
2. Revisa los logs de Supabase (Supabase > Logs)
3. Verifica que todas las tablas existan
4. Verifica que las RLS policies estén activas

---

**¡Listo! Tu Scorpius Hostel está configurado y funcionando** 🌟♏
