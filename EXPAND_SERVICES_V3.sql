-- SQL Script to FIX Services (V3)
-- Run this in your Supabase SQL Editor to fix the "undefined" errors

-- 1. Add missing columns if they don't exist
ALTER TABLE services ADD COLUMN IF NOT EXISTS key TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS category TEXT;

-- 2. Clear existing items to ensure clean state (Optional)
DELETE FROM services;

-- 3. INSERT all 17 services with their KEYS and CATEGORIES
INSERT INTO services (id, name, key, description, price, is_active, image_url, category)
VALUES 
    -- MEALS (8 items)
    ('1', 'Continental Breakfast', 'continental', 'Fresh pastries, fruits, coffee & juice', 8, true, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400', 'meal'),
    ('2', 'Full English Breakfast', 'american', 'Eggs, bacon, sausage, beans, toast', 12, true, 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400', 'meal'),
    ('3', 'Vegan Breakfast Bowl', 'vegan', 'Organic granola, fruits, plant milk', 10, true, 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400', 'meal'),
    ('4', 'Pancake Stack', 'pancakes', 'Fluffy pancakes with maple syrup', 9, true, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', 'meal'),
    ('11', 'Gourmet Burger Lunch', 'burger', 'Premium beef, cheddar, and rustic fries', 15, true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 'meal'),
    ('12', 'Classic Lasagna Lunch', 'lasagna', 'Layered pasta with rich bolognese sauce', 14, true, 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400', 'meal'),
    ('16', 'Mexican Burrito Lunch', 'burrito', 'Spiced beef, beans, rice, and salsa', 14, true, 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8a?w=400', 'meal'),
    ('17', 'Fresh Poke Bowl Lunch', 'poke', 'Salmon, avocado, and edamame', 16, true, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 'meal'),
    
    -- EXTRAS (9 items)
    ('5', 'Laundry Service', 'laundry', 'Professional wash & fold service', 12, true, 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400', 'service'),
    ('6', 'Bike Rental (Full Day)', 'bike', 'Explore the city on two wheels', 15, true, 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400', 'service'),
    ('7', 'Airport Shuttle', 'shuttle', 'Convenient airport transfer', 25, true, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400', 'service'),
    ('8', 'City Walking Tour', 'tour', 'Guided 3-hour city highlights tour', 30, true, 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400', 'service'),
    ('9', 'Pub Crawl Night', 'pub', 'Experience local nightlife', 20, true, 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400', 'service'),
    ('10', 'Yoga Class', 'yoga', 'Morning yoga session', 8, true, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', 'service'),
    ('13', 'Private Locker', 'locker', 'Secure personal storage with key', 5, true, 'https://images.unsplash.com/photo-1596443686812-2f45229eebc3?w=400', 'service'),
    ('14', 'Premium Towel', 'towel', 'Large, soft, and hygienic cotton towel', 3, true, 'https://images.unsplash.com/photo-1560362614-890275988ce7?w=400', 'service'),
    ('15', 'Late Checkout 16:00', 'late', 'Keep your room until 4 PM', 10, true, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400', 'service');
