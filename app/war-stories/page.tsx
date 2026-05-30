'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useStore } from '@/lib/store-context';
import { ROLES } from '@/lib/bible-data';

interface Story { id: string; title: string; module: string; author: string; content: string; before_data: string; after_data: string; lesson: string; created_at: string; }

export default function WarStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', module: '01-RESEARCH', author: 'leader', content: '', before_data: '', after_data: '', lesson: '' });
  const supabase = createClient();
  const { activeStoreId, storeFilter } = useStore();

  useEffect(() => { loadStories(); }, [activeStoreId]);

  async function loadStories() {
    const q = storeFilter(supabase.from('war_stories').select('*')).order('created_at', { ascending: false });
    const { data } = await q;
    if (data) setStories(data);
  }

  async function saveStory() {
    if (!form.title.trim() || !form.content.trim()) return;
    await supabase.from('war_stories').insert({ ...form, ...(activeStoreId ? { store_id: activeStoreId } : {}) });
    setForm({ title: '', module: '01-RESEARCH', author: 'leader', content: '', before_data: '', after_data: '', lesson: '' });
    setShowForm(false);
    loadStories();
  }

  return (
    <div className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">📝 War Stories</h1>
          <p className="text-secondary">Kho bài học thực chiến — ghi lại mọi thứ học được</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Ghi War Story</button>
      </div>

      {showForm && (
        <div className="card panel" style={{ marginBottom: 20 }}>
          <div className="form-grid">
            <div className="input-group"><label>Tiêu đề</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="input-group"><label>Module</label>
              <select className="form-control" value={form.module} onChange={e => setForm({ ...form, module: e.target.value })}>
                {['01-RESEARCH','03-OFFER','04-CONTENT','05-DISTRIBUTION','06-SALES','07-OPERATION','08-DATA'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="input-group"><label>Nội dung</label><textarea className="form-control" rows={3} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
          <div className="form-grid">
            <div className="input-group"><label>Trước (số liệu)</label><input className="form-control" placeholder="CPA 35K" value={form.before_data} onChange={e => setForm({ ...form, before_data: e.target.value })} /></div>
            <div className="input-group"><label>Sau (số liệu)</label><input className="form-control" placeholder="CPA 22K" value={form.after_data} onChange={e => setForm({ ...form, after_data: e.target.value })} /></div>
          </div>
          <div className="input-group"><label>Bài học</label><input className="form-control" value={form.lesson} onChange={e => setForm({ ...form, lesson: e.target.value })} /></div>
          <button className="btn btn-primary" onClick={saveStory}>💾 Lưu</button>
        </div>
      )}

      <div className="story-grid">
        {stories.length === 0 && <p className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>Chưa có War Story nào.</p>}
        {stories.map((s, i) => (
          <div className="story-card glass hover-lift" key={s.id}>
            <div className="story-meta">
              <span className="pill" style={{ background: `${ROLES[s.author]?.color || '#a78bfa'}20`, color: ROLES[s.author]?.color || '#a78bfa', border: `1px solid ${ROLES[s.author]?.color || '#a78bfa'}30`, fontSize: 11 }}>
                {ROLES[s.author]?.name || s.author} • {s.module}
              </span>
              <span className="text-muted font-mono" style={{ fontSize: 11 }}>{new Date(s.created_at).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="story-title">#{stories.length - i} — {s.title}</div>
            <div className="story-body">{s.content}</div>
            {s.before_data && (
              <div className="story-data">
                <span className="story-before">{s.before_data}</span><span>→</span><span className="story-after">{s.after_data}</span>
              </div>
            )}
            {s.lesson && <div style={{ fontSize: 12, marginTop: 8 }}>💡 <span className="highlight-data">{s.lesson}</span></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
