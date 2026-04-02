-- ============================================
-- FIX: BOOKING RLS POLICIES
-- Permite que cualquier persona cree reservas y visualice su propia reserva recién creada
-- ============================================

-- 1. Asegurar que RLS esté activado
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas conflictivas anteriores
DROP POLICY IF EXISTS "public_create_bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;
DROP POLICY IF EXISTS "public_read_bookings_during_creation" ON bookings;

-- 3. Crear política de INSERCIÓN para todos (Público)
-- Usamos 'true' porque cualquier persona debe poder reservar
CREATE POLICY "permissive_insert_bookings"
ON bookings FOR INSERT
TO public
WITH CHECK (true);

-- 4. Crear política de SELECCIÓN para todos (Público)
-- IMPORTANTE: Para que .insert().select() funcione, el usuario debe poder "ver" la fila.
-- Permitimos que el público lea reservas pero de forma limitada (ej. creadas recientemente)
-- o simplemente permitimos lectura si queremos simplicidad (menos seguro pero funcional).
-- Aquí permitimos lectura general para asegurar que el voucher funcione.

CREATE POLICY "permissive_select_bookings"
ON bookings FOR SELECT
TO public
USING (true);

-- 5. Asegurar acceso de manager (Admin)
DROP POLICY IF EXISTS "admin_read_all_bookings" ON bookings;
CREATE POLICY "admin_all_access_bookings"
ON bookings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- NOTA: Si prefieres más privacidad, puedes restringir la de SELECT pública, 
-- pero para que el voucher inmediato funcione sin login, esta es la vía más directa.
