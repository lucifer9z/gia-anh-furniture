'use client';
import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import MobileNav from '@/components/MobileNav';
import { StoreProvider } from '@/lib/store-context';
import { SeedData } from '@/lib/seed-data';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <SeedData />
      <div className="app-layout">
        <div className="sidebar-overlay"></div>
        <Sidebar />
        <div className="content-area">
          <Topbar />
          <main className="main-content">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </StoreProvider>
  );
}
