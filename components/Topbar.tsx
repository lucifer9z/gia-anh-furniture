'use client';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store-context';
import Link from 'next/link';

export default function Topbar() {
  const { stores, activeStoreId, activeStore, setActiveStoreId } = useStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const dayNames = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
  const dateStr = `${dayNames[now.getDay()]}, ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function toggleSidebar() {
    document.querySelector('.sidebar')?.classList.toggle('mobile-open');
    document.querySelector('.sidebar-overlay')?.classList.toggle('open');
  }

  return (
    <div className="topbar">
      <button className="mobile-topbar-btn" onClick={toggleSidebar}>☰</button>
      <input className="topbar-search" placeholder="Tìm nhanh... (⌘K)" />

      <div className="topbar-right">
        <div className="topbar-date"><span>📅</span> {dateStr}</div>

        {/* Store Selector */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <div className="topbar-filter" onClick={() => setShowDropdown(!showDropdown)}>
            {activeStore ? `${activeStore.icon} ${activeStore.name}` : '🏪 Tất cả cửa hàng'}
            <span style={{ fontSize: 10 }}>▾</span>
          </div>

          {showDropdown && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 6,
              width: 240, background: 'var(--bg-sidebar)', border: '1px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-dropdown)',
              zIndex: 500, overflow: 'hidden'
            }}>
              {/* All stores */}
              <div
                onClick={() => { setActiveStoreId(null); setShowDropdown(false); }}
                style={{
                  padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 13, color: !activeStoreId ? 'var(--accent)' : 'var(--text-secondary)',
                  background: !activeStoreId ? 'var(--accent-soft)' : 'transparent',
                  borderBottom: '1px solid var(--bg-card-border)',
                  transition: 'background 0.15s'
                }}
              >
                <span>🏪</span>
                <span style={{ fontWeight: !activeStoreId ? 700 : 500 }}>Tất cả cửa hàng</span>
                {!activeStoreId && <span style={{ marginLeft: 'auto', fontSize: 11 }}>✓</span>}
              </div>

              {/* Each store */}
              {stores.map(store => (
                <div
                  key={store.id}
                  onClick={() => { setActiveStoreId(store.id); setShowDropdown(false); }}
                  style={{
                    padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 13, color: activeStoreId === store.id ? 'var(--accent)' : 'var(--text-secondary)',
                    background: activeStoreId === store.id ? 'var(--accent-soft)' : 'transparent',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = activeStoreId === store.id ? 'var(--accent-soft)' : 'var(--bg-card-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = activeStoreId === store.id ? 'var(--accent-soft)' : 'transparent')}
                >
                  <span>{store.icon}</span>
                  <span style={{ fontWeight: activeStoreId === store.id ? 700 : 500 }}>{store.name}</span>
                  {activeStoreId === store.id && <span style={{ marginLeft: 'auto', fontSize: 11 }}>✓</span>}
                </div>
              ))}

              {/* Add store */}
              <Link
                href="/stores"
                onClick={() => setShowDropdown(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  fontSize: 13, color: 'var(--accent)', textDecoration: 'none',
                  borderTop: '1px solid var(--bg-card-border)',
                }}
              >
                <span>✚</span>
                <span>Quản lý cửa hàng</span>
              </Link>
            </div>
          )}
        </div>

        <div className="topbar-bell">🔔<div className="topbar-bell-dot"></div></div>

        <div className="topbar-user">
          <div className="topbar-avatar">C</div>
          <div className="topbar-user-info">
            <div className="topbar-user-name">Công</div>
            <div className="topbar-user-role">Leader</div>
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>▾</span>
        </div>
      </div>
    </div>
  );
}
