-- ============================================
-- SCORPIUS HOSTEL - EXPAND SERVICES & MEALS
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Add 2 Lunch options (to complete 6 meal options)
INSERT INTO services (name, description, price, category, image_url) VALUES
  ('Gourmet Burger Lunch', 'Premium beef, cheddar, and rustic fries', 15.00, 'breakfast', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'),
  ('Classic Lasagna Lunch', 'Layered pasta with rich bolognese sauce', 14.00, 'breakfast', 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400')
ON CONFLICT DO NOTHING;

-- 2. Add 3 extra services (for a symmetrical 9-service grid)
INSERT INTO services (name, description, price, category, image_url) VALUES
  ('Private Locker', 'Secure personal storage with key', 5.00, 'service', 'https://images.unsplash.com/photo-1596443686812-2f45229eebc3?w=400'),
  ('Premium Towel', 'Large, soft, and hygienic cotton towel', 3.00, 'service', 'https://images.unsplash.com/photo-1560362614-890275988ce7?w=400'),
  ('Late Checkout 16:00', 'Keep your room until 4 PM', 10.00, 'service', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400')
ON CONFLICT DO NOTHING;
