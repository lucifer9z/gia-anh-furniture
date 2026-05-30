'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';

const supabase = createClient();

// ============ TYPES ============
type RadarEntry = {
  id: string; category: string; note: string; url?: string;
  image_url?: string; created_by?: string; created_at: string;
};
type PriceEntry = {
  id: string; my_product: string; my_sku?: string; my_price: number;
  competitor_min: number; competitor_max: number; competitor_names?: string;
  status: string; notes?: string; updated_at: string;
};

const CATEGORIES = [
  { value: 'price', label: '💰 Giá đối thủ', color: '#fb923c' },
  { value: 'content', label: '🎬 Content hay', color: '#f472b6' },
  { value: 'offer', label: '🎁 Offer mới', color: '#34d399' },
  { value: 'trend', label: '🔥 Trend SP', color: '#60a5fa' },
  { value: 'review', label: '⭐ Review khách', color: '#fbbf24' },
  { value: 'other', label: '📝 Khác', color: '#9ca3b8' },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  ok: { label: '🟢 OK', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  expensive: { label: '🔴 ĐẮT', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  cheap: { label: '🔵 RẺ', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
};

export default function ResearchPage() {
  const [tab, setTab] = useState<'radar' | 'price' | 'actions'>('radar');
  const [storeId, setStoreId] = useState<string | null>(null);

  // Radar state
  const [radarEntries, setRadarEntries] = useState<RadarEntry[]>([]);
  const [radarForm, setRadarForm] = useState({ category: 'price', note: '', url: '', created_by: '' });
  const [showRadarForm, setShowRadarForm] = useState(false);
  const [radarFilter, setRadarFilter] = useState('all');

  // Price state
  const [priceEntries, setPriceEntries] = useState<PriceEntry[]>([]);
  const [priceForm, setPriceForm] = useState({ my_product: '', my_price: '', competitor_min: '', competitor_max: '', competitor_names: '', notes: '' });
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [editPriceId, setEditPriceId] = useState<string | null>(null);

  // Actions state
  const [actionPrompt, setActionPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  // ============ LOAD DATA ============
  const loadData = useCallback(async () => {
    const { data: stores } = await supabase.from('stores').select('id').limit(1);
    const sid = stores?.[0]?.id || null;
    setStoreId(sid);
    if (!sid) return;

    const [radarRes, priceRes] = await Promise.all([
      supabase.from('market_radar').select('*').eq('store_id', sid).order('created_at', { ascending: false }).limit(50),
      supabase.from('price_compare').select('*').eq('store_id', sid).order('my_product'),
    ]);
    setRadarEntries(radarRes.data || []);
    setPriceEntries(priceRes.data || []);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ============ RADAR ACTIONS ============
  async function addRadar() {
    if (!radarForm.note.trim() || !storeId) return;
    await supabase.from('market_radar').insert({
      store_id: storeId,
      category: radarForm.category,
      note: radarForm.note.trim(),
      url: radarForm.url.trim() || null,
      created_by: radarForm.created_by.trim() || null,
    });
    setRadarForm({ category: 'price', note: '', url: '', created_by: '' });
    setShowRadarForm(false);
    loadData();
  }

  async function deleteRadar(id: string) {
    if (!confirm('Xóa ghi chú này?')) return;
    await supabase.from('market_radar').delete().eq('id', id);
    loadData();
  }

  // ============ PRICE ACTIONS ============
  async function addOrUpdatePrice() {
    if (!priceForm.my_product.trim() || !storeId) return;
    const myPrice = parseInt(priceForm.my_price) || 0;
    const compMin = parseInt(priceForm.competitor_min) || 0;
    const compMax = parseInt(priceForm.competitor_max) || 0;

    // Auto status
    let status = 'ok';
    if (compMax > 0 && myPrice > compMax * 1.1) status = 'expensive';
    if (compMin > 0 && myPrice < compMin * 0.9) status = 'cheap';

    const row = {
      store_id: storeId,
      my_product: priceForm.my_product.trim(),
      my_price: myPrice,
      competitor_min: compMin,
      competitor_max: compMax,
      competitor_names: priceForm.competitor_names.trim() || null,
      notes: priceForm.notes.trim() || null,
      status,
      updated_at: new Date().toISOString(),
    };

    if (editPriceId) {
      await supabase.from('price_compare').update(row).eq('id', editPriceId);
    } else {
      await supabase.from('price_compare').insert(row);
    }
    setPriceForm({ my_product: '', my_price: '', competitor_min: '', competitor_max: '', competitor_names: '', notes: '' });
    setShowPriceForm(false);
    setEditPriceId(null);
    loadData();
  }

  function editPrice(p: PriceEntry) {
    setPriceForm({
      my_product: p.my_product,
      my_price: String(p.my_price),
      competitor_min: String(p.competitor_min),
      competitor_max: String(p.competitor_max),
      competitor_names: p.competitor_names || '',
      notes: p.notes || '',
    });
    setEditPriceId(p.id);
    setShowPriceForm(true);
  }

  async function deletePrice(id: string) {
    if (!confirm('Xóa sản phẩm này?')) return;
    await supabase.from('price_compare').delete().eq('id', id);
    loadData();
  }

  // ============ AI ACTIONS ============
  function generateActionPrompt() {
    const thisWeek = radarEntries.filter(r => {
      const diff = (Date.now() - new Date(r.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });

    const priceIssues = priceEntries.filter(p => p.status === 'expensive');

    let prompt = `Bạn là chuyên gia tư vấn bán hàng thời trang online tại Việt Nam (Shopee, TikTok Shop).

Dựa trên data quan sát thị trường tuần này của team Gia Anh Furniture, hãy tạo danh sách ACTION ITEMS theo 3 mức:
🔴 KHẨN CẤP (ảnh hưởng doanh thu ngay)
🟡 NÊN LÀM (cải thiện trong tuần)  
🟢 THEO DÕI (cơ hội tương lai)

Mỗi item cần: Việc cụ thể + Lý do + Deadline gợi ý.

=== GHI CHÚ THỊ TRƯỜNG TUẦN NÀY (${thisWeek.length} entries) ===
`;

    thisWeek.forEach((r, i) => {
      const cat = CATEGORIES.find(c => c.value === r.category)?.label || r.category;
      prompt += `${i + 1}. [${cat}] ${r.note}${r.url ? ` (${r.url})` : ''}\n`;
    });

    if (priceIssues.length > 0) {
      prompt += `\n=== SẢN PHẨM ĐANG ĐẮT HƠN THỊ TRƯỜNG ===\n`;
      priceIssues.forEach(p => {
        prompt += `• ${p.my_product}: Giá mình ${(p.my_price / 1000).toFixed(0)}K vs đối thủ ${(p.competitor_min / 1000).toFixed(0)}K-${(p.competitor_max / 1000).toFixed(0)}K\n`;
      });
    }

    if (priceEntries.length > 0) {
      prompt += `\n=== BẢNG GIÁ TỔNG QUAN ===\n`;
      priceEntries.forEach(p => {
        prompt += `• ${p.my_product}: ${(p.my_price / 1000).toFixed(0)}K (thị trường: ${(p.competitor_min / 1000).toFixed(0)}K-${(p.competitor_max / 1000).toFixed(0)}K) [${p.status}]\n`;
      });
    }

    prompt += `\nHãy phân tích và trả về danh sách action items bằng tiếng Việt, ngắn gọn, thực tế, có thể làm ngay.`;

    setActionPrompt(prompt);
  }

  function copyPrompt() {
    navigator.clipboard.writeText(actionPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ============ HELPERS ============
  function timeAgo(date: string) {
    const diff = (Date.now() - new Date(date).getTime()) / 1000;
    if (diff < 60) return 'vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return new Date(date).toLocaleDateString('vi');
  }

  function dayColor(date: string) {
    const diff = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 1) return '#34d399';
    if (diff < 3) return '#fbbf24';
    return '#f87171';
  }

  const filteredRadar = radarFilter === 'all'
    ? radarEntries
    : radarEntries.filter(r => r.category === radarFilter);

  const thisWeekCount = radarEntries.filter(r =>
    (Date.now() - new Date(r.created_at).getTime()) / (1000 * 60 * 60 * 24) <= 7
  ).length;

  const expensiveCount = priceEntries.filter(p => p.status === 'expensive').length;

  // ============ RENDER ============
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>📡 Radar Thị Trường</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Quan sát → So sánh → Hành động — {thisWeekCount} ghi chú tuần này
          {expensiveCount > 0 && <span style={{ color: '#f87171', marginLeft: 8 }}>⚠️ {expensiveCount} SP đang đắt</span>}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--bg-card-border)', paddingBottom: 2 }}>
        {[
          { key: 'radar', label: '📡 Radar', count: thisWeekCount },
          { key: 'price', label: '💰 So giá', count: priceEntries.length },
          { key: 'actions', label: '🧠 Action Items' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            style={{
              padding: '10px 18px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-main)',
              background: tab === t.key ? 'var(--bg-card)' : 'transparent',
              color: tab === t.key ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.2s',
            }}
          >
            {t.label} {'count' in t && t.count ? <span style={{ marginLeft: 6, fontSize: 11, background: 'var(--accent-soft)', color: 'var(--accent)', padding: '1px 6px', borderRadius: 4 }}>{t.count}</span> : null}
          </button>
        ))}
      </div>

      {/* ============ TAB: RADAR ============ */}
      {tab === 'radar' && (
        <div>
          {/* Add button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button onClick={() => setRadarFilter('all')} className="btn btn-sm" style={{ background: radarFilter === 'all' ? 'var(--accent)' : 'var(--bg-card)', color: radarFilter === 'all' ? 'white' : 'var(--text-secondary)', border: '1px solid var(--bg-card-border)' }}>Tất cả</button>
              {CATEGORIES.map(c => (
                <button key={c.value} onClick={() => setRadarFilter(c.value)} className="btn btn-sm" style={{ background: radarFilter === c.value ? c.color : 'var(--bg-card)', color: radarFilter === c.value ? 'white' : 'var(--text-secondary)', border: '1px solid var(--bg-card-border)' }}>
                  {c.label.split(' ')[0]}
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowRadarForm(!showRadarForm)}>
              {showRadarForm ? '✕ Đóng' : '+ Ghi chú mới'}
            </button>
          </div>

          {/* Form */}
          {showRadarForm && (
            <div className="card" style={{ marginBottom: 20, border: '1px solid var(--accent)', background: 'rgba(124,108,240,0.03)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📡 Ghi nhanh — Hôm nay thấy gì?</div>
              <div className="form-grid-2">
                <div>
                  <label className="form-label">Loại</label>
                  <select className="form-control" value={radarForm.category} onChange={e => setRadarForm({ ...radarForm, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Người ghi</label>
                  <input className="form-control" value={radarForm.created_by} onChange={e => setRadarForm({ ...radarForm, created_by: e.target.value })} placeholder="Tên bạn" />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="form-label">Ghi chú *</label>
                <textarea className="form-control" rows={3} value={radarForm.note} onChange={e => setRadarForm({ ...radarForm, note: e.target.value })} placeholder='VD: Shop GenZ giảm quần jean baggy từ 250K xuống 189K, freeship, đang bán 2K+/tháng' />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="form-label">Link (tuỳ chọn)</label>
                <input className="form-control" value={radarForm.url} onChange={e => setRadarForm({ ...radarForm, url: e.target.value })} placeholder="https://shopee.vn/... hoặc TikTok link" />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={addRadar} disabled={!radarForm.note.trim()}>💾 Lưu</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowRadarForm(false)}>Hủy</button>
              </div>
            </div>
          )}

          {/* Feed */}
          {filteredRadar.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📡</div>
              <div>Chưa có ghi chú nào</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Lướt Shopee/TikTok 10 phút rồi ghi lại điều đáng chú ý!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredRadar.map(entry => {
                const cat = CATEGORIES.find(c => c.value === entry.category);
                return (
                  <div key={entry.id} className="card" style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: dayColor(entry.created_at), marginTop: 7, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 4, background: `${cat?.color}20`, color: cat?.color }}>{cat?.label}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(entry.created_at)}</span>
                        {entry.created_by && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>• {entry.created_by}</span>}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{entry.note}</div>
                      {entry.url && (
                        <a href={entry.url} target="_blank" rel="noopener" style={{ fontSize: 11, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, textDecoration: 'none' }}>
                          🔗 {entry.url.length > 50 ? entry.url.slice(0, 50) + '...' : entry.url}
                        </a>
                      )}
                    </div>
                    <button onClick={() => deleteRadar(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, padding: 4, opacity: 0.5 }} title="Xóa">×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============ TAB: PRICE ============ */}
      {tab === 'price' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {priceEntries.length} sản phẩm đang theo dõi
              {expensiveCount > 0 && <span style={{ color: '#f87171', marginLeft: 8 }}>• {expensiveCount} đang đắt hơn thị trường</span>}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => { setShowPriceForm(!showPriceForm); setEditPriceId(null); setPriceForm({ my_product: '', my_price: '', competitor_min: '', competitor_max: '', competitor_names: '', notes: '' }); }}>
              {showPriceForm ? '✕ Đóng' : '+ Thêm sản phẩm'}
            </button>
          </div>

          {/* Form */}
          {showPriceForm && (
            <div className="card" style={{ marginBottom: 20, border: '1px solid var(--accent)', background: 'rgba(124,108,240,0.03)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{editPriceId ? '✏️ Sửa sản phẩm' : '💰 Thêm sản phẩm so giá'}</div>
              <div className="form-grid-2">
                <div>
                  <label className="form-label">Sản phẩm của mình *</label>
                  <input className="form-control" value={priceForm.my_product} onChange={e => setPriceForm({ ...priceForm, my_product: e.target.value })} placeholder="VD: Quần jean baggy wash" />
                </div>
                <div>
                  <label className="form-label">Giá mình (₫) *</label>
                  <input className="form-control" type="number" value={priceForm.my_price} onChange={e => setPriceForm({ ...priceForm, my_price: e.target.value })} placeholder="225000" />
                </div>
              </div>
              <div className="form-grid-2">
                <div>
                  <label className="form-label">Giá đối thủ thấp nhất (₫)</label>
                  <input className="form-control" type="number" value={priceForm.competitor_min} onChange={e => setPriceForm({ ...priceForm, competitor_min: e.target.value })} placeholder="189000" />
                </div>
                <div>
                  <label className="form-label">Giá đối thủ cao nhất (₫)</label>
                  <input className="form-control" type="number" value={priceForm.competitor_max} onChange={e => setPriceForm({ ...priceForm, competitor_max: e.target.value })} placeholder="280000" />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="form-label">Chi tiết đối thủ</label>
                <input className="form-control" value={priceForm.competitor_names} onChange={e => setPriceForm({ ...priceForm, competitor_names: e.target.value })} placeholder="Shop A: 189K, Shop B: 199K, Shop C: 250K" />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="form-label">Ghi chú</label>
                <input className="form-control" value={priceForm.notes} onChange={e => setPriceForm({ ...priceForm, notes: e.target.value })} placeholder="Đối thủ đang giảm giá mạnh" />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={addOrUpdatePrice} disabled={!priceForm.my_product.trim()}>💾 {editPriceId ? 'Cập nhật' : 'Lưu'}</button>
                <button className="btn btn-ghost btn-sm" onClick={() => { setShowPriceForm(false); setEditPriceId(null); }}>Hủy</button>
              </div>
            </div>
          )}

          {/* Price Table */}
          {priceEntries.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
              <div>Chưa có sản phẩm nào</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Thêm sản phẩm của bạn + giá đối thủ để so sánh</div>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="task-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>SẢN PHẨM CỦA MÌNH</th>
                    <th style={{ textAlign: 'right' }}>GIÁ MÌNH</th>
                    <th style={{ textAlign: 'right' }}>ĐỐI THỦ</th>
                    <th style={{ textAlign: 'center' }}>STATUS</th>
                    <th style={{ textAlign: 'center' }}>CHI TIẾT</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {priceEntries.map(p => {
                    const st = STATUS_MAP[p.status] || STATUS_MAP.ok;
                    const diff = p.competitor_max > 0 ? ((p.my_price - p.competitor_max) / p.competitor_max * 100).toFixed(0) : null;
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.my_product}</div>
                          {p.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{p.notes}</div>}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                          {(p.my_price / 1000).toFixed(0)}K
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
                          {p.competitor_min > 0 ? `${(p.competitor_min / 1000).toFixed(0)}K - ${(p.competitor_max / 1000).toFixed(0)}K` : '—'}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 6, background: st.bg, color: st.color }}>
                            {st.label} {diff && p.status === 'expensive' ? `(+${diff}%)` : ''}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.competitor_names || '—'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => editPrice(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, marginRight: 4 }} title="Sửa">✏️</button>
                          <button onClick={() => deletePrice(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: 12 }} title="Xóa">×</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Price Insight */}
          {expensiveCount > 0 && (
            <div className="card" style={{ marginTop: 16, border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.03)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f87171', marginBottom: 8 }}>💡 Gợi ý điều chỉnh giá</div>
              {priceEntries.filter(p => p.status === 'expensive').map(p => (
                <div key={p.id} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid #f87171' }}>
                  <strong>{p.my_product}</strong>: Đang bán <strong>{(p.my_price / 1000).toFixed(0)}K</strong> — thị trường <strong>{(p.competitor_min / 1000).toFixed(0)}K-{(p.competitor_max / 1000).toFixed(0)}K</strong>
                  {p.competitor_max > 0 && <span> → Xem xét giảm về <strong>{(p.competitor_max / 1000).toFixed(0)}K</strong> hoặc thêm offer</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============ TAB: ACTION ITEMS ============ */}
      {tab === 'actions' && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>🧠 AI Tổng Hợp Action Items</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
              AI sẽ đọc hết <strong>{thisWeekCount} ghi chú</strong> từ Radar + <strong>{priceEntries.length} sản phẩm</strong> so giá
              → tạo ra danh sách việc cần làm tuần này, chia theo mức độ ưu tiên.
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={generateActionPrompt}>
                🤖 Tạo prompt AI
              </button>
              {actionPrompt && (
                <button className="btn btn-secondary" onClick={copyPrompt}>
                  {copied ? '✅ Đã copy!' : '📋 Copy prompt'}
                </button>
              )}
            </div>
          </div>

          {actionPrompt ? (
            <div className="card" style={{ background: 'rgba(124,108,240,0.03)', border: '1px solid rgba(124,108,240,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>📋 Prompt đã tạo</div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Paste vào ChatGPT / Gemini</span>
              </div>
              <pre style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6, background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, maxHeight: 400, overflow: 'auto' }}>
                {actionPrompt}
              </pre>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                👉 <strong>Bước tiếp:</strong> Copy prompt → Paste vào <a href="https://chat.openai.com" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>ChatGPT</a> hoặc <a href="https://gemini.google.com" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>Gemini</a> → Nhận action items
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🧠</div>
              <div>Bấm "Tạo prompt AI" để bắt đầu</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Cần ít nhất 3 ghi chú Radar để AI phân tích hiệu quả</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
