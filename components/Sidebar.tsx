'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BIBLE_MODULES } from '@/lib/bible-data';

const navSections = [
  {
    label: null,
    items: [
      { href: '/', label: 'Tổng quan', icon: '📊' },
    ],
  },
  {
    label: 'BÁN HÀNG',
    items: [
      { href: '/research', label: 'Radar', icon: '📡' },
      { href: '/bible/02-SOURCING', label: 'Sourcing', icon: '🏭' },
      { href: '/bible/03-OFFER', label: 'Offer', icon: '💰' },
      { href: '/bible/04-CONTENT', label: 'Content', icon: '🎬' },
      { href: '/bible/05-DISTRIBUTION', label: 'Kênh bán', icon: '📢' },
      { href: '/bible/06-SALES', label: 'Sales', icon: '💬' },
    ],
  },
  {
    label: 'VẬN HÀNH',
    items: [
      { href: '/bible/07-FULFILLMENT', label: 'Đóng gói & Ship', icon: '📦' },
      { href: '/bible/08-RETENTION', label: 'Giữ chân KH', icon: '🔄' },
      { href: '/bible/09-FINANCE', label: 'Tài chính', icon: '📊' },
      { href: '/bible/10-TEAM', label: 'Team', icon: '👥' },
      { href: '/bible/11-MASTER', label: 'Master Plan', icon: '🗺️' },
    ],
  },
  {
    label: 'CÔNG CỤ',
    items: [
      { href: '/tasks', label: 'Task hôm nay', icon: '✅', badge: true },
      { href: '/data-entry', label: 'Nhập số liệu', icon: '📝' },
      { href: '/content-calendar', label: 'Lịch Content', icon: '📅' },
      { href: '/weekly-review', label: 'Review tuần', icon: '📋' },
      { href: '/sku', label: 'SKU', icon: '🪑' },
      { href: '/stores', label: 'Cửa hàng', icon: '🏪' },
      { href: '/ai-prompts', label: 'AI Prompts', icon: '🤖' },
      { href: '/war-stories', label: 'War Stories', icon: '📒' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🌿</div>
        <span>Gia Anh Furniture</span>
      </div>

      <div className="sidebar-search">
        <span>🔍</span>
        <span>Tìm nhanh...</span>
        <kbd>⌘K</kbd>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto' }}>
        {navSections.map((section, si) => (
          <div className="nav-group" key={si}>
            {section.label && (
              <div className="nav-group-label">{section.label}</div>
            )}
            {section.items.map(item => {
              const isActive = pathname === item.href ||
                (item.href.startsWith('/bible/') && pathname === item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {'badge' in item && item.badge && <span className="nav-badge">19</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-collapse-btn">
          <span>←</span>
          <span>Thu gọn</span>
        </button>
      </div>
    </aside>
  );
}
