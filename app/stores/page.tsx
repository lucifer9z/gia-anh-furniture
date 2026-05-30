'use client';
import { useState } from 'react';
import { useStore, Store } from '@/lib/store-context';
import { createClient } from '@/lib/supabase';

const STORE_ICONS = ['🏪','👔','👟','👗','🧢','👜','🕶️','⌚','🎒','💼','🛍️','🧥'];

export default function StoresPage() {
  const { stores, refreshStores, setActiveStoreId } = useStore();
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('🏪');
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const supabase = createClient();

  async function addStore() {
    if (!newName.trim()) return;
    await supabase.from('stores').insert({ name: newName.trim(), icon: newIcon });
    setNewName('');
    setNewIcon('🏪');
    refreshStores();
  }

  async function updateStore(id: string) {
    await supabase.from('stores').update({ name: editName, icon: editIcon }).eq('id', id);
    setEditing(null);
    refreshStores();
  }

  async function deleteStore(id: string) {
    if (!confirm('Xóa cửa hàng này? Data liên quan sẽ mất store_id.')) return;
    await supabase.from('stores').delete().eq('id', id);
    setActiveStoreId(null);
    refreshStores();
  }

  function startEdit(store: Store) {
    setEditing(store.id);
    setEditName(store.name);
    setEditIcon(store.icon);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🏪 Quản lý cửa hàng</div>
        <div className="page-sub">Mỗi cửa hàng có data, tasks, SKU riêng biệt</div>
      </div>

      {/* Add new store */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">✚ Thêm cửa hàng mới</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Icon picker */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {STORE_ICONS.map(icon => (
              <div
                key={icon}
                onClick={() => setNewIcon(icon)}
                style={{
                  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 8, cursor: 'pointer', fontSize: 18,
                  border: newIcon === icon ? '2px solid var(--accent)' : '1px solid var(--bg-card-border)',
                  background: newIcon === icon ? 'var(--accent-soft)' : 'transparent'
                }}
              >{icon}</div>
            ))}
          </div>
          <input
            className="form-control"
            style={{ flex: 1, minWidth: 200 }}
            placeholder="Tên cửa hàng (VD: Gia Anh Furniture HCM)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addStore()}
          />
          <button className="btn btn-primary" onClick={addStore}>+ Thêm</button>
        </div>
      </div>

      {/* Store list */}
      <div className="card">
        <div className="card-title">📋 Danh sách cửa hàng ({stores.length})</div>
        {stores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>Chưa có cửa hàng nào</div>
        ) : (
          stores.map(store => (
            <div key={store.id} className="warning-item" style={{ alignItems: 'center' }}>
              {editing === store.id ? (
                <>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {STORE_ICONS.slice(0, 6).map(icon => (
                      <div key={icon} onClick={() => setEditIcon(icon)}
                        style={{
                          width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: 6, cursor: 'pointer', fontSize: 14,
                          border: editIcon === icon ? '2px solid var(--accent)' : '1px solid var(--bg-card-border)',
                        }}
                      >{icon}</div>
                    ))}
                  </div>
                  <input className="form-control" style={{ flex: 1 }} value={editName} onChange={e => setEditName(e.target.value)} />
                  <button className="btn btn-primary btn-sm" onClick={() => updateStore(store.id)}>Lưu</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>Hủy</button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 28, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-soft)', borderRadius: 'var(--radius-md)' }}>{store.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{store.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: {store.id.slice(0, 8)}...</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => startEdit(store)}>✏️ Sửa</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => deleteStore(store.id)}>🗑</button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
