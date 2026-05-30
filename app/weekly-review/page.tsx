'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useStore } from '@/lib/store-context';
import { KPI_BENCHMARKS, DECISION_GATES } from '@/lib/bible-data';

interface DailyData {
  date: string;
  fb_spend: number; fb_inbox: number; fb_orders: number; fb_revenue: number;
  sp_organic: number; sp_paid: number; sp_revenue: number; sp_spend: number;
  tt_views: number; tt_orders: number; tt_revenue: number;
  fl_shipped: number; fl_delivered: number; fl_boom: number; fl_return: number;
}

export default function WeeklyReviewPage() {
  const [data, setData] = useState<DailyData[]>([]);
  const [prevWeekData, setPrevWeekData] = useState<DailyData[]>([]);
  const supabase = createClient();
  const { activeStoreId, storeFilter } = useStore();

  useEffect(() => { loadData(); }, [activeStoreId]);

  async function loadData() {
    const dates: string[] = [];
    const prevDates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }
    for (let i = 13; i >= 7; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      prevDates.push(d.toISOString().slice(0, 10));
    }
    const q1 = storeFilter(supabase.from('daily_data').select('*').in('date', dates)).order('date');
    const { data: rows } = await q1;
    if (rows) setData(rows as DailyData[]);

    const q2 = storeFilter(supabase.from('daily_data').select('*').in('date', prevDates)).order('date');
    const { data: prevRows } = await q2;
    if (prevRows) setPrevWeekData(prevRows as DailyData[]);
  }

  // This week totals
  const sum = (arr: DailyData[], fn: (d: DailyData) => number) => arr.reduce((s, d) => s + fn(d), 0);

  const weekOrders = sum(data, d => d.fb_orders + d.sp_organic + d.sp_paid + d.tt_orders);
  const weekRevenue = sum(data, d => d.fb_revenue + d.sp_revenue + d.tt_revenue);
  const weekSpend = sum(data, d => d.fb_spend + d.sp_spend);
  const weekCpa = sum(data, d => d.fb_orders) > 0 ? Math.round(sum(data, d => d.fb_spend) / sum(data, d => d.fb_orders)) : 0;
  const weekRoas = weekSpend > 0 ? parseFloat((weekRevenue / weekSpend).toFixed(1)) : 0;
  const weekShipped = sum(data, d => d.fl_shipped);
  const weekDelivered = sum(data, d => d.fl_delivered);
  const weekBoom = sum(data, d => d.fl_boom);
  const weekReturn = sum(data, d => d.fl_return);

  // Prev week totals
  const prevOrders = sum(prevWeekData, d => d.fb_orders + d.sp_organic + d.sp_paid + d.tt_orders);
  const prevRevenue = sum(prevWeekData, d => d.fb_revenue + d.sp_revenue + d.tt_revenue);
  const prevSpend = sum(prevWeekData, d => d.fb_spend + d.sp_spend);

  // Comparisons
  const ordersDiff = prevOrders > 0 ? Math.round((weekOrders - prevOrders) / prevOrders * 100) : 0;
  const revenueDiff = prevRevenue > 0 ? Math.round((weekRevenue - prevRevenue) / prevRevenue * 100) : 0;

  // P&L
  const totalCOGS = weekOrders * 80; // Giá nhập 80K/cái
  const packaging = weekOrders * 5;
  const shipping = weekShipped * 20;
  const fbFee = 0; // FB no platform fee
  const spRevenue = sum(data, d => d.sp_revenue);
  const spFee = Math.round(spRevenue * 0.395);
  const ttRevenue = sum(data, d => d.tt_revenue);
  const ttFee = Math.round(ttRevenue * 0.456);
  const totalCost = totalCOGS + packaging + shipping + weekSpend + spFee + ttFee;
  const profit = weekRevenue - totalCost;
  const profitPct = weekRevenue > 0 ? Math.round(profit / weekRevenue * 100) : 0;

  // Daily breakdown
  const dayNames = ['CN','T2','T3','T4','T5','T6','T7'];

  // KPI status helper
  function kpiColor(value: number, good: number, lowerBetter: boolean) {
    if (value === 0) return 'var(--text-muted)';
    if (lowerBetter) return value <= good ? 'var(--green)' : value <= good * 1.5 ? 'var(--yellow)' : 'var(--red)';
    return value >= good ? 'var(--green)' : value >= good * 0.6 ? 'var(--yellow)' : 'var(--red)';
  }

  const deliveryRate = weekShipped > 0 ? Math.round(weekDelivered / weekShipped * 100) : 0;
  const boomRate = weekShipped > 0 ? Math.round(weekBoom / weekShipped * 100) : 0;
  const fbCloseRate = sum(data, d => d.fb_inbox) > 0 ? Math.round(sum(data, d => d.fb_orders) / sum(data, d => d.fb_inbox) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📋 Review tuần</div>
        <div className="page-sub">Tổng hợp 7 ngày gần nhất — {data.length > 0 ? `${data[0]?.date} → ${data[data.length - 1]?.date}` : '...'}</div>
      </div>

      {/* Summary KPI */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon purple">📦</div>
          </div>
          <div className="kpi-label">Tổng đơn tuần</div>
          <div className="kpi-value">{weekOrders || '—'}</div>
          <div className={`kpi-trend ${ordersDiff >= 0 ? 'up' : 'down'}`}>
            {ordersDiff !== 0 ? `${ordersDiff > 0 ? '↑' : '↓'}${Math.abs(ordersDiff)}% vs tuần trước` : ''}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon green">💰</div>
          </div>
          <div className="kpi-label">Doanh thu tuần</div>
          <div className="kpi-value">{weekRevenue > 0 ? `${(weekRevenue / 1000000).toFixed(1)}M` : '—'}</div>
          <div className={`kpi-trend ${revenueDiff >= 0 ? 'up' : 'down'}`}>
            {revenueDiff !== 0 ? `${revenueDiff > 0 ? '↑' : '↓'}${Math.abs(revenueDiff)}% vs tuần trước` : ''}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon blue">📊</div>
          </div>
          <div className="kpi-label">CPA trung bình</div>
          <div className="kpi-value" style={{ color: kpiColor(weekCpa, 25, true) }}>{weekCpa > 0 ? `${weekCpa}K` : '—'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon orange">📈</div>
          </div>
          <div className="kpi-label">ROAS tuần</div>
          <div className="kpi-value" style={{ color: kpiColor(weekRoas, 3.5, false) }}>{weekRoas > 0 ? `${weekRoas}` : '—'}</div>
        </div>
      </div>

      <div className="dashboard-grid-2">
        {/* P&L Card */}
        <div className="card">
          <div className="card-title">💰 P&L tuần</div>
          <div className="auto-calc-row">
            <span className="auto-calc-label">Doanh thu</span>
            <span className="auto-calc-value">{(weekRevenue / 1000).toFixed(0)}K</span>
          </div>
          <div className="auto-calc-row">
            <span className="auto-calc-label">Giá nhập ({weekOrders} × 80K)</span>
            <span className="auto-calc-value" style={{ color: 'var(--text-muted)' }}>-{(totalCOGS / 1000).toFixed(0)}K</span>
          </div>
          <div className="auto-calc-row">
            <span className="auto-calc-label">Ads (FB + Shopee)</span>
            <span className="auto-calc-value" style={{ color: 'var(--text-muted)' }}>-{(weekSpend / 1000).toFixed(0)}K</span>
          </div>
          <div className="auto-calc-row">
            <span className="auto-calc-label">Phí sàn Shopee ({(spFee / 1000).toFixed(0)}K) + TikTok ({(ttFee / 1000).toFixed(0)}K)</span>
            <span className="auto-calc-value" style={{ color: 'var(--text-muted)' }}>-{((spFee + ttFee) / 1000).toFixed(0)}K</span>
          </div>
          <div className="auto-calc-row">
            <span className="auto-calc-label">Ship + Bao bì</span>
            <span className="auto-calc-value" style={{ color: 'var(--text-muted)' }}>-{((shipping + packaging) / 1000).toFixed(0)}K</span>
          </div>
          <div className="auto-calc-row" style={{ borderTop: '2px solid var(--bg-card-border)', marginTop: 8, paddingTop: 12 }}>
            <span className="auto-calc-label" style={{ fontWeight: 700, fontSize: 14 }}>Lợi nhuận ròng</span>
            <span className={`auto-calc-value ${profit >= 0 ? 'ok' : 'bad'}`} style={{ fontSize: 18 }}>
              {profit >= 0 ? '+' : ''}{(profit / 1000).toFixed(0)}K ({profitPct}%)
            </span>
          </div>
        </div>

        {/* Operational KPIs */}
        <div className="card">
          <div className="card-title">📊 Chỉ số vận hành</div>
          <div className="auto-calc-row">
            <span className="auto-calc-label">Tỷ lệ chốt (FB)</span>
            <span className="auto-calc-value" style={{ color: kpiColor(fbCloseRate, 25, false) }}>{fbCloseRate}%</span>
          </div>
          <div className="auto-calc-row">
            <span className="auto-calc-label">Giao thành công</span>
            <span className="auto-calc-value" style={{ color: kpiColor(deliveryRate, 90, false) }}>{deliveryRate}%</span>
          </div>
          <div className="auto-calc-row">
            <span className="auto-calc-label">Boom COD</span>
            <span className="auto-calc-value" style={{ color: kpiColor(boomRate, 12, true) }}>{boomRate}%</span>
          </div>
          <div className="auto-calc-row">
            <span className="auto-calc-label">Hoàn hàng</span>
            <span className="auto-calc-value" style={{ color: kpiColor(weekShipped > 0 ? Math.round(weekReturn / weekShipped * 100) : 0, 8, true) }}>{weekShipped > 0 ? Math.round(weekReturn / weekShipped * 100) : 0}%</span>
          </div>
          <div className="auto-calc-row">
            <span className="auto-calc-label">Chi phí/đơn</span>
            <span className="auto-calc-value" style={{ color: weekOrders > 0 && totalCost / weekOrders < 130 ? 'var(--green)' : 'var(--yellow)' }}>{weekOrders > 0 ? `${Math.round(totalCost / weekOrders)}K` : '—'}</span>
          </div>
          <div className="auto-calc-row">
            <span className="auto-calc-label">Biên ròng/đơn</span>
            <span className={`auto-calc-value ${profit >= 0 ? 'ok' : 'bad'}`}>{weekOrders > 0 ? `${Math.round(profit / weekOrders)}K` : '—'}</span>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title">📅 Chi tiết theo ngày</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Đơn</th>
                <th>DT</th>
                <th>Spend</th>
                <th>CPA</th>
                <th>ROAS</th>
                <th>Giao</th>
                <th>Boom</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => {
                const orders = d.fb_orders + d.sp_organic + d.sp_paid + d.tt_orders;
                const revenue = d.fb_revenue + d.sp_revenue + d.tt_revenue;
                const spend = d.fb_spend + d.sp_spend;
                const dayCpa = d.fb_orders > 0 ? Math.round(d.fb_spend / d.fb_orders) : 0;
                const dayRoas = spend > 0 ? (revenue / spend).toFixed(1) : '—';
                const dayDate = new Date(d.date);
                return (
                  <tr key={d.date}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{dayNames[dayDate.getDay()]} {dayDate.getDate()}/{dayDate.getMonth() + 1}</td>
                    <td style={{ fontWeight: 700 }}>{orders}</td>
                    <td>{(revenue / 1000).toFixed(0)}K</td>
                    <td>{(spend / 1000).toFixed(0)}K</td>
                    <td style={{ color: kpiColor(dayCpa, 25, true) }}>{dayCpa > 0 ? `${dayCpa}K` : '—'}</td>
                    <td style={{ color: kpiColor(parseFloat(dayRoas as string) || 0, 3.5, false) }}>{dayRoas}</td>
                    <td>{d.fl_delivered}/{d.fl_shipped}</td>
                    <td style={{ color: d.fl_boom > 0 ? 'var(--red)' : 'var(--text-muted)' }}>{d.fl_boom}</td>
                  </tr>
                );
              })}
              {data.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>Chưa có dữ liệu tuần này</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Gate */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title">🚦 Decision Gates</div>
        {DECISION_GATES.map(gate => (
          <div className="warning-item" key={gate.id}>
            <div className="warning-icon" style={{ background: 'var(--accent-soft)' }}>🚩</div>
            <div className="warning-text">
              <div style={{ fontWeight: 600 }}>{gate.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{gate.checks}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
