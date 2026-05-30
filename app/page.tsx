'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { KPI_BENCHMARKS } from '@/lib/bible-data';
import { useStore } from '@/lib/store-context';
import Link from 'next/link';
import { exportToPng } from '@/lib/export';
import { requestNotificationPermission } from '@/lib/notifications';
import { DailyData, TaskItem } from '@/lib/types';
import { KPICard, FunnelCard, WarningsCard, AdsCard, TasksCard, RemindersCard, WeeklyReviewCard, DashboardSkeleton } from '@/components/dashboard';

export default function Dashboard() {
  const [data, setData] = useState<DailyData[]>([]);
  const [yesterday, setYesterday] = useState<DailyData | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [skuWarnings, setSkuWarnings] = useState<string[]>([]);
  const [contentCount, setContentCount] = useState(0);
  const supabase = createClient();
  const { activeStoreId, storeFilter } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    requestNotificationPermission();
    loadAll();
  }, [activeStoreId]);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      // === PARALLEL FETCH — 3x faster than sequential ===
      const dates: string[] = [];
      for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); dates.push(d.toISOString().slice(0, 10)); }
      const yd = new Date(); yd.setDate(yd.getDate() - 1);
      const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

      const [dailyRes, ydRes, tasksRes, stockRes, contentRes] = await Promise.all([
        storeFilter(supabase.from('daily_data').select('*').in('date', dates)).order('date'),
        storeFilter(supabase.from('daily_data').select('*').eq('date', yd.toISOString().slice(0, 10))).limit(1).single(),
        storeFilter(supabase.from('tasks').select('*').eq('date', todayStr)).order('time_slot').limit(5),
        storeFilter(supabase.from('skus').select('name, stock').lt('stock', 20)),
        storeFilter(supabase.from('content_items').select('*', { count: 'exact', head: true }).gte('date', weekStart.toISOString().slice(0, 10))),
      ]);

      if (dailyRes.data) setData(dailyRes.data as DailyData[]);
      if (ydRes.data) setYesterday(ydRes.data as DailyData); else setYesterday(null);
      if (tasksRes.data) setTasks(tasksRes.data);
      if (stockRes.data) setSkuWarnings(stockRes.data.map((s: { name: string; stock: number }) => `${s.name} (còn ${s.stock})`));
      else setSkuWarnings([]);
      setContentCount(contentRes.count || 0);
    } catch (err: any) {
      setError(err?.message || 'Lỗi tải dữ liệu');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTask(id: string, done: boolean) {
    await supabase.from('tasks').update({ done: !done }).eq('id', id);
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  const today = data.find(d => d.date === todayStr);
  const hasData = !!today;

  const totalOrders = today ? (today.fb_orders + today.sp_organic + today.sp_paid + today.tt_orders) : 0;
  const totalRevenue = today ? (today.fb_revenue + today.sp_revenue + today.tt_revenue) : 0;
  const totalSpend = today ? (today.fb_spend + today.sp_spend) : 0;
  const cpa = today && today.fb_orders > 0 ? Math.round(today.fb_spend / today.fb_orders) : 0;
  const roas = totalSpend > 0 ? parseFloat((totalRevenue / totalSpend).toFixed(1)) : 0;

  const ydOrders = yesterday ? (yesterday.fb_orders + yesterday.sp_organic + yesterday.sp_paid + yesterday.tt_orders) : 0;
  const ydRevenue = yesterday ? (yesterday.fb_revenue + yesterday.sp_revenue + yesterday.tt_revenue) : 0;
  const ordersDiff = totalOrders - ydOrders;
  const revenuePct = ydRevenue > 0 ? Math.round((totalRevenue - ydRevenue) / ydRevenue * 100) : 0;

  // Targets
  const targetOrders = 20;
  const targetCpa = 30;
  const targetRoas = 3.0;
  const targetRevenue = 6000;

  function kpiCheck(value: number, target: number, lowerBetter: boolean) {
    if (value === 0) return '';
    if (lowerBetter) return value <= target ? 'ok' : value <= target * 1.3 ? 'warn' : 'bad';
    return value >= target ? 'ok' : value >= target * 0.7 ? 'warn' : 'bad';
  }

  // Funnel
  const funnelImpressions = today ? Math.round((today.fb_inbox * 8.5) * 15) : 0;
  const funnelClicks = today ? Math.round(today.fb_inbox * 8.5) : 0;
  const funnelInbox = today ? today.fb_inbox : 0;
  const funnelOrders = totalOrders;
  const funnelDelivered = today ? today.fl_delivered : 0;
  const maxFunnel = funnelImpressions || 1;

  const closeRate = funnelInbox > 0 ? (funnelOrders / funnelInbox * 100).toFixed(1) : '0';
  const deliveryRate = today && today.fl_shipped > 0 ? (today.fl_delivered / today.fl_shipped * 100).toFixed(1) : '0';

  // Warnings
  const warnings: { text: string; type: string; icon: string }[] = [];
  if (!hasData) warnings.push({ text: 'Chưa nhập số liệu hôm nay', type: 'yellow', icon: '⚠️' });
  if (cpa > 40) warnings.push({ text: `CPA ${cpa}K — vượt ngưỡng nguy hiểm (>40K)`, type: 'red', icon: '🔴' });
  if (today && today.fl_shipped > 0 && today.fl_boom / today.fl_shipped > 0.2) warnings.push({ text: `Boom COD ${Math.round(today.fl_boom / today.fl_shipped * 100)}% — quá cao`, type: 'red', icon: '🔴' });
  if (contentCount < 3) warnings.push({ text: `Chỉ ${contentCount} content tuần này — cần ≥ 3`, type: 'orange', icon: '⚠️' });
  skuWarnings.forEach(w => warnings.push({ text: `Tồn kho sắp hết: ${w}`, type: 'orange', icon: '⚠️' }));

  // === #1: DIAGNOSTIC AUTO-DETECT (Bible 08-DATA) ===
  const diagnostics: { text: string; action: string; type: string; icon: string }[] = [];
  if (hasData) {
    // No orders diagnostic tree
    if (totalOrders === 0 && today.fb_spend > 0) {
      if (today.fb_inbox === 0) {
        diagnostics.push({ text: 'Spend > 0 nhưng 0 inbox', action: '→ Creative yếu — ĐỔI VIDEO ngay', type: 'red', icon: '🎬' });
      } else if (today.fb_inbox > 0 && today.fb_orders === 0) {
        diagnostics.push({ text: `${today.fb_inbox} inbox nhưng 0 đơn FB`, action: '→ Script chốt yếu — SỬA SCRIPT', type: 'red', icon: '💬' });
      }
    } else if (totalOrders > 0) {
      // Close rate low
      const cr = today.fb_inbox > 0 ? (today.fb_orders / today.fb_inbox * 100) : 0;
      if (cr > 0 && cr < 15) {
        diagnostics.push({ text: `Tỷ lệ chốt ${cr.toFixed(0)}% (< 15%)`, action: '→ Cải thiện script chốt + offer', type: 'orange', icon: '💬' });
      }
      // Delivery low
      if (today.fl_shipped > 0 && today.fl_delivered / today.fl_shipped < 0.8) {
        diagnostics.push({ text: `Giao thành ${Math.round(today.fl_delivered / today.fl_shipped * 100)}% (< 80%)`, action: '→ Tăng confirm COD + check địa chỉ', type: 'orange', icon: '📦' });
      }
      // Return high
      if (today.fl_return > 0 && today.fl_shipped > 0 && today.fl_return / today.fl_shipped > 0.15) {
        diagnostics.push({ text: `Hoàn ${Math.round(today.fl_return / today.fl_shipped * 100)}% (> 15%)`, action: '→ Check chất lượng SP + size chart', type: 'red', icon: '🔄' });
      }
    }
    // Spend but no profit
    if (totalSpend > 0 && totalRevenue > 0 && roas < 2.0) {
      diagnostics.push({ text: `ROAS ${roas} — đang LỖ (< 2.0)`, action: '→ Tăng tỷ trọng FB Ads, giảm sàn', type: 'red', icon: '📉' });
    }
  }

  // === #2: ADS SCALE/CẮT RECOMMENDATION (Bible 05-DISTRIBUTION) ===
  const adsRecs: { text: string; type: string; icon: string }[] = [];
  if (hasData && today.fb_spend > 0) {
    if (cpa <= 25 && today.fb_orders >= 3) {
      adsRecs.push({ text: `CPA ${cpa}K + ${today.fb_orders} đơn → SCALE +20% budget`, type: 'green', icon: '🚀' });
    } else if (cpa <= 25 && today.fb_orders < 3) {
      adsRecs.push({ text: `CPA ${cpa}K tốt nhưng ít đơn → GIỮ, chờ thêm data`, type: 'blue', icon: '⏳' });
    } else if (cpa > 25 && cpa <= 40 && today.fb_orders >= 3) {
      adsRecs.push({ text: `CPA ${cpa}K khá cao → GIỮ budget, TEST creative mới`, type: 'yellow', icon: '🔄' });
    } else if (cpa > 25 && cpa <= 40 && today.fb_orders < 3) {
      adsRecs.push({ text: `CPA ${cpa}K + ít đơn → ĐỔI creative + check targeting`, type: 'orange', icon: '⚠️' });
    } else if (cpa > 40 && today.fb_orders >= 3) {
      adsRecs.push({ text: `CPA ${cpa}K quá cao → CẮT ad set thua, giữ ad set thắng`, type: 'red', icon: '✂️' });
    } else if (cpa > 40 && today.fb_orders < 3) {
      adsRecs.push({ text: `CPA ${cpa}K + 0-2 đơn → CẮT NGAY, đổi toàn bộ creative`, type: 'red', icon: '🛑' });
    }
    // ROAS recommendation
    if (roas >= 3.5) {
      adsRecs.push({ text: `ROAS ${roas} xuất sắc → Scale mạnh kênh FB, đây là goldmine`, type: 'green', icon: '💰' });
    } else if (roas >= 2.0 && roas < 3.5) {
      adsRecs.push({ text: `ROAS ${roas} ổn → Tối ưu creative để đẩy lên >3.5`, type: 'blue', icon: '📈' });
    }
  }

  // Reminders
  const reminders = [
    { time: '08:30', text: 'Họp team buổi sáng', status: 'done' },
    { time: '21:00', text: 'Nhập số liệu ngày', status: hasData ? 'done' : 'active' },
    { time: '22:00', text: 'Review ads', status: 'upcoming' },
  ];

  const moduleMap: Record<string, { label: string; cls: string }> = {
    morning: { label: 'Vận hành', cls: 'pill-operation' },
    afternoon: { label: 'Content', cls: 'pill-content' },
    evening: { label: 'Dữ liệu', cls: 'pill-data' },
  };

  const roleMap: Record<string, { label: string; cls: string }> = {
    leader: { label: 'Leader', cls: 'leader' },
    ads: { label: 'Ads', cls: 'ads' },
    media: { label: 'Media', cls: 'media' },
    sales: { label: 'Sales', cls: 'sales' },
    fulfillment: { label: 'Fulfillment', cls: 'fulfillment' },
  };

  // Data entry progress
  const dataFields = today ? [today.fb_spend, today.sp_revenue, today.tt_revenue, today.fl_shipped] : [0,0,0,0];
  const filledChannels = dataFields.filter(v => v > 0).length;
  const dataPct = Math.round(filledChannels / 4 * 100);

  // Status
  let statusTitle = 'Chưa có số liệu hôm nay';
  let statusClass = 'warn';
  let statusDesc = 'Nhập số liệu để hệ thống đánh giá hiệu quả vận hành.';
  if (hasData && cpa <= targetCpa && roas >= targetRoas) {
    statusTitle = 'Vận hành ổn định ✨';
    statusClass = 'ok';
    statusDesc = 'Tất cả chỉ số đang trong ngưỡng tốt. Tiếp tục giữ nhịp!';
  } else if (hasData) {
    statusTitle = 'Cần chú ý ⚡';
    statusClass = 'warn';
    statusDesc = 'Một số chỉ số chưa đạt mục tiêu. Kiểm tra CPA và ROAS.';
  }


  if (loading) return <DashboardSkeleton />;

  const funnelRows = [
    { label: 'Impression', value: funnelImpressions, pct: 100, color: 'purple' },
    { label: 'Click', value: funnelClicks, pct: funnelImpressions > 0 ? (funnelClicks / funnelImpressions * 100) : 0, color: 'blue' },
    { label: 'Inbox', value: funnelInbox, pct: funnelClicks > 0 ? (funnelInbox / funnelClicks * 100) : 0, color: 'orange' },
    { label: 'Đơn', value: funnelOrders, pct: funnelInbox > 0 ? (funnelOrders / funnelInbox * 100) : 0, color: 'pink' },
    { label: 'Hoàn tất', value: funnelDelivered, pct: funnelOrders > 0 ? (funnelDelivered / funnelOrders * 100) : 0, color: 'green' },
  ];

  return (
    <div id="dashboard-export">
      {/* Error banner */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid var(--red)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>⚠️</span>
          <span style={{ color: 'var(--red)', fontSize: 13 }}>{error}</span>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={loadAll}>Thử lại</button>
        </div>
      )}

      {/* Greeting */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-greeting">Chào Công 👋</div>
          <div className="page-sub">Mục tiêu hôm nay: {targetOrders} đơn · CPA &lt; {targetCpa}K · ROAS &gt; {targetRoas}</div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="status-banner">
        <div className="status-icon">📋</div>
        <div className="status-info" style={{ flex: 1 }}>
          <div className={`status-title ${statusClass}`}>{statusTitle}</div>
          <div className="status-desc">{statusDesc}</div>
          <div className="status-progress">
            <div className="status-progress-fill" style={{ width: `${dataPct}%` }}></div>
          </div>
          <div className="text-muted" style={{ fontSize: 11, marginTop: 4 }}>{dataPct}% dữ liệu</div>
        </div>
        <div className="status-actions">
          <Link href="/data-entry" className="btn btn-primary">📊 Nhập số liệu ngay</Link>
          <button className="btn btn-secondary">🎯 Thiết lập mục tiêu</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard icon="📦" iconColor="purple" label="Tổng đơn hôm nay" value={totalOrders ? `${totalOrders}` : '—'}
          trend={ordersDiff !== 0 ? `${ordersDiff > 0 ? '↑' : '↓'}${Math.abs(ordersDiff)} so với hôm qua` : undefined}
          trendDir={ordersDiff >= 0 ? 'up' : 'down'} target={`Mục tiêu: ${targetOrders} đơn`}
          checkStatus={totalOrders > 0 ? kpiCheck(totalOrders, targetOrders, false) || undefined : undefined} />
        <KPICard icon="💰" iconColor="green" label="Doanh thu" value={totalRevenue > 0 ? `${(totalRevenue / 1000).toFixed(1)}M` : '—'}
          trend={revenuePct !== 0 ? `${revenuePct > 0 ? '↑' : '↓'}${Math.abs(revenuePct)}%` : undefined}
          trendDir={revenuePct >= 0 ? 'up' : 'down'} target={`Mục tiêu: ${(targetRevenue / 1000).toFixed(0)}M`}
          checkStatus={totalRevenue > 0 ? kpiCheck(totalRevenue, targetRevenue, false) || undefined : undefined} />
        <KPICard icon="📊" iconColor="blue" label="CPA" value={cpa > 0 ? `${cpa}K` : '—'}
          trend={cpa > 0 ? (cpa <= targetCpa ? '✅ Đạt mục tiêu' : '⚠️ Chưa đạt') : undefined}
          trendDir={cpa > 0 && cpa <= targetCpa ? 'up' : cpa > 0 ? 'down' : 'neutral'} target={`Mục tiêu < ${targetCpa}K`}
          checkStatus={cpa > 0 ? kpiCheck(cpa, targetCpa, true) || undefined : undefined} />
        <KPICard icon="📈" iconColor="orange" label="ROAS" value={roas > 0 ? `${roas}` : '—'}
          trend={roas > 0 ? `${roas >= targetRoas ? '↑' : '↓'}+${(roas - targetRoas).toFixed(1)}` : undefined}
          trendDir={roas >= targetRoas ? 'up' : roas > 0 ? 'down' : 'neutral'} target={`Mục tiêu > ${targetRoas}`}
          checkStatus={roas > 0 ? kpiCheck(roas, targetRoas, false) || undefined : undefined} />
      </div>

      {/* Row: Tasks + Funnel */}
      <div className="dashboard-grid-3-1">
        <TasksCard tasks={tasks} onToggle={toggleTask} moduleMap={moduleMap} roleMap={roleMap} />
        <FunnelCard hasData={hasData} rows={funnelRows} maxFunnel={maxFunnel} closeRate={closeRate} />
      </div>

      {/* Row: Warnings + Ads */}
      <div className="dashboard-grid-2">
        <WarningsCard warnings={warnings} diagnostics={diagnostics} />
        <AdsCard adsRecs={adsRecs} />
      </div>

      {/* Row: Reminders + Weekly */}
      <div className="dashboard-grid-2">
        <RemindersCard reminders={reminders} />
        <WeeklyReviewCard />
      </div>
    </div>
  );
}

