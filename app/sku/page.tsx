'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useStore } from '@/lib/store-context';

interface SKU { id: string; name: string; code: string; category: string; cost_price: number; sell_price_fb: number; sell_price_shopee: number; sell_price_tiktok: number; stock: number; }

export default function SkuPage() {
  const [skus, setSkus] = useState<SKU[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', category: 'jean', cost_price: 80, sell_price_fb: 199, sell_price_shopee: 269, sell_price_tiktok: 279, stock: 100 });
  const supabase = createClient();
  const { activeStoreId, storeFilter } = useStore();

  useEffect(() => { loadSkus(); }, [activeStoreId]);

  async function loadSkus() {
    const q = storeFilter(supabase.from('skus').select('*')).order('created_at');
    const { data } = await q;
    if (data) setSkus(data);
  }

  async function addSku() {
    if (!form.name.trim() || !form.code.trim()) return;
    await supabase.from('skus').insert({ ...form, ...(activeStoreId ? { store_id: activeStoreId } : {}) });
    setForm({ name: '', code: '', category: 'jean', cost_price: 80, sell_price_fb: 199, sell_price_shopee: 269, sell_price_tiktok: 279, stock: 100 });
    setShowForm(false);
    loadSkus();
  }

  async function deleteSku(id: string) {
    await supabase.from('skus').delete().eq('id', id);
    loadSkus();
  }

  // Biên ròng calculation from Bible
  function calcMargin(channel: 'fb' | 'shopee' | 'tiktok', sku: SKU) {
    const ship = 20; const packaging = 5; const cpa = 25;
    if (channel === 'fb') {
      const margin = sku.sell_price_fb - sku.cost_price - cpa - ship - packaging;
      const pct = Math.round(margin / sku.sell_price_fb * 100);
      return { margin, pct };
    }
    if (channel === 'shopee') {
      const fee = Math.round(sku.sell_price_shopee * 0.395 + 4.6);
      const margin = sku.sell_price_shopee - sku.cost_price - fee - packaging;
      const pct = Math.round(margin / sku.sell_price_shopee * 100);
      return { margin, pct };
    }
    // tiktok
    const fee = Math.round(sku.sell_price_tiktok * 0.456 + 7.6);
    const margin = sku.sell_price_tiktok - sku.cost_price - fee - packaging;
    const pct = Math.round(margin / sku.sell_price_tiktok * 100);
    return { margin, pct };
  }

  function marginColor(pct: number) {
    if (pct >= 25) return 'var(--green)';
    if (pct >= 15) return 'var(--yellow)';
    return 'var(--red)';
  }

  return (
    <div className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">📦 SKU Tracking</h1>
          <p className="text-secondary">Quản lý sản phẩm — biên ròng tự tính theo công thức Bible</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Thêm SKU</button>
      </div>

      {/* Margin formula */}
      <div className="card panel" style={{ marginBottom: 20, fontSize: 12, color: 'var(--text-muted)' }}>
        <strong style={{ color: 'var(--text-secondary)' }}>Công thức biên:</strong><br />
        FB: Giá bán - Nhập - CPA(25K) - Ship(20K) - Bao bì(5K)<br />
        Shopee: Giá bán - Nhập - (Giá×39.5% + 4.6K) - Bao bì(5K)<br />
        TikTok: Giá bán - Nhập - (Giá×45.6% + 7.6K) - Bao bì(5K)<br />
        <span style={{ marginTop: 4, display: 'inline-flex', gap: 12 }}>
          <span style={{ color: 'var(--green)' }}>🟢 ≥25%</span>
          <span style={{ color: 'var(--yellow)' }}>🟡 15-25%</span>
          <span style={{ color: 'var(--red)' }}>🔴 &lt;15%</span>
        </span>
      </div>

      {showForm && (
        <div className="card panel" style={{ marginBottom: 20 }}>
          <div className="form-grid">
            <div className="input-group"><label>Tên sản phẩm</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jean suông đen" /></div>
            <div className="input-group"><label>Mã SKU</label><input className="form-control" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="JS-DEN-01" /></div>
            <div className="input-group"><label>Loại</label>
              <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="jean">Jean</option><option value="short">Short</option><option value="ao-thun">Áo thun</option>
              </select>
            </div>
            <div className="input-group"><label>Giá nhập (K)</label><input type="number" className="form-control" value={form.cost_price} onChange={e => setForm({ ...form, cost_price: parseInt(e.target.value) || 0 })} /></div>
            <div className="input-group"><label>Giá bán FB (K)</label><input type="number" className="form-control" value={form.sell_price_fb} onChange={e => setForm({ ...form, sell_price_fb: parseInt(e.target.value) || 0 })} /></div>
            <div className="input-group"><label>Giá bán Shopee (K)</label><input type="number" className="form-control" value={form.sell_price_shopee} onChange={e => setForm({ ...form, sell_price_shopee: parseInt(e.target.value) || 0 })} /></div>
            <div className="input-group"><label>Giá bán TikTok (K)</label><input type="number" className="form-control" value={form.sell_price_tiktok} onChange={e => setForm({ ...form, sell_price_tiktok: parseInt(e.target.value) || 0 })} /></div>
            <div className="input-group"><label>Tồn kho</label><input type="number" className="form-control" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} /></div>
          </div>
          <button className="btn btn-primary" onClick={addSku}>💾 Lưu SKU</button>
        </div>
      )}

      {/* SKU Table */}
      {skus.length === 0 ? (
        <div className="card panel" style={{ textAlign: 'center', padding: 40 }}>
          <p className="text-muted">Chưa có SKU nào. Thêm sản phẩm đầu tiên!</p>
        </div>
      ) : (
        <div className="md-table-wrap">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Mã</th><th>Tên</th><th>Loại</th><th>Nhập</th><th>Tồn</th>
                <th>FB (giá / biên)</th><th>Shopee (giá / biên)</th><th>TikTok (giá / biên)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {skus.map(sku => {
                const fb = calcMargin('fb', sku);
                const sp = calcMargin('shopee', sku);
                const tt = calcMargin('tiktok', sku);
                return (
                  <tr key={sku.id}>
                    <td><code className="md-inline-code">{sku.code}</code></td>
                    <td style={{ fontWeight: 500 }}>{sku.name}</td>
                    <td>{sku.category}</td>
                    <td className="font-mono">{sku.cost_price}K</td>
                    <td className="font-mono" style={{ color: sku.stock < 20 ? 'var(--red)' : 'var(--text-main)' }}>{sku.stock}</td>
                    <td>
                      <span className="font-mono">{sku.sell_price_fb}K</span>
                      <span className="font-mono" style={{ marginLeft: 8, color: marginColor(fb.pct), fontWeight: 700 }}>{fb.pct}%</span>
                      <span className="text-muted" style={{ fontSize: 10, marginLeft: 4 }}>({fb.margin}K)</span>
                    </td>
                    <td>
                      <span className="font-mono">{sku.sell_price_shopee}K</span>
                      <span className="font-mono" style={{ marginLeft: 8, color: marginColor(sp.pct), fontWeight: 700 }}>{sp.pct}%</span>
                      <span className="text-muted" style={{ fontSize: 10, marginLeft: 4 }}>({sp.margin}K)</span>
                    </td>
                    <td>
                      <span className="font-mono">{sku.sell_price_tiktok}K</span>
                      <span className="font-mono" style={{ marginLeft: 8, color: marginColor(tt.pct), fontWeight: 700 }}>{tt.pct}%</span>
                      <span className="text-muted" style={{ fontSize: 10, marginLeft: 4 }}>({tt.margin}K)</span>
                    </td>
                    <td><span style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }} onClick={() => deleteSku(sku.id)}>✕</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
