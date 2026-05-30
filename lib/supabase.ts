// ==========================================
// LOCAL STORAGE DATABASE — No Supabase needed
// Drop-in replacement: same API surface
// ==========================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

class LocalTable {
  constructor(private tableName: string) {}

  private getData(): Row[] {
    try {
      const raw = localStorage.getItem(`db_${this.tableName}`);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private saveData(rows: Row[]) {
    localStorage.setItem(`db_${this.tableName}`, JSON.stringify(rows));
  }

  // SELECT
  select(_columns = '*', _opts?: { count?: string; head?: boolean }) {
    const chain = new QueryChain(this.getData(), this.tableName, this.saveData.bind(this));
    chain._op = 'select';
    return chain;
  }

  // INSERT
  insert(row: Row | Row[]) {
    const rows = Array.isArray(row) ? row : [row];
    const existing = this.getData();
    const newRows = rows.map(r => ({
      ...r,
      id: r.id || crypto.randomUUID(),
      created_at: r.created_at || new Date().toISOString(),
    }));
    this.saveData([...existing, ...newRows]);
    const result = { data: newRows, error: null as any };
    return Object.assign(result, {
      select: () => Promise.resolve(result),
    });
  }

  // UPDATE
  update(updates: Row) {
    const chain = new QueryChain(this.getData(), this.tableName, this.saveData.bind(this));
    chain._op = 'update';
    chain._updates = updates;
    return chain;
  }

  // DELETE
  delete() {
    const chain = new QueryChain(this.getData(), this.tableName, this.saveData.bind(this));
    chain._op = 'delete';
    return chain;
  }

  // UPSERT
  upsert(row: Row | Row[], _opts?: { onConflict?: string }) {
    const rows = Array.isArray(row) ? row : [row];
    const existing = this.getData();
    const result: Row[] = [...existing];

    for (const r of rows) {
      const idx = result.findIndex(e => e.id === r.id);
      if (idx >= 0) {
        result[idx] = { ...result[idx], ...r };
      } else {
        result.push({ ...r, id: r.id || crypto.randomUUID(), created_at: r.created_at || new Date().toISOString() });
      }
    }
    this.saveData(result);
    return { data: rows, error: null as any };
  }
}

class QueryChain {
  _filters: { col: string; op: string; val: unknown }[] = [];
  _orderCol = '';
  _orderAsc = true;
  _limitN = 0;
  _op = 'select';
  _updates: Row = {};
  _data: Row[];
  _table: string;
  _save: (rows: Row[]) => void;

  constructor(data: Row[], table: string, save: (rows: Row[]) => void) {
    this._data = data;
    this._table = table;
    this._save = save;
  }

  eq(col: string, val: unknown) { this._filters.push({ col, op: 'eq', val }); return this; }
  neq(col: string, val: unknown) { this._filters.push({ col, op: 'neq', val }); return this; }
  gt(col: string, val: unknown) { this._filters.push({ col, op: 'gt', val }); return this; }
  gte(col: string, val: unknown) { this._filters.push({ col, op: 'gte', val }); return this; }
  lt(col: string, val: unknown) { this._filters.push({ col, op: 'lt', val }); return this; }
  lte(col: string, val: unknown) { this._filters.push({ col, op: 'lte', val }); return this; }
  ilike(col: string, val: string) { this._filters.push({ col, op: 'ilike', val }); return this; }
  in(col: string, vals: unknown[]) { this._filters.push({ col, op: 'in', val: vals }); return this; }

  order(col: string, opts?: { ascending?: boolean }) {
    this._orderCol = col;
    this._orderAsc = opts?.ascending ?? true;
    return this;
  }

  limit(n: number) { this._limitN = n; return this; }

  single(): { data: any; error: null } {
    const result = this._execute();
    const row = result[0] || null;
    return { data: row, error: null };
  }

  then(resolve: (val: { data: any[] | null; error: null }) => void) {
    if (this._op === 'select') {
      resolve({ data: this._execute(), error: null });
    } else if (this._op === 'delete') {
      const filtered = this._applyFilters();
      const ids = new Set(filtered.map(r => r.id));
      const remaining = this._data.filter(r => !ids.has(r.id));
      this._save(remaining);
      resolve({ data: filtered, error: null });
    } else if (this._op === 'update') {
      const filtered = this._applyFilters();
      const ids = new Set(filtered.map(r => r.id));
      const updated = this._data.map(r =>
        ids.has(r.id) ? { ...r, ...this._updates } : r
      );
      this._save(updated);
      resolve({ data: filtered.map(r => ({ ...r, ...this._updates })), error: null });
    }
  }

  private _applyFilters(): Row[] {
    return this._data.filter(row => {
      return this._filters.every(f => {
        const v = row[f.col];
        switch (f.op) {
          case 'eq': return v === f.val;
          case 'neq': return v !== f.val;
          case 'gt': return (v as number) > (f.val as number);
          case 'gte': return (v as number) >= (f.val as number);
          case 'lt': return (v as number) < (f.val as number);
          case 'lte': return (v as number) <= (f.val as number);
          case 'ilike': return String(v).toLowerCase().includes(String(f.val).replace(/%/g, '').toLowerCase());
          case 'in': return (f.val as unknown[]).includes(v);
          default: return true;
        }
      });
    });
  }

  private _execute(): Row[] {
    let result = this._applyFilters();

    if (this._orderCol) {
      result.sort((a, b) => {
        const va = a[this._orderCol] as string | number;
        const vb = b[this._orderCol] as string | number;
        if (va < vb) return this._orderAsc ? -1 : 1;
        if (va > vb) return this._orderAsc ? 1 : -1;
        return 0;
      });
    }

    if (this._limitN > 0) result = result.slice(0, this._limitN);

    return result;
  }
}

// ==========================================
// MAIN EXPORT — same interface as supabase
// ==========================================
class LocalDB {
  auth = {
    signInWithPassword: async (_creds: { email: string; password: string }) => {
      return { data: { user: { email: _creds.email } }, error: null as any };
    },
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: { email: 'leader@giaanhfurniture.local' } }, error: null }),
    onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
  };

  from(tableName: string) {
    return new LocalTable(tableName);
  }
}

// Singleton
let instance: LocalDB | null = null;

export function createClient() {
  if (!instance) instance = new LocalDB();
  return instance;
}
