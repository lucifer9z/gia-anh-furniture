// Shared types for Bible Fashion App
export interface DailyData {
  date: string;
  fb_spend: number; fb_inbox: number; fb_orders: number; fb_revenue: number;
  sp_organic: number; sp_paid: number; sp_revenue: number; sp_spend: number;
  tt_views: number; tt_orders: number; tt_revenue: number; tt_followers: number;
  fl_shipped: number; fl_delivered: number; fl_boom: number; fl_return: number;
}

export interface TaskItem {
  id: string; date: string; text: string; role: string; time_slot: string; done: boolean;
}

export interface AdsRec {
  text: string; type: string; icon: string;
}

export interface Diagnostic {
  text: string; action: string; type: string; icon: string;
}

export interface WarningItem {
  text: string; type: string; icon: string;
}

export interface ReminderItem {
  time: string; text: string; status: string;
}
