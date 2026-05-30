-- ==========================================
-- Gia Anh Furniture — Research v2.1: Cơ Hội + Content Ideas
-- Copy toàn bộ → Supabase SQL Editor → Run
-- ==========================================

-- 1. Bảng Cơ Hội (từ observation → action có tracking)
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'other', -- 'pricing' | 'content' | 'sourcing' | 'offer' | 'other'
  description TEXT,
  action TEXT, -- việc cần làm cụ thể
  status TEXT DEFAULT 'idea', -- 'idea' | 'doing' | 'done' | 'skip'
  result TEXT, -- kết quả sau khi thực hiện
  priority TEXT DEFAULT 'medium', -- 'high' | 'medium' | 'low'
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Bảng Ý Tưởng Content (lưu content hay của đối thủ)
CREATE TABLE IF NOT EXISTS content_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  source TEXT DEFAULT 'tiktok', -- 'tiktok' | 'shopee' | 'facebook' | 'instagram' | 'other'
  url TEXT,
  hook TEXT, -- câu hook/mở đầu
  format TEXT, -- 'unbox' | 'review' | 'ootd' | 'behindscene' | 'tutorial' | 'ad' | 'other'
  what_works TEXT, -- tại sao content này hay
  audio TEXT, -- nhạc nền / audio trend
  views INT DEFAULT 0,
  status TEXT DEFAULT 'saved', -- 'saved' | 'planning' | 'filmed' | 'posted'
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON opportunities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON content_ideas FOR ALL USING (true) WITH CHECK (true);
