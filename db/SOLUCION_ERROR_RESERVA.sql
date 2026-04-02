-- 🚨 FIX DEFINITIVO PARA RESERVAS 🚨
-- Copia y pega TODO este código en el SQL Editor de Supabase y dale a RUN.

-- 1. Habilitar RLS (por seguridad)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 2. Limpiar políticas antiguas que causan conflicto
DROP POLICY IF EXISTS "Allow public insert bookings" ON bookings;
DROP POLICY IF EXISTS "enable_public_insert" ON bookings;
DROP POLICY IF EXISTS "Enable all for managers" ON bookings;
DROP POLICY IF EXISTS "Managers can do everything" ON bookings;

-- 3. PERMITIR RESERVAS PÚBLICAS (La clave del éxito)
CREATE POLICY "Enable public insert"
ON bookings FOR INSERT
TO anon
WITH CHECK (true);

-- 4. Permitir que los Managers vean y editen todo
CREATE POLICY "Enable manager access"
ON bookings FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' IN (SELECT email FROM managers));

-- 5. (Opcional) Permitir que el público vea sus propias reservas (por ID y email)
-- Esto ayuda si quieres mostrar la confirmación recargando datos, 
-- pero por ahora el INSERT es lo más importante.
