-- ============================================
-- SCORPIUS HOSTEL - DATABASE SCHEMA
-- Complete setup for Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: services
-- Stores all hostel services (breakfast, activities, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category TEXT DEFAULT 'service', -- 'breakfast', 'service', 'activity'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: room_prices
-- Different room types and pricing
-- ============================================
CREATE TABLE IF NOT EXISTS room_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_type TEXT NOT NULL,
  description TEXT,
  price_per_night NUMERIC(10, 2) NOT NULL CHECK (price_per_night >= 0),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: bookings
-- Guest reservations
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  room_type_id UUID REFERENCES room_prices(id),
  number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0),
  selected_services JSONB DEFAULT '{}',
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: site_settings
-- Customizable site content (CMS-like)
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: managers
-- Authorized manager emails
-- ============================================
CREATE TABLE IF NOT EXISTS managers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRIGGERS: Auto-update timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_prices_updated_at BEFORE UPDATE ON room_prices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;

-- Services: Public read, manager write
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Managers can manage services"
  ON services FOR ALL
  USING (
    auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email IN (SELECT email FROM managers))
  );

-- Room Prices: Public read, manager write
CREATE POLICY "Public can view active rooms"
  ON room_prices FOR SELECT
  USING (is_active = true);

CREATE POLICY "Managers can manage rooms"
  ON room_prices FOR ALL
  USING (
    auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email IN (SELECT email FROM managers))
  );

-- Bookings: Public insert, manager full access
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Managers can view all bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email IN (SELECT email FROM managers))
  );

CREATE POLICY "Managers can update bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email IN (SELECT email FROM managers))
  );

CREATE POLICY "Managers can delete bookings"
  ON bookings FOR DELETE
  USING (
    auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email IN (SELECT email FROM managers))
  );

-- Site Settings: Public read, manager write
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Managers can manage site settings"
  ON site_settings FOR ALL
  USING (
    auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email IN (SELECT email FROM managers))
  );

-- Managers: Only managers can view
CREATE POLICY "Managers can view managers"
  ON managers FOR SELECT
  USING (
    auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email IN (SELECT email FROM managers))
  );

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default manager
INSERT INTO managers (email, name) VALUES
  ('manager@scorpius.com', 'Scorpius Admin')
ON CONFLICT (email) DO NOTHING;

-- Insert site settings
INSERT INTO site_settings (key, value) VALUES
  ('hostel_name', 'SCORPIUS HOSTEL'),
  ('hero_description', 'Where the stars align for unforgettable journeys. Experience cosmic comfort in the heart of the city.'),
  ('hero_image', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert room types
INSERT INTO room_prices (room_type, description, price_per_night, capacity, image_url) VALUES
  ('Constellation Dorm (4 beds)', 'Cozy 4-bed dorm with personal reading lights and lockers', 28.00, 4, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'),
  ('Galaxy Dorm (6 beds)', 'Spacious 6-bed dorm with individual charging stations', 24.00, 6, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),
  ('Nebula Dorm (8 beds)', 'Social 8-bed dorm perfect for groups and solo travelers', 20.00, 8, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'),
  ('Meteor Private (Single)', 'Private room with queen bed and workspace', 55.00, 1, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'),
  ('Comet Private (Double)', 'Private room with ensuite bathroom and city views', 75.00, 2, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'),
  ('Supernova Suite', 'Luxury suite with panoramic views and premium amenities', 95.00, 2, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800')
ON CONFLICT DO NOTHING;

-- Insert breakfast options
INSERT INTO services (name, description, price, category, image_url) VALUES
  ('Continental Breakfast', 'Fresh pastries, seasonal fruits, coffee & juice', 8.00, 'breakfast', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400'),
  ('Full English Breakfast', 'Eggs, bacon, sausage, beans, mushrooms, and toast', 12.00, 'breakfast', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400'),
  ('Vegan Breakfast Bowl', 'Organic granola, fresh fruits, plant-based milk, and chia seeds', 10.00, 'breakfast', 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400'),
  ('Pancake Stack', 'Fluffy pancakes with maple syrup, butter, and fresh berries', 9.00, 'breakfast', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400')
ON CONFLICT DO NOTHING;

-- Insert additional services
INSERT INTO services (name, description, price, category, image_url) VALUES
  ('Laundry Service', 'Professional wash, dry, and fold service', 12.00, 'service', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400'),
  ('Bike Rental (Full Day)', 'Explore the city on two wheels with our quality bikes', 15.00, 'service', 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400'),
  ('Airport Shuttle', 'Convenient and comfortable airport transfer service', 25.00, 'service', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400'),
  ('City Walking Tour', 'Guided 3-hour tour of city highlights and hidden gems', 30.00, 'service', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'),
  ('Pub Crawl Night', 'Experience the best of local nightlife with fellow travelers', 20.00, 'service', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400'),
  ('Yoga Class', 'Morning yoga session on our rooftop terrace', 8.00, 'service', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400')
ON CONFLICT DO NOTHING;

-- ============================================
-- IMPORTANT: MANUAL STEPS REQUIRED
-- ============================================
-- After running this SQL script, you MUST:
-- 1. Go to Authentication > Users in Supabase
-- 2. Click "Add user" > "Create new user"
-- 3. Email: manager@scorpius.com
-- 4. Password: Mg7!xL$9pQw2#vR (Contraseña Segura)
-- 5. Check "Auto Confirm User"
-- 6. Click "Create user"
-- ============================================
