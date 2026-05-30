-- ==========================================
-- Gia Anh Furniture — Research v2: Radar Thị Trường
-- Copy toàn bộ → Supabase SQL Editor → Run
-- ==========================================

-- 1. Ghi chú thị trường (team ghi hàng ngày)
CREATE TABLE IF NOT EXISTS market_radar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  category TEXT NOT NULL DEFAULT 'other',
  note TEXT NOT NULL,
  url TEXT,
  image_url TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Bảng so giá (mình vs đối thủ)
CREATE TABLE IF NOT EXISTS price_compare (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  my_product TEXT NOT NULL,
  my_sku TEXT,
  my_price INT NOT NULL DEFAULT 0,
  competitor_min INT DEFAULT 0,
  competitor_max INT DEFAULT 0,
  competitor_names TEXT,
  status TEXT DEFAULT 'ok',
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS
ALTER TABLE market_radar ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_compare ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON market_radar FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON price_compare FOR ALL USING (true) WITH CHECK (true);
