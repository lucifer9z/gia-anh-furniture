-- ==========================================
-- MIGRATION 002: Multi-Store Support
-- ==========================================

-- 1. Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🏪',
  color TEXT DEFAULT '#7c6cf0',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all stores" ON stores FOR ALL USING (true) WITH CHECK (true);

-- 2. Insert default store
INSERT INTO stores (name, icon, color) VALUES ('Gia Anh Furniture', '🏡', '#7c6cf0');

-- 3. Add store_id to all data tables
ALTER TABLE daily_data ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id);
ALTER TABLE skus ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id);
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id);
ALTER TABLE war_stories ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id);

-- 4. Update existing data to belong to default store
UPDATE daily_data SET store_id = (SELECT id FROM stores LIMIT 1) WHERE store_id IS NULL;
UPDATE tasks SET store_id = (SELECT id FROM stores LIMIT 1) WHERE store_id IS NULL;
UPDATE skus SET store_id = (SELECT id FROM stores LIMIT 1) WHERE store_id IS NULL;
UPDATE content_items SET store_id = (SELECT id FROM stores LIMIT 1) WHERE store_id IS NULL;
UPDATE war_stories SET store_id = (SELECT id FROM stores LIMIT 1) WHERE store_id IS NULL;
