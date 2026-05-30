-- ==========================================
-- Gia Anh Furniture — Research Module Tables
-- Copy toàn bộ → Supabase SQL Editor → Run
-- ==========================================

-- Xóa cũ nếu chạy lại
DROP TABLE IF EXISTS competitor_reviews CASCADE;
DROP TABLE IF EXISTS competitor_products CASCADE;
DROP TABLE IF EXISTS competitor_ads CASCADE;
DROP TABLE IF EXISTS trend_videos CASCADE;
DROP TABLE IF EXISTS competitors CASCADE;

-- 1. Đối thủ (max 20)
CREATE TABLE competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id),
  name TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'shopee',
  url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Sản phẩm đối thủ (snapshot theo thời gian)
CREATE TABLE competitor_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id),
  name TEXT NOT NULL,
  price INT,
  original_price INT,
  sold_count INT DEFAULT 0,
  rating NUMERIC(2,1),
  review_count INT DEFAULT 0,
  offer TEXT,
  image_url TEXT,
  product_url TEXT,
  scraped_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Review đối thủ
CREATE TABLE competitor_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id),
  stars INT CHECK (stars >= 1 AND stars <= 5),
  content TEXT NOT NULL,
  category TEXT,
  product_name TEXT,
  scraped_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Ads đối thủ
CREATE TABLE competitor_ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id),
  platform TEXT NOT NULL DEFAULT 'facebook',
  ad_text TEXT,
  format TEXT DEFAULT 'video',
  offer TEXT,
  hook TEXT,
  url TEXT,
  first_seen DATE DEFAULT CURRENT_DATE,
  last_seen DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  scraped_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Trend videos
CREATE TABLE trend_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id),
  platform TEXT DEFAULT 'tiktok',
  title TEXT,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  hook TEXT,
  video_type TEXT DEFAULT 'other',
  audio TEXT,
  url TEXT,
  creator TEXT,
  scraped_at TIMESTAMPTZ DEFAULT now()
);

-- 6. RLS
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON competitors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON competitor_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON competitor_reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON competitor_ads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON trend_videos FOR ALL USING (true) WITH CHECK (true);
