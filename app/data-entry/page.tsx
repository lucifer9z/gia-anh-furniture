'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { KPI_BENCHMARKS } from '@/lib/bible-data';
import { useStore } from '@/lib/store-context';

export default function DataEntryPage() {
  const supabase = createClient();
  const { activeStoreId, storeFilter } = useStore();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({
    fb_spend: 0, fb_inbox: 0, fb_orders: 0, fb_revenue: 0,
    sp_organic: 0, sp_paid: 0, sp_revenue: 0, sp_spend: 0,
    tt_views: 0, tt_orders: 0, tt_revenue: 0, tt_followers: 0,
    fl_shipped: 0, fl_delivered: 0, fl_boom: 0, fl_return: 0,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadData(); }, [date, activeStoreId]);

  async function loadData() {
    let q = supabase.from('daily_data').select('*').eq('date', date);
    if (activeStoreId) q = q.eq('store_id', activeStoreId);
    const { data } = await q.limit(1).single();
    if (data) {
      setForm({
        fb_spend: data.fb_spend || 0, fb_inbox: data.fb_inbox || 0, fb_orders: data.fb_orders || 0, fb_revenue: data.fb_revenue || 0,
        sp_organic: data.sp_organic || 0, sp_paid: data.sp_paid || 0, sp_revenue: data.sp_revenue || 0, sp_spend: data.sp_spend || 0,
        tt_views: data.tt_views || 0, tt_orders: data.tt_orders || 0, tt_revenue: data.tt_revenue || 0, tt_followers: data.tt_followers || 0,
        fl_shipped: data.fl_shipped || 0, fl_delivered: data.fl_delivered || 0, fl_boom: data.fl_boom || 0, fl_return: data.fl_return || 0,
      });
    } else {
      setForm({ fb_spend: 0, fb_inbox: 0, fb_orders: 0, fb_revenue: 0, sp_organic: 0, sp_paid: 0, sp_revenue: 0, sp_spend: 0, tt_views: 0, tt_orders: 0, tt_revenue: 0, tt_followers: 0, fl_shipped: 0, fl_delivered: 0, fl_boom: 0, fl_return: 0 });
    }
  }

  const [saveError, setSaveError] = useState<string | null>(null);

  async function saveData() {
    setSaveError(null);
    const payload: any = { date, ...form };
    if (activeStoreId) payload.store_id = activeStoreId;
    const { error } = await supabase.from('daily_data').upsert(payload, { onConflict: 'date,store_id' });
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    else { setSaveError(error.message); }
  }

  function update(key: string, val: string) {
    setForm({ ...form, [key]: parseInt(val) || 0 });
  }

  function changeDate(offset: number) {
    const d = new Date(date); d.setDate(d.getDate() + offset);
    setDate(d.toISOString().slice(0, 10));
  }

  // Auto-calc
  const totalOrders = form.fb_orders + form.sp_organic + form.sp_paid + form.tt_orders;
  const totalRevenue = form.fb_revenue + form.sp_revenue + form.tt_revenue;
  const totalSpend = form.fb_spend + form.sp_spend;
  const cpa = form.fb_orders > 0 ? Math.round(form.fb_spend / form.fb_orders) : 0;
  const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) : '0';
  const closeRate = form.fb_inbox > 0 ? Math.round(form.fb_orders / form.fb_inbox * 100) : 0;
  const boomRate = form.fl_shipped > 0 ? Math.round(form.fl_boom / form.fl_shipped * 100) : 0;
  const delivRate = form.fl_shipped > 0 ? Math.round(form.fl_delivered / form.fl_shipped * 100) : 0;

  function status(value: number, bench: { good: number; ok: number; lowerBetter: boolean }) {
    if (value === 0) return '';
    if (bench.lowerBetter) return value <= bench.good ? 'ok' : value <= bench.ok ? 'warn' : 'bad';
    return value >= bench.good ? 'ok' : value >= bench.ok ? 'warn' : 'bad';
  }

  const sections = [
    { title: '📘 Facebook Ads', fields: [
      { key: 'fb_spend', label: 'Chi ads (K)' }, { key: 'fb_inbox', label: 'Inbox' },
      { key: 'fb_orders', label: 'Đơn chốt' }, { key: 'fb_revenue', label: 'DT (K)' },
    ]},
    { title: '🟠 Shopee', fields: [
      { key: 'sp_organic', label: 'Đơn organic' }, { key: 'sp_paid', label: 'Đơn paid' },
      { key: 'sp_revenue', label: 'DT (K)' }, { key: 'sp_spend', label: 'Chi ads (K)' },
    ]},
    { title: '🎵 TikTok', fields: [
      { key: 'tt_views', label: 'Views' }, { key: 'tt_orders', label: 'Đơn' },
      { key: 'tt_revenue', label: 'DT (K)' }, { key: 'tt_followers', label: 'Followers mới' },
    ]},
    { title: '📦 Fulfillment', fields: [
      { key: 'fl_shipped', label: 'Đã giao' }, { key: 'fl_delivered', label: 'Thành công' },
      { key: 'fl_boom', label: 'Boom COD' }, { key: 'fl_return', label: 'Hoàn hàng' },
    ]},
  ];

  const calcRows = [
    { label: 'Tổng đơn', value: totalOrders.toString(), st: '' },
    { label: 'Tổng doanh thu', value: `${totalRevenue}K`, st: '' },
    { label: 'Tổng chi ads', value: `${totalSpend}K`, st: '' },
    { label: 'CPA (FB)', value: cpa > 0 ? `${cpa}K` : '—', st: status(cpa, KPI_BENCHMARKS.cpa) },
    { label: 'ROAS', value: parseFloat(roas) > 0 ? `${roas}x` : '—', st: status(parseFloat(roas), KPI_BENCHMARKS.roas) },
    { label: 'Tỷ lệ chốt', value: closeRate > 0 ? `${closeRate}%` : '—', st: status(closeRate, KPI_BENCHMARKS.close_rate) },
    { label: 'Boom COD', value: form.fl_shipped > 0 ? `${boomRate}%` : '—', st: form.fl_shipped > 0 ? status(boomRate, KPI_BENCHMARKS.boom_rate) : '' },
    { label: 'Giao thành', value: form.fl_shipped > 0 ? `${delivRate}%` : '—', st: form.fl_shipped > 0 ? status(delivRate, KPI_BENCHMARKS.delivery_rate) : '' },
  ];

  return (
    <div className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">📊 Nhập Số Liệu</h1>
          <p className="text-secondary">{new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn" style={{ background: 'var(--glass-hover)', color: 'white' }} onClick={() => changeDate(-1)}>◀</button>
          <input type="date" className="form-control" style={{ width: 'auto' }} value={date} onChange={e => setDate(e.target.value)} />
          <button className="btn" style={{ background: 'var(--glass-hover)', color: 'white' }} onClick={() => changeDate(1)}>▶</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          {sections.map(section => (
            <div key={section.title} className="card panel" style={{ marginBottom: 16 }}>
              <div className="panel-title">{section.title}</div>
              <div className="form-grid">
                {section.fields.map(f => (
                  <div className="input-group" key={f.key}>
                    <label>{f.label}</label>
                    <input type="number" className="form-control" value={form[f.key as keyof typeof form] || ''} onChange={e => update(f.key, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={saveData}>
            {saved ? '✅ Đã lưu!' : '💾 Lưu số liệu'}
          </button>
          {saveError && <div style={{ marginTop: 8, color: 'var(--red)', fontSize: 12 }}>⚠️ Lỗi: {saveError}</div>}
        </div>

        <div className="card panel" style={{ position: 'sticky', top: 20, alignSelf: 'start' }}>
          <div className="panel-title">⚡ Auto-calc KPI</div>
          {calcRows.map(r => (
            <div className="auto-calc-row" key={r.label}>
              <span className="auto-calc-label">{r.label}</span>
              <span className={`auto-calc-value font-mono ${r.st}`}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
