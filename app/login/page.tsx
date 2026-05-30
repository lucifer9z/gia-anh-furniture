'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  }

  const accounts = [
    { email: 'leader@giaanhfurniture.local', role: '👑 Leader' },
    { email: 'ads@giaanhfurniture.local', role: '📢 Ads' },
    { email: 'media@giaanhfurniture.local', role: '🎬 Media' },
    { email: 'san@giaanhfurniture.local', role: '💬 Sàn' },
    { email: 'fulfillment@giaanhfurniture.local', role: '📦 Fulfillment' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20 }}>
      <div className="card" style={{ padding: 40, maxWidth: 420, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📖</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, #6b8f5e, #8fb87e, #a5cc95)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Gia Anh Furniture</h1>
          <p className="text-muted" style={{ fontSize: 13 }}>Hệ thống quản lý bán hàng</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input className="form-control" type="email" placeholder="leader@giaanhfurniture.local" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input className="form-control" type="password" placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? '⏳ Đang đăng nhập...' : '🔐 Đăng nhập'}
          </button>
        </form>

        <div style={{ marginTop: 24, borderTop: '1px solid var(--glass-border)', paddingTop: 20 }}>
          <p className="text-muted" style={{ fontSize: 11, marginBottom: 10, textAlign: 'center' }}>5 tài khoản team:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {accounts.map(a => (
              <div key={a.email} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', padding: '4px 0' }}>
                <span>{a.role}</span>
                <span className="font-mono" style={{ cursor: 'pointer', color: 'var(--accent)' }} onClick={() => setEmail(a.email)}>{a.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
