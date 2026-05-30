'use client';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';

const db = createClient();

// Seed default store if empty
export function SeedData() {
  useEffect(() => {
    const seed = async () => {
      const { data: stores } = await db.from('stores').select('*');
      if (!stores || stores.length === 0) {
        db.from('stores').insert({
          id: 'default-store',
          name: 'Gia Anh Furniture',
          icon: '🏡',
          color: '#6b8f5e',
        });
        db.from('settings').insert([
          { key: 'project_name', value: 'Gia Anh Furniture' },
        ]);
      }
    };
    seed();
  }, []);

  return null;
}
