import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = await createServerSupabaseClient();

  // Get last 7 days data
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  const { data: thisWeek } = await supabase
    .from('daily_data')
    .select('*')
    .in('date', dates);

  // Get previous week data
  const prevDates: string[] = [];
  for (let i = 13; i >= 7; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    prevDates.push(d.toISOString().slice(0, 10));
  }

  const { data: prevWeek } = await supabase
    .from('daily_data')
    .select('*')
    .in('date', prevDates);

  const sum = (arr: any[], key: string) => arr.reduce((s, r) => s + (r[key] || 0), 0);

  const thisData = thisWeek || [];
  const prevData = prevWeek || [];

  const report = {
    period: `${dates[0]} → ${dates[6]}`,
    this_week: {
      total_orders: sum(thisData, 'fb_orders') + sum(thisData, 'sp_organic') + sum(thisData, 'sp_paid') + sum(thisData, 'tt_orders'),
      total_revenue: sum(thisData, 'fb_revenue') + sum(thisData, 'sp_revenue') + sum(thisData, 'tt_revenue'),
      total_spend: sum(thisData, 'fb_spend') + sum(thisData, 'sp_spend'),
      avg_cpa: sum(thisData, 'fb_orders') > 0 ? Math.round(sum(thisData, 'fb_spend') / sum(thisData, 'fb_orders')) : 0,
      avg_roas: sum(thisData, 'fb_spend') + sum(thisData, 'sp_spend') > 0
        ? ((sum(thisData, 'fb_revenue') + sum(thisData, 'sp_revenue') + sum(thisData, 'tt_revenue')) / (sum(thisData, 'fb_spend') + sum(thisData, 'sp_spend'))).toFixed(1)
        : '0',
      delivery_rate: sum(thisData, 'fl_shipped') > 0 ? Math.round(sum(thisData, 'fl_delivered') / sum(thisData, 'fl_shipped') * 100) : 0,
      boom_rate: sum(thisData, 'fl_shipped') > 0 ? Math.round(sum(thisData, 'fl_boom') / sum(thisData, 'fl_shipped') * 100) : 0,
    },
    prev_week: {
      total_orders: sum(prevData, 'fb_orders') + sum(prevData, 'sp_organic') + sum(prevData, 'sp_paid') + sum(prevData, 'tt_orders'),
      total_revenue: sum(prevData, 'fb_revenue') + sum(prevData, 'sp_revenue') + sum(prevData, 'tt_revenue'),
    },
    change: {
      orders_pct: 0,
      revenue_pct: 0,
    }
  };

  const prevOrders = report.prev_week.total_orders;
  if (prevOrders > 0) report.change.orders_pct = Math.round((report.this_week.total_orders - prevOrders) / prevOrders * 100);
  const prevRevenue = report.prev_week.total_revenue;
  if (prevRevenue > 0) report.change.revenue_pct = Math.round((report.this_week.total_revenue - prevRevenue) / prevRevenue * 100);

  return NextResponse.json(report);
}
