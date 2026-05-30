'use client';
import { useState } from 'react';
import { AI_PROMPTS, BIBLE_MODULES } from '@/lib/bible-data';

export default function AiPromptsPage() {
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const filtered = search
    ? AI_PROMPTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.prompt.toLowerCase().includes(search.toLowerCase()))
    : AI_PROMPTS;

  const byModule: Record<string, typeof AI_PROMPTS> = {};
  filtered.forEach(p => { if (!byModule[p.module]) byModule[p.module] = []; byModule[p.module].push(p); });

  function copyPrompt(idx: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">🤖 AI Prompts</h1>
        <p className="text-secondary">12 prompt thực chiến — copy paste vào ChatGPT/Gemini</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input className="form-control" placeholder="🔍 Tìm prompt..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {Object.entries(byModule).map(([mod, prompts]) => (
        <div key={mod} style={{ marginBottom: 24 }}>
          <div className="prompt-group-title">{BIBLE_MODULES[mod]?.icon} {BIBLE_MODULES[mod]?.name || mod}</div>
          {prompts.map((p, i) => {
            const globalIdx = AI_PROMPTS.indexOf(p);
            return (
              <div className="accordion" key={globalIdx}>
                <div className="accordion-header" onClick={() => setOpenIdx(openIdx === globalIdx ? null : globalIdx)}>
                  <span style={{ fontWeight: 500 }}>{p.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{openIdx === globalIdx ? '▲' : '▼'}</span>
                </div>
                {openIdx === globalIdx && (
                  <div className="accordion-body open" style={{ position: 'relative' }}>
                    <button className="copy-btn" onClick={() => copyPrompt(globalIdx, p.prompt)}>
                      {copied === globalIdx ? '✅ Copied!' : '📋 Copy'}
                    </button>
                    <pre className="prompt-text">{p.prompt}</pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
