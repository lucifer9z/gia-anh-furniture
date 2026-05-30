-- ==========================================
-- Gia Anh Furniture — FULL DATABASE (chạy 1 lần)
-- Copy toàn bộ → Supabase SQL Editor → Run
-- ==========================================

-- 0. Xóa bảng cũ (nếu có)
DROP TABLE IF EXISTS daily_data CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS war_stories CASCADE;
DROP TABLE IF EXISTS skus CASCADE;
DROP TABLE IF EXISTS content_items CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS stores CASCADE;

-- 1. Bảng STORES (quản lý nhiều cửa hàng)
CREATE TABLE stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🏪',
  color TEXT DEFAULT '#7c6cf0',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Daily data (số liệu ngày)
CREATE TABLE daily_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  store_id UUID REFERENCES stores(id),
  fb_spend INT DEFAULT 0,
  fb_inbox INT DEFAULT 0,
  fb_orders INT DEFAULT 0,
  fb_revenue INT DEFAULT 0,
  sp_organic INT DEFAULT 0,
  sp_paid INT DEFAULT 0,
  sp_revenue INT DEFAULT 0,
  sp_spend INT DEFAULT 0,
  tt_views INT DEFAULT 0,
  tt_orders INT DEFAULT 0,
  tt_revenue INT DEFAULT 0,
  tt_followers INT DEFAULT 0,
  fl_shipped INT DEFAULT 0,
  fl_delivered INT DEFAULT 0,
  fl_boom INT DEFAULT 0,
  fl_return INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(date, store_id)
);

-- 3. Tasks
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  store_id UUID REFERENCES stores(id),
  text TEXT NOT NULL,
  role TEXT NOT NULL,
  time_slot TEXT NOT NULL DEFAULT 'morning',
  done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. War Stories
CREATE TABLE war_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id),
  title TEXT NOT NULL,
  module TEXT,
  author TEXT,
  content TEXT,
  before_data TEXT,
  after_data TEXT,
  lesson TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SKUs (quản lý sản phẩm)
CREATE TABLE skus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  category TEXT DEFAULT 'jean',
  cost_price INT DEFAULT 0,
  sell_price_fb INT DEFAULT 0,
  sell_price_shopee INT DEFAULT 0,
  sell_price_tiktok INT DEFAULT 0,
  stock INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Content Calendar
CREATE TABLE content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  store_id UUID REFERENCES stores(id),
  title TEXT NOT NULL,
  type TEXT DEFAULT 'video',
  platform TEXT DEFAULT 'tiktok',
  status TEXT DEFAULT 'idea',
  assigned_to TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Settings
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT
);

-- 8. Enable Row Level Security
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE war_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 9. Public policies (team use)
CREATE POLICY "Allow all" ON stores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON daily_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON war_stories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON skus FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON content_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON settings FOR ALL USING (true) WITH CHECK (true);

-- 10. Default data
INSERT INTO stores (name, icon, color) VALUES ('Gia Anh Furniture', '🏡', '#7c6cf0');
INSERT INTO settings (key, value) VALUES ('start_date', NULL);
INSERT INTO settings (key, value) VALUES ('project_name', 'Gia Anh Furniture');
