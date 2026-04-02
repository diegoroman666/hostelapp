-- ============================================
-- SOLUCIÓN COMPLETA: Error 500 en tabla managers
-- ============================================
-- Este script arregla el problema de RLS y recrea la tabla si es necesario
-- ============================================

-- PASO 1: Eliminar políticas existentes que puedan estar causando problemas
DROP POLICY IF EXISTS "Managers can view managers" ON managers;
DROP POLICY IF EXISTS "Public can view managers" ON managers;
DROP POLICY IF EXISTS "Authenticated users can view managers" ON managers;

-- PASO 2: Verificar que la tabla existe (si no, crearla)
CREATE TABLE IF NOT EXISTS managers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 3: Habilitar RLS
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;

-- PASO 4: Crear política SIMPLE que permita a usuarios autenticados leer la tabla
CREATE POLICY "Authenticated users can read managers"
  ON managers FOR SELECT
  TO authenticated
  USING (true);

-- PASO 5: Insertar el manager
INSERT INTO managers (email, name) 
VALUES ('manager@scorpius.com', 'Admin Scorpius')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;

-- PASO 6: Verificar que todo está bien
SELECT * FROM managers;

-- ============================================
-- RESULTADO ESPERADO:
-- Deberías ver una fila con:
-- - email: manager@scorpius.com
-- - name: Admin Scorpius
-- ============================================
