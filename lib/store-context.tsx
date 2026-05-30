'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase';

export interface Store {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface StoreContextType {
  stores: Store[];
  activeStoreId: string | null; // null = all stores
  activeStore: Store | null;
  setActiveStoreId: (id: string | null) => void;
  refreshStores: () => void;
  // Helper: build query filter
  storeFilter: (query: any) => any;
}

const StoreContext = createContext<StoreContextType>({
  stores: [],
  activeStoreId: null,
  activeStore: null,
  setActiveStoreId: () => {},
  refreshStores: () => {},
  storeFilter: (q) => q,
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [activeStoreId, setActiveStoreIdState] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadStores();
    // Restore from localStorage
    const saved = localStorage.getItem('bf_active_store');
    if (saved && saved !== 'null') setActiveStoreIdState(saved);
  }, []);

  async function loadStores() {
    const { data } = await supabase.from('stores').select('*').order('created_at');
    if (data) setStores(data);
  }

  function setActiveStoreId(id: string | null) {
    setActiveStoreIdState(id);
    localStorage.setItem('bf_active_store', id || 'null');
  }

  const activeStore = stores.find(s => s.id === activeStoreId) || null;

  // Helper: apply store filter to any Supabase query
  function storeFilter(query: any) {
    if (activeStoreId) {
      return query.eq('store_id', activeStoreId);
    }
    return query;
  }

  return (
    <StoreContext.Provider value={{ stores, activeStoreId, activeStore, setActiveStoreId, refreshStores: loadStores, storeFilter }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
