'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useStore } from '@/lib/store-context';
import { CONTENT_STATUSES, ROLES } from '@/lib/bible-data';

interface ContentItem { id: string; date: string; title: string; type: string; platform: string; status: string; assigned_to: string; notes: string; }

export default function ContentCalendarPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showAdd, setShowAdd] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', type: 'video', platform: 'tiktok', assigned_to: 'media', notes: '' });
  const [platformFilter, setPlatformFilter] = useState('all');
  const supabase = createClient();
  const { activeStoreId, storeFilter } = useStore();

  const getWeekDates = () => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
  };

  const weekDates = getWeekDates();

  useEffect(() => { loadItems(); }, [weekOffset, activeStoreId]);

  async function loadItems() {
    const q = storeFilter(supabase.from('content_items').select('*').gte('date', weekDates[0]).lte('date', weekDates[6])).order('created_at');
    const { data } = await q;
    if (data) setItems(data);
  }

  async function addItem(date: string) {
    if (!form.title.trim()) return;
    await supabase.from('content_items').insert({ date, ...form, status: 'idea', ...(activeStoreId ? { store_id: activeStoreId } : {}) });
    setForm({ title: '', type: 'video', platform: 'tiktok', assigned_to: 'media', notes: '' });
    setShowAdd(null);
    loadItems();
  }

  async function nextStatus(item: ContentItem) {
    const idx = CONTENT_STATUSES.findIndex(s => s.key === item.status);
    if (idx < CONTENT_STATUSES.length - 1) {
      const next = CONTENT_STATUSES[idx + 1].key;
      await supabase.from('content_items').update({ status: next }).eq('id', item.id);
      loadItems();
    }
  }

  async function deleteItem(id: string) {
    await supabase.from('content_items').delete().eq('id', id);
    loadItems();
  }

  const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const today = new Date().toISOString().slice(0, 10);

  const platformColors: Record<string, string> = { tiktok: '#f472b6', facebook: '#60a5fa', shopee: '#fb923c' };
  const typeIcons: Record<string, string> = { video: '🎬', image: '📸', livestream: '🔴' };

  return (
    <div className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">📅 Lịch Content</h1>
          <p className="text-secondary">Lên lịch, theo dõi trạng thái nội dung</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" style={{ background: 'var(--glass-hover)', color: 'white' }} onClick={() => setWeekOffset(w => w - 1)}>◀ Tuần trước</button>
          <button className="btn" style={{ background: 'var(--glass-hover)', color: 'white' }} onClick={() => setWeekOffset(0)}>Hôm nay</button>
          <button className="btn" style={{ background: 'var(--glass-hover)', color: 'white' }} onClick={() => setWeekOffset(w => w + 1)}>Tuần sau ▶</button>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['all', 'tiktok', 'facebook', 'shopee'].map(p => (
          <span key={p} className={`pill pill-filter ${platformFilter === p ? 'active' : ''}`} onClick={() => setPlatformFilter(p)}>
            {p === 'all' ? 'Tất cả' : p.charAt(0).toUpperCase() + p.slice(1)}
          </span>
        ))}
      </div>

      {/* Status legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, fontSize: 11 }}>
        {CONTENT_STATUSES.map(s => (
          <span key={s.key} style={{ color: s.color }}>{s.label}</span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {weekDates.map((date, i) => {
          const dayItems = items.filter(it => it.date === date && (platformFilter === 'all' || it.platform === platformFilter));
          const isToday = date === today;
          return (
            <div key={date} className="card" style={{ padding: 12, minHeight: 200, borderColor: isToday ? 'var(--accent)' : undefined, boxShadow: isToday ? 'var(--shadow-glow)' : undefined }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: isToday ? 'var(--accent)' : 'var(--text-muted)' }}>{dayNames[i]}</span>
                <span className="font-mono" style={{ fontSize: 11, color: isToday ? 'var(--accent)' : 'var(--text-muted)' }}>{date.slice(5)}</span>
              </div>

              {dayItems.map(item => {
                const statusObj = CONTENT_STATUSES.find(s => s.key === item.status);
                return (
                  <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${platformColors[item.platform] || '#666'}30`, borderRadius: 8, padding: 8, marginBottom: 6, cursor: 'pointer', fontSize: 12 }} onClick={() => nextStatus(item)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ color: statusObj?.color, fontWeight: 600, fontSize: 10 }}>{statusObj?.label}</span>
                      <span onClick={e => { e.stopPropagation(); deleteItem(item.id); }} style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: 10 }}>✕</span>
                    </div>
                    <div style={{ fontWeight: 500 }}>{typeIcons[item.type] || '📄'} {item.title}</div>
                    <div style={{ color: platformColors[item.platform], fontSize: 10, marginTop: 2 }}>{item.platform}</div>
                  </div>
                );
              })}

              {showAdd === date ? (
                <div style={{ marginTop: 6 }}>
                  <input className="form-control" style={{ fontSize: 11, padding: 6, marginBottom: 4 }} placeholder="Tiêu đề..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} autoFocus />
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    <select className="form-control" style={{ fontSize: 10, padding: 4 }} value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                      <option value="tiktok">TikTok</option><option value="facebook">Facebook</option><option value="shopee">Shopee</option>
                    </select>
                    <select className="form-control" style={{ fontSize: 10, padding: 4 }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option value="video">Video</option><option value="image">Ảnh</option><option value="livestream">Live</option>
                    </select>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', fontSize: 11 }} onClick={() => addItem(date)}>+ Thêm</button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', marginTop: 6 }}>
                  <span style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }} onClick={() => setShowAdd(date)}>+</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
