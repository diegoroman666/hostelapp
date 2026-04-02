-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to CREATE bookings
CREATE POLICY "Allow public insert bookings" 
ON bookings FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow anonymous users to READ their own bookings (technically difficult without auth, 
-- but we can verify by ID if needed, or just allow public read for now if low risk, 
-- OR strictly relying on the client state for the confirmation modal).
-- For now, INSERT is the blocker.

-- Allow Managers full access
CREATE POLICY "Enable all for managers" 
ON bookings FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' IN (SELECT email FROM managers));
