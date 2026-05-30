'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const quickItems = [
  { href: '/', label: 'Tổng quan', icon: '📊' },
  { href: '/tasks', label: 'Tasks', icon: '✅' },
  { href: '/research', label: 'Radar', icon: '📡' },
  { href: '/data-entry', label: 'Nhập liệu', icon: '📝' },
];

const allPages = [
  { href: '/bible/01-RESEARCH', label: 'Research', icon: '🔍' },
  { href: '/bible/02-SOURCING', label: 'Sourcing', icon: '🏭' },
  { href: '/bible/03-OFFER', label: 'Offer', icon: '💰' },
  { href: '/bible/04-CONTENT', label: 'Content', icon: '🎬' },
  { href: '/bible/05-DISTRIBUTION', label: 'Kênh bán', icon: '📢' },
  { href: '/bible/06-SALES', label: 'Sales', icon: '💬' },
  { href: '/bible/07-FULFILLMENT', label: 'Đóng gói', icon: '📦' },
  { href: '/bible/08-RETENTION', label: 'Giữ KH', icon: '🔄' },
  { href: '/bible/09-FINANCE', label: 'Tài chính', icon: '📊' },
  { href: '/bible/10-TEAM', label: 'Team', icon: '👥' },
  { href: '/bible/11-MASTER', label: 'Master Plan', icon: '🗺️' },
  { href: '/content-calendar', label: 'Lịch Content', icon: '📅' },
  { href: '/weekly-review', label: 'Review tuần', icon: '📋' },
  { href: '/sku', label: 'SKU', icon: '🪑' },
  { href: '/stores', label: 'Cửa hàng', icon: '🏪' },
  { href: '/ai-prompts', label: 'AI Prompts', icon: '🤖' },
  { href: '/war-stories', label: 'War Stories', icon: '📒' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  return (
    <>
      {/* Full-screen menu overlay */}
      {showMenu && (
        <div className="mobile-menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="mobile-menu-panel" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span>🌿 Gia Anh Furniture</span>
              <button onClick={() => setShowMenu(false)} className="mobile-menu-close">✕</button>
            </div>
            <div className="mobile-menu-grid">
              {allPages.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-menu-item ${pathname === item.href ? 'active' : ''}`}
                  onClick={() => setShowMenu(false)}
                >
                  <span className="mobile-menu-icon">{item.icon}</span>
                  <span className="mobile-menu-label">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="mobile-bottom-nav">
        <div className="mobile-nav-items">
          {quickItems.map(item => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="mobile-nav-icon">{item.icon}</div>
                <span className="mobile-nav-label">{item.label}</span>
              </Link>
            );
          })}
          <button
            className={`mobile-nav-item ${showMenu ? 'active' : ''}`}
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="mobile-nav-icon">☰</div>
            <span className="mobile-nav-label">Thêm</span>
          </button>
        </div>
      </nav>
    </>
  );
}
