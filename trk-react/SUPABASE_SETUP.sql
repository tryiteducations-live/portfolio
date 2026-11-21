-- Run this SQL in your Supabase project: SQL Editor > New Query

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issuer TEXT NOT NULL,
  name TEXT NOT NULL,
  cert_number TEXT,
  issued_date TEXT NOT NULL,
  expiry_date TEXT,
  skill_domain TEXT NOT NULL,
  sector TEXT NOT NULL,
  badge_url TEXT,
  pdf_url TEXT,
  verify_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  sector TEXT,
  item_type TEXT DEFAULT 'screenshot',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read access (portfolio visitors can see certs/gallery)
CREATE POLICY "Public read certifications"
  ON certifications FOR SELECT USING (true);

CREATE POLICY "Public read gallery"
  ON gallery FOR SELECT USING (true);

-- Allow anon insert (admin panel uses anon key)
-- For production, replace with authenticated user policy
CREATE POLICY "Anon insert certifications"
  ON certifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon insert gallery"
  ON gallery FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon delete certifications"
  ON certifications FOR DELETE USING (true);

CREATE POLICY "Anon delete gallery"
  ON gallery FOR DELETE USING (true);
