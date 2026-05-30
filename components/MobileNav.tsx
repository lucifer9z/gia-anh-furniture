'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Tổng quan', icon: '📊' },
  { href: '/tasks', label: 'Tasks', icon: '✅', badge: true },
  { href: '/data-entry', label: 'Nhập liệu', icon: '📝' },
  { href: '/research', label: 'Radar', icon: '📡' },
  { href: '/more', label: 'Thêm', icon: '☰' },
];

export default function MobileNav() {
  const pathname = usePathname();

  // Close sidebar on overlay click
  useEffect(() => {
    const overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) return;
    const handler = () => {
      document.querySelector('.sidebar')?.classList.remove('mobile-open');
      overlay.classList.remove('open');
    };
    overlay.addEventListener('click', handler);
    return () => overlay.removeEventListener('click', handler);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    document.querySelector('.sidebar')?.classList.remove('mobile-open');
    document.querySelector('.sidebar-overlay')?.classList.remove('open');
  }, [pathname]);

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-nav-items">
        {navItems.map(item => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href === '/more' ? '#' : item.href}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={item.href === '/more' ? (e) => {
                e.preventDefault();
                // Toggle sidebar
                document.querySelector('.sidebar')?.classList.toggle('mobile-open');
                document.querySelector('.sidebar-overlay')?.classList.toggle('open');
              } : undefined}
            >
              <div className="mobile-nav-icon">{item.icon}</div>
              <span className="mobile-nav-label">{item.label}</span>
              {item.badge && <span className="mobile-nav-badge">!</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
