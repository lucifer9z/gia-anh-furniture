'use client';

// Markdown to rich HTML renderer — ported from Lite with visual cards
export function mdToHtml(md: string): string {
  const lines = md.split('\n');
  let html = '';
  let inCodeBlock = false;
  let codeContent = '';
  let inList = false;
  let listItems: string[] = [];
  let isOrdered = false;

  const flushList = () => {
    if (listItems.length === 0) return '';
    const cls = isOrdered ? 'md-steps' : 'md-list';
    const result = `<div class="${cls}">${listItems.map((item, i) => {
      if (isOrdered) {
        return `<div class="md-step"><div class="md-step-num">${i + 1}</div><div class="md-step-text">${inlineFormat(item)}</div></div>`;
      }
      return `<div class="md-list-item"><span class="md-bullet"></span><span>${inlineFormat(item)}</span></div>`;
    }).join('')}</div>`;
    listItems = [];
    inList = false;
    return result;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        html += `<div class="md-code-card"><div class="md-code-header"><span class="md-code-dot"></span><span class="md-code-dot"></span><span class="md-code-dot"></span><span class="md-code-label">Terminal</span></div><pre class="md-code-body">${escHtml(codeContent.trim())}</pre></div>`;
        codeContent = '';
        inCodeBlock = false;
      } else {
        html += flushList();
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) { codeContent += line + '\n'; continue; }

    if (line.trim() === '') { html += flushList(); continue; }

    if (line.startsWith('# ')) {
      html += flushList();
      const text = line.slice(2);
      html += `<div class="md-hero"><div class="md-hero-icon">📖</div><h1 class="md-hero-title">${inlineFormat(text)}</h1></div>`;
      continue;
    }

    if (line.startsWith('## ')) {
      html += flushList();
      const text = line.slice(3);
      const icon = getSectionIcon(text);
      html += `<div class="md-section"><div class="md-section-header"><span class="md-section-icon">${icon}</span><h2>${inlineFormat(text)}</h2></div></div>`;
      continue;
    }

    if (line.startsWith('### ')) {
      html += flushList();
      const text = line.slice(4);
      html += `<div class="md-subsection"><h3>${inlineFormat(text)}</h3></div>`;
      continue;
    }

    if (line.startsWith('> ')) {
      html += flushList();
      const text = line.slice(2);
      const isWarning = text.includes('⚠️');
      const type = isWarning ? 'warning' : 'info';
      const icon = isWarning ? '⚠️' : 'ℹ️';
      html += `<div class="md-callout md-callout-${type}"><span class="md-callout-icon">${icon}</span><div class="md-callout-text">${inlineFormat(text)}</div></div>`;
      continue;
    }

    if (line.startsWith('|') && i + 1 < lines.length && lines[i + 1]?.match(/^\|[-|: ]+\|$/)) {
      html += flushList();
      const headers = line.split('|').map(h => h.trim()).filter(Boolean);
      i++;
      const rows: string[][] = [];
      while (i + 1 < lines.length && lines[i + 1]?.startsWith('|')) {
        i++;
        rows.push(lines[i].split('|').map(c => c.trim()).filter(Boolean));
      }
      html += `<div class="md-table-wrap"><table class="styled-table"><thead><tr>${headers.map(h => `<th>${inlineFormat(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${inlineFormat(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      continue;
    }

    const olMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (!inList || !isOrdered) { html += flushList(); inList = true; isOrdered = true; }
      listItems.push(olMatch[2]);
      continue;
    }

    if (line.match(/^- \[[ x]\] /)) {
      html += flushList();
      const checked = line.includes('[x]');
      const text = line.replace(/^- \[[ x]\] /, '');
      html += `<div class="md-check-item ${checked ? 'checked' : ''}"><div class="md-check-box">${checked ? '✓' : ''}</div><span>${inlineFormat(text)}</span></div>`;
      continue;
    }

    if (line.startsWith('- ')) {
      if (!inList || isOrdered) { html += flushList(); inList = true; isOrdered = false; }
      listItems.push(line.slice(2));
      continue;
    }

    html += flushList();
    html += `<p class="md-paragraph">${inlineFormat(line)}</p>`;
  }

  html += flushList();
  return html;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="md-inline-code">$1</code>')
    .replace(/→/g, '<span class="md-arrow">→</span>');
}

function escHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function getSectionIcon(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('research') || t.includes('nghiên cứu') || t.includes('scan')) return '🔍';
  if (t.includes('trụ')) return '🏛️';
  if (t.includes('offer') || t.includes('giá') || t.includes('combo')) return '💰';
  if (t.includes('content') || t.includes('hook') || t.includes('video')) return '🎬';
  if (t.includes('campaign') || t.includes('ads') || t.includes('scale')) return '📢';
  if (t.includes('sales') || t.includes('chốt') || t.includes('flow')) return '💬';
  if (t.includes('kho') || t.includes('ship') || t.includes('giao') || t.includes('sop')) return '📦';
  if (t.includes('kpi') || t.includes('benchmark') || t.includes('phí')) return '📊';
  if (t.includes('timeline') || t.includes('gate') || t.includes('ngày') || t.includes('setup')) return '📅';
  if (t.includes('team') || t.includes('vai') || t.includes('standup')) return '👥';
  if (t.includes('budget') || t.includes('phân bổ')) return '💵';
  if (t.includes('seo') || t.includes('listing')) return '🔎';
  if (t.includes('prompt')) return '🤖';
  if (t.includes('checklist') || t.includes('format') || t.includes('agenda')) return '✅';
  return '📌';
}
