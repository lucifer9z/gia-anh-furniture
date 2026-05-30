'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { DEFAULT_TASKS, ROLES } from '@/lib/bible-data';
import { useStore } from '@/lib/store-context';

interface Task { id: string; date: string; text: string; role: string; time_slot: string; done: boolean; }

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('all');
  const [newText, setNewText] = useState('');
  const [newRole, setNewRole] = useState('leader');
  const [newTime, setNewTime] = useState('morning');
  const supabase = createClient();
  const { activeStoreId, storeFilter } = useStore();
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => { loadTasks(); }, [activeStoreId]);

  async function loadTasks() {
    const q = storeFilter(supabase.from('tasks').select('*').eq('date', today)).order('time_slot');
    const { data } = await q;
    if (data && data.length > 0) setTasks(data);
    else { setTasks([]); await generateDefaultTasks(); }
  }

  async function generateDefaultTasks() {
    const newTasks: any[] = [];
    Object.entries(DEFAULT_TASKS).forEach(([role, items]) => {
      items.forEach(t => newTasks.push({ date: today, text: t.text, role, time_slot: t.time, done: false, ...(activeStoreId ? { store_id: activeStoreId } : {}) }));
    });
    const { data } = await supabase.from('tasks').insert(newTasks).select();
    if (data) setTasks(data);
  }

  async function toggleTask(id: string, done: boolean) {
    await supabase.from('tasks').update({ done: !done }).eq('id', id);
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  async function addTask() {
    if (!newText.trim()) return;
    const { data } = await supabase.from('tasks').insert({ date: today, text: newText, role: newRole, time_slot: newTime, done: false, ...(activeStoreId ? { store_id: activeStoreId } : {}) }).select();
    if (data) { setTasks([...tasks, ...data]); setNewText(''); }
  }

  async function deleteTask(id: string) {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(tasks.filter(t => t.id !== id));
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.role === filter);
  const doneCount = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round(doneCount / tasks.length * 100) : 0;

  const timeLabels: Record<string, string> = { morning: '10:00', afternoon: '14:00', evening: '21:00' };
  const moduleMap: Record<string, { label: string; cls: string }> = {
    morning: { label: 'Vận hành', cls: 'pill-operation' },
    afternoon: { label: 'Content', cls: 'pill-content' },
    evening: { label: 'Dữ liệu', cls: 'pill-data' },
  };

  const roleMap: Record<string, { label: string; cls: string; initial: string }> = {
    leader: { label: 'Leader', cls: 'leader', initial: 'L' },
    ads: { label: 'Ads', cls: 'ads', initial: 'A' },
    media: { label: 'Media', cls: 'media', initial: 'M' },
    sales: { label: 'Sales', cls: 'sales', initial: 'S' },
    fulfillment: { label: 'FF', cls: 'fulfillment', initial: 'F' },
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-title">✅ Task hôm nay</div>
          <div className="page-sub">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{doneCount}/{tasks.length} hoàn thành</span>
          <span className="font-mono" style={{ color: 'var(--accent)', fontSize: 13 }}>{pct}%</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }}></div></div>
      </div>

      {/* Filter + Add */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className={`pill ${filter === 'all' ? 'pill-data' : ''}`} style={{ cursor: 'pointer', padding: '5px 12px' }} onClick={() => setFilter('all')}>Tất cả</span>
        {Object.entries(ROLES).map(([key, role]) => (
          <span key={key} className={`pill ${filter === key ? 'pill-data' : ''}`} style={{ cursor: 'pointer', padding: '5px 12px' }} onClick={() => setFilter(key)}>
            {role.icon} {role.name}
          </span>
        ))}
      </div>

      {/* Add Task */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input className="form-control" style={{ flex: 1, minWidth: 200 }} placeholder="Thêm task mới..." value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} />
          <select className="form-control" style={{ width: 'auto' }} value={newRole} onChange={e => setNewRole(e.target.value)}>
            {Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{r.icon} {r.name}</option>)}
          </select>
          <select className="form-control" style={{ width: 'auto' }} value={newTime} onChange={e => setNewTime(e.target.value)}>
            <option value="morning">☀️ Sáng</option><option value="afternoon">🌤 Chiều</option><option value="evening">🌙 Tối</option>
          </select>
          <button className="btn btn-primary" onClick={addTask}>+ Thêm</button>
        </div>
      </div>

      {/* Task Table */}
      <div className="card">
        <table className="task-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}></th>
              <th>Công việc</th>
              <th>Module</th>
              <th>Owner</th>
              <th>Thời gian</th>
              <th style={{ width: 30 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => {
              const mod = moduleMap[t.time_slot] || { label: t.time_slot, cls: 'pill-data' };
              const role = roleMap[t.role] || { label: t.role, cls: 'leader', initial: '?' };
              return (
                <tr key={t.id}>
                  <td>
                    <div className={`task-check ${t.done ? 'checked' : ''}`} onClick={() => toggleTask(t.id, t.done)}>
                      {t.done && '✓'}
                    </div>
                  </td>
                  <td className={t.done ? 'task-text done' : ''}>{t.text}</td>
                  <td><span className={`pill ${mod.cls}`}>{mod.label}</span></td>
                  <td>
                    <div className="owner-avatar">
                      <div className={`owner-avatar-circle ${role.cls}`}>{role.initial}</div>
                      <span style={{ fontSize: 12 }}>{role.label}</span>
                    </div>
                  </td>
                  <td className="font-mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{timeLabels[t.time_slot] || '—'}</td>
                  <td><span style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }} onClick={() => deleteTask(t.id)}>✕</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
