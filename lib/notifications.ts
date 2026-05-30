// Push notification helper — Browser Web Notification API
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function sendNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon.png',
      badge: '/icon.png',
    });
  }
}

// Schedule reminders based on current time
export function checkReminders(startDate: string | null) {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const day = now.getDay();

  // 08:30 Standup
  if (hour === 8 && minute === 30) {
    sendNotification('📋 Standup sáng!', 'Họp standup 15 phút — báo cáo hôm qua + kế hoạch hôm nay');
  }

  // 21:00 Nhập số liệu
  if (hour === 21 && minute === 0) {
    sendNotification('📊 Nhập số liệu ngày!', 'Đừng quên nhập data FB Ads, Shopee, TikTok, Fulfillment');
  }

  // Saturday 09:00 Weekly Review
  if (day === 6 && hour === 9 && minute === 0) {
    sendNotification('📝 Weekly Review!', 'Thứ 7 — tổng kết tuần, cập nhật Bible, ghi War Story');
  }

  // Decision Gate warning
  if (startDate) {
    const daysPassed = Math.floor((now.getTime() - new Date(startDate).getTime()) / 86400000);
    const gates = [
      { day: 14, name: 'Gate 1 — Cuối tuần 2' },
      { day: 30, name: 'Gate 2 — Cuối tháng 1' },
      { day: 60, name: 'Gate 3 — Cuối tháng 2' },
      { day: 90, name: 'Gate 4 — Cuối tháng 3' },
    ];
    const gate = gates.find(g => g.day - daysPassed <= 3 && g.day - daysPassed >= 0);
    if (gate && hour === 9 && minute === 0) {
      sendNotification(`⚡ ${gate.name}`, `Còn ${gate.day - daysPassed} ngày — kiểm tra KPI ngay!`);
    }
  }
}
