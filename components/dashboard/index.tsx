import Link from 'next/link';

interface KPICardProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  trend?: string;
  trendDir?: 'up' | 'down' | 'neutral';
  target?: string;
  checkStatus?: string;
}

export function KPICard({ icon, iconColor, label, value, trend, trendDir = 'neutral', target, checkStatus }: KPICardProps) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <div className={`kpi-icon ${iconColor}`}>{icon}</div>
        {checkStatus && <div className={`kpi-check ${checkStatus}`}>{checkStatus === 'ok' ? '✓' : '!'}</div>}
      </div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {trend && <div className={`kpi-trend ${trendDir}`}>{trend}</div>}
      {target && <div className="kpi-target">{target}</div>}
    </div>
  );
}

interface FunnelProps {
  hasData: boolean;
  rows: { label: string; value: number; pct: number; color: string }[];
  maxFunnel: number;
  closeRate: string;
}

export function FunnelCard({ hasData, rows, maxFunnel, closeRate }: FunnelProps) {
  return (
    <div className="card">
      <div className="card-title">📊 Phễu bán hàng</div>
      {!hasData ? (
        <div className="text-muted" style={{ textAlign: 'center', padding: 30 }}>Nhập số liệu để xem phễu</div>
      ) : (
        <>
          {rows.map((row, i) => (
            <div className="funnel-row" key={i}>
              <span className="funnel-label">{row.label}</span>
              <span className="funnel-value">{row.value > 999 ? `${(row.value / 1000).toFixed(1)}K` : row.value}</span>
              <div className="funnel-bar-wrap">
                <div className={`funnel-bar ${row.color}`} style={{ width: `${Math.max(3, i === 0 ? 100 : Math.min(100, row.value / maxFunnel * 100))}%` }}></div>
              </div>
              <span className="funnel-pct">{row.pct.toFixed(row.pct < 1 ? 2 : row.pct >= 100 ? 0 : 2)}%</span>
            </div>
          ))}
          <div className="funnel-note">
            ✅ Tỷ lệ chốt {closeRate}% {parseFloat(closeRate) >= 15 ? '— đang ổn định.' : '— cần cải thiện.'}
          </div>
        </>
      )}
    </div>
  );
}

interface WarningsProps {
  warnings: { text: string; type: string; icon: string }[];
  diagnostics: { text: string; action: string; type: string; icon: string }[];
}

export function WarningsCard({ warnings, diagnostics }: WarningsProps) {
  return (
    <div className="card">
      <div className="card-title">⚠️ Cảnh báo vận hành</div>
      {warnings.length === 0 && diagnostics.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20, color: 'var(--green)', fontSize: 13 }}>✅ Không có cảnh báo — mọi thứ ổn!</div>
      ) : (
        <>
          {warnings.map((w, i) => (
            <div className="warning-item" key={`w-${i}`}>
              <div className={`warning-icon ${w.type}`}>{w.icon}</div>
              <div className="warning-text">{w.text}</div>
              <div className="warning-arrow">›</div>
            </div>
          ))}
          {diagnostics.length > 0 && (
            <div style={{ borderTop: '1px solid var(--bg-card-border)', marginTop: 8, paddingTop: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>🔍 Chẩn đoán nghẽn</div>
              {diagnostics.map((d, i) => (
                <div className="warning-item" key={`d-${i}`}>
                  <div className={`warning-icon ${d.type}`}>{d.icon}</div>
                  <div className="warning-text">
                    <div>{d.text}</div>
                    <div style={{ color: d.type === 'red' ? 'var(--red)' : 'var(--yellow)', fontWeight: 600, fontSize: 12, marginTop: 2 }}>{d.action}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface AdsProps {
  adsRecs: { text: string; type: string; icon: string }[];
}

export function AdsCard({ adsRecs }: AdsProps) {
  return (
    <div className="card">
      <div className="card-title">📢 Gợi ý Ads</div>
      {adsRecs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>Nhập số liệu FB Ads để nhận gợi ý</div>
      ) : (
        adsRecs.map((r, i) => (
          <div className="warning-item" key={`a-${i}`}>
            <div className={`warning-icon ${r.type}`} style={r.type === 'green' ? { background: 'var(--green-bg)' } : r.type === 'blue' ? { background: 'var(--blue-bg)' } : undefined}>{r.icon}</div>
            <div className="warning-text" style={{ color: r.type === 'green' ? 'var(--green)' : r.type === 'red' ? 'var(--red)' : undefined, fontWeight: 600 }}>{r.text}</div>
          </div>
        ))
      )}
    </div>
  );
}

interface TasksProps {
  tasks: { id: string; text: string; role: string; time_slot: string; done: boolean }[];
  onToggle: (id: string, done: boolean) => void;
  moduleMap: Record<string, { label: string; cls: string }>;
  roleMap: Record<string, { label: string; cls: string }>;
}

export function TasksCard({ tasks, onToggle, moduleMap, roleMap }: TasksProps) {
  const timeMap: Record<string, string> = { morning: '10:00', afternoon: '14:00', evening: '21:00' };
  return (
    <div className="card">
      <div className="card-title">
        <span>🗓 Hôm nay cần làm gì?</span>
        <Link href="/tasks" className="card-title-link">Xem tất cả →</Link>
      </div>
      <table className="task-table">
        <thead>
          <tr>
            <th style={{ width: 30 }}></th>
            <th>Công việc</th>
            <th>Module</th>
            <th>Owner</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Chưa có task. <Link href="/tasks" style={{ color: 'var(--accent)' }}>Tạo task →</Link></td></tr>
          )}
          {tasks.map(t => {
            const mod = moduleMap[t.time_slot] || { label: t.time_slot, cls: 'pill-data' };
            const role = roleMap[t.role] || { label: t.role, cls: 'leader' };
            return (
              <tr key={t.id}>
                <td>
                  <div className={`task-check ${t.done ? 'checked' : ''}`} onClick={() => onToggle(t.id, t.done)}>
                    {t.done && '✓'}
                  </div>
                </td>
                <td className={t.done ? 'task-text done' : ''}>{t.text}</td>
                <td><span className={`pill ${mod.cls}`}>{mod.label}</span></td>
                <td>
                  <div className="owner-avatar">
                    <div className={`owner-avatar-circle ${role.cls}`}>{role.label[0]}</div>
                    <span style={{ fontSize: 12 }}>{role.label}</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{timeMap[t.time_slot] || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface RemindersProps {
  reminders: { time: string; text: string; status: string }[];
}

export function RemindersCard({ reminders }: RemindersProps) {
  return (
    <div className="card">
      <div className="card-title">🔔 Nhắc việc</div>
      {reminders.map((r, i) => (
        <div className="reminder-item" key={i}>
          <span className="reminder-time">{r.time}</span>
          <span className={`reminder-dot ${r.status}`}></span>
          <span className="reminder-text">{r.text}</span>
          <span className="warning-arrow">›</span>
        </div>
      ))}
    </div>
  );
}

export function WeeklyReviewCard() {
  return (
    <div className="card">
      <div className="card-title">📋 Review tuần</div>
      <Link href="/weekly-review" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--accent-soft)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s' }}>
          <div style={{ fontSize: 28 }}>📊</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, color: 'var(--text-primary)' }}>Xem báo cáo tuần</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tổng hợp 7 ngày: đơn, doanh thu, CPA, ROAS, P&L</div>
          </div>
          <div style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: 18 }}>→</div>
        </div>
      </Link>
    </div>
  );
}

// Loading skeleton
export function DashboardSkeleton() {
  return (
    <div style={{ padding: 20, opacity: 0.5 }}>
      <div className="page-header"><div className="page-greeting">Đang tải... ⏳</div></div>
      <div className="kpi-grid">
        {[1,2,3,4].map(i => (
          <div className="kpi-card" key={i}>
            <div className="kpi-label" style={{ background: 'var(--bg-card-border)', height: 14, width: '60%', borderRadius: 4, animation: 'pulse 1.5s infinite' }}></div>
            <div className="kpi-value" style={{ background: 'var(--bg-card-border)', height: 28, width: '40%', borderRadius: 4, marginTop: 8, animation: 'pulse 1.5s infinite' }}></div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid-2" style={{ marginTop: 16 }}>
        {[1,2].map(i => (
          <div className="card" key={i} style={{ minHeight: 120 }}>
            <div style={{ background: 'var(--bg-card-border)', height: 16, width: '40%', borderRadius: 4, animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ background: 'var(--bg-card-border)', height: 12, width: '80%', borderRadius: 4, marginTop: 12, animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ background: 'var(--bg-card-border)', height: 12, width: '60%', borderRadius: 4, marginTop: 8, animation: 'pulse 1.5s infinite' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
