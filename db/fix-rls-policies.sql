-- ============================================
-- SOLUCIÓN COMPLETA: Arreglar TODAS las Políticas RLS
-- ============================================
-- Este script arregla los errores 403 "permission denied"
-- y permite que el admin tenga acceso COMPLETO (como Sitefinity)
-- ============================================

-- ============================================
-- PASO 1: LIMPIAR TODAS LAS POLÍTICAS EXISTENTES
-- ============================================

-- Eliminar políticas de services
DROP POLICY IF EXISTS "Public can view active services" ON services;
DROP POLICY IF EXISTS "Managers can manage services" ON services;
DROP POLICY IF EXISTS "Authenticated users can manage services" ON services;

-- Eliminar políticas de room_prices
DROP POLICY IF EXISTS "Public can view active rooms" ON room_prices;
DROP POLICY IF EXISTS "Managers can manage rooms" ON room_prices;
DROP POLICY IF EXISTS "Authenticated users can manage rooms" ON room_prices;

-- Eliminar políticas de bookings
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Managers can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Managers can update bookings" ON bookings;
DROP POLICY IF EXISTS "Managers can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can manage bookings" ON bookings;

-- Eliminar políticas de site_settings
DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Managers can manage site settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON site_settings;

-- Eliminar políticas de managers
DROP POLICY IF EXISTS "Managers can view managers" ON managers;
DROP POLICY IF EXISTS "Public can view managers" ON managers;
DROP POLICY IF EXISTS "Authenticated users can view managers" ON managers;
DROP POLICY IF EXISTS "Authenticated users can read managers" ON managers;

-- ============================================
-- PASO 2: CREAR POLÍTICAS SIMPLES Y FUNCIONALES
-- ============================================

-- ============================================
-- TABLA: services
-- Público: Solo lectura de servicios activos
-- Admin: CRUD completo (crear, leer, actualizar, eliminar)
-- ============================================

-- Público puede ver servicios activos
CREATE POLICY "public_read_active_services"
  ON services FOR SELECT
  USING (is_active = true);

-- Admin puede hacer TODO con servicios
CREATE POLICY "admin_full_access_services"
  ON services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.email = auth.jwt()->>'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.email = auth.jwt()->>'email'
    )
  );

-- ============================================
-- TABLA: room_prices
-- Público: Solo lectura de habitaciones activas
-- Admin: CRUD completo
-- ============================================

-- Público puede ver habitaciones activas
CREATE POLICY "public_read_active_rooms"
  ON room_prices FOR SELECT
  USING (is_active = true);

-- Admin puede hacer TODO con habitaciones
CREATE POLICY "admin_full_access_rooms"
  ON room_prices FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.email = auth.jwt()->>'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.email = auth.jwt()->>'email'
    )
  );

-- ============================================
-- TABLA: bookings
-- Público: Puede CREAR reservas (sin login)
-- Admin: CRUD completo (ver, editar, eliminar todas las reservas)
-- ============================================

-- Público puede crear reservas SIN autenticación
CREATE POLICY "public_create_bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Admin puede ver TODAS las reservas
CREATE POLICY "admin_read_all_bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.email = auth.jwt()->>'email'
    )
  );

-- Admin puede actualizar TODAS las reservas
CREATE POLICY "admin_update_bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.email = auth.jwt()->>'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.email = auth.jwt()->>'email'
    )
  );

-- Admin puede eliminar TODAS las reservas
CREATE POLICY "admin_delete_bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.email = auth.jwt()->>'email'
    )
  );

-- ============================================
-- TABLA: site_settings
-- Público: Solo lectura (para mostrar nombre, logo, etc.)
-- Admin: CRUD completo (cambiar TODO el contenido del sitio)
-- ============================================

-- Público puede ver configuración del sitio
CREATE POLICY "public_read_settings"
  ON site_settings FOR SELECT
  USING (true);

-- Admin puede hacer TODO con la configuración
CREATE POLICY "admin_full_access_settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.email = auth.jwt()->>'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.email = auth.jwt()->>'email'
    )
  );

-- ============================================
-- TABLA: managers
-- Solo usuarios autenticados pueden leer
-- ============================================

CREATE POLICY "authenticated_read_managers"
  ON managers FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- PASO 3: VERIFICAR QUE TODO ESTÁ BIEN
-- ============================================

-- Ver todas las políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('services', 'room_prices', 'bookings', 'site_settings', 'managers')
ORDER BY tablename, policyname;

-- ============================================
-- RESULTADO ESPERADO:
-- Deberías ver políticas para cada tabla:
-- - services: 2 políticas (public_read, admin_full)
-- - room_prices: 2 políticas (public_read, admin_full)
-- - bookings: 4 políticas (public_create, admin_read, admin_update, admin_delete)
-- - site_settings: 2 políticas (public_read, admin_full)
-- - managers: 1 política (authenticated_read)
-- ============================================
