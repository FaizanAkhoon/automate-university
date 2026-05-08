import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, Users, FileText, Heart, LogOut,
  TrendingUp, BookOpen, Trash2, ChevronDown, ChevronUp,
  Activity, Moon, Droplets, Dumbbell, Shield, Mail, Send, AlertTriangle, MapPin
} from 'lucide-react';
import './index.css';

const API = 'http://localhost:5000';

const MOODS = { 1: '😞', 2: '😐', 3: '🙂', 4: '😊', 5: '🤩' };

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [pw, setPw] = useState('admin121');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Reset Password State
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/admin/login`, { password: pw });
      if (res.data.success) onLogin();
    } catch {
      setErr('Invalid password. Try: admin121');
    }
    setLoading(false);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for reset link
    setTimeout(() => {
      setLoading(false);
      setResetSent(true);
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)',
      backgroundImage: 'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(108,99,255,0.08) 0%, transparent 70%)',
    }}>
      <div className="card" style={{ width: 380, padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* RESET PASSWORD VIEW */}
        {isResetMode ? (
          <div style={{ animation: 'fade-in 0.4s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 1rem',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(236,72,153,0.4)',
              }}>
                <Shield size={26} color="white" />
              </div>
              <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>
                Reset Password
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                Secure Admin Verification
              </p>
            </div>

            {resetSent ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <p style={{ color: '#10b981', fontWeight: 600, marginBottom: 8 }}>✅ Reset Link Sent!</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                  A secure password reset link has been dispatched to the superadmin's email.
                </p>
                <button type="button" onClick={() => { setIsResetMode(false); setResetSent(false); }} className="btn" style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset}>
                <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>
                  Superadmin Email Address
                </label>
                <input
                  className="input"
                  type="email"
                  placeholder="admin@university.edu"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  style={{ marginBottom: '1.5rem' }}
                  required
                />
                <button type="submit" className="btn" style={{ width: '100%', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', marginBottom: '1rem' }} disabled={loading}>
                  {loading ? 'Verifying...' : 'Send Reset Link'}
                </button>
                <button type="button" onClick={() => setIsResetMode(false)} style={{ width: '100%', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', cursor: 'pointer' }}>
                  ← Back to Login
                </button>
              </form>
            )}
          </div>
        ) : (
        /* NORMAL LOGIN VIEW */
          <div style={{ animation: 'fade-in 0.4s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 1rem',
                background: 'linear-gradient(135deg,#6c63ff,#a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(108,99,255,0.4)',
              }}>
                <Shield size={26} color="white" />
              </div>
              <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>
                Admin Portal
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                Student Portal Management
              </p>
            </div>
            
            <form onSubmit={submit}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  Admin Password
                </label>
                <button type="button" onClick={() => setIsResetMode(true)} style={{ background: 'transparent', border: 'none', color: '#a855f7', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500 }}>
                  Forgot Password?
                </button>
              </div>
              
              <input
                className="input"
                type="password"
                placeholder="Enter password..."
                value={pw}
                onChange={e => { setPw(e.target.value); setErr(''); }}
                style={{ marginBottom: '1rem' }}
              />
              {err && <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{err}</p>}
              <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
              Default password: <code style={{ color: '#a855f7' }}>admin121</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 500, marginBottom: 8 }}>{label}</p>
          <p style={{ color, fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: 4 }}>{sub}</p>}
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: `${color}18`,
          border: `1px solid ${color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD TAB ────────────────────────────────────────────────────────────
function DashboardTab({ stats }) {
  if (!stats) return <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p>;
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents} color="#6c63ff" sub="Registered" />
        <StatCard icon={FileText} label="Notes Saved" value={stats.totalNotes} color="#a855f7" sub="All time" />
        <StatCard icon={Heart} label="Health Logs" value={stats.totalHealthLogs} color="#ec4899" sub="Entries" />
        <StatCard icon={Activity} label="System" value="Live" color="#00f5d4" sub="All services up" />
      </div>

      {/* Recent notes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>Recent Notes</h3>
          {stats.recentNotes.length === 0
            ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No notes yet</p>
            : stats.recentNotes.map(n => (
              <div key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>{n.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
                  {new Date(n.createdAt).toLocaleDateString()} · {n.bullets.length} bullets
                </p>
              </div>
            ))
          }
        </div>

        {/* Recent health */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>Recent Health Logs</h3>
          {stats.recentHealth.length === 0
            ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No health data yet</p>
            : stats.recentHealth.map(h => (
              <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.6rem', marginBottom: '0.6rem' }}>
                <span style={{ color: 'white', fontSize: '0.85rem' }}>{h.date}</span>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem' }}>
                  <span style={{ color: '#3b82f6' }}>💧{h.water}</span>
                  <span style={{ color: '#8b5cf6' }}>😴{h.sleep}h</span>
                  <span>{MOODS[h.mood] || '?'}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ─── STUDENTS TAB ─────────────────────────────────────────────────────────────
function StudentsTab({ students }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>
        Students ({students.length})
      </h2>
      {students.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
          <Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>No student profiles yet</p>
        </div>
      ) : students.map(s => (
        <div key={s.id} className="card" style={{ padding: '1.25rem', marginBottom: '0.75rem' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
            onClick={() => setExpanded(expanded === s.id ? null : s.id)}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg,#6c63ff,#a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: 'white', fontSize: '1rem', flexShrink: 0,
            }}>
              {s.avatar || (s.name ? s.name[0] : '?')}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: 600 }}>{s.name || 'Unnamed Student'}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                {s.grade || 'No grade'} · GPA: {s.gpa || 'N/A'}
              </p>
            </div>
            {expanded === s.id ? <ChevronUp size={16} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.4)" />}
          </div>
          {expanded === s.id && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {[
                  ['Email', s.email || 'Not set'],
                  ['Grade', s.grade || 'Not set'],
                  ['GPA', s.gpa || 'Not set'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{k}</p>
                    <p style={{ color: 'white', fontSize: '0.875rem' }}>{v}</p>
                  </div>
                ))}
              </div>
              {s.subjects?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {s.subjects.map(sub => (
                    <span key={sub} style={{
                      background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.25)',
                      borderRadius: 6, padding: '2px 10px', fontSize: '0.75rem', color: '#a88dff',
                    }}>{sub}</span>
                  ))}
                </div>
              )}
              {s.bio && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.825rem', fontStyle: 'italic' }}>"{s.bio}"</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── NOTES TAB ────────────────────────────────────────────────────────────────
function NotesTab() {
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/admin/notes`).then(r => { setNotes(r.data); setLoaded(true); });
  }, []);

  const del = async (id) => {
    await axios.delete(`${API}/api/admin/notes/${id}`);
    setNotes(n => n.filter(x => x.id !== id));
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>
        All Notes ({notes.length})
      </h2>
      {!loaded ? <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
        : notes.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
            <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>No notes saved yet</p>
          </div>
        ) : notes.map(n => (
          <div key={n.id} className="card" style={{ padding: '1.25rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontWeight: 600, marginBottom: 4 }}>{n.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                  {new Date(n.createdAt).toLocaleString()} · {n.bullets.length} bullets
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {n.bullets.slice(0, 4).map((b, i) => (
                    <li key={i} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.825rem', display: 'flex', gap: 6 }}>
                      <span style={{ color: '#6c63ff', flexShrink: 0 }}>▸</span> {b}
                    </li>
                  ))}
                  {n.bullets.length > 4 && (
                    <li style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                      +{n.bullets.length - 4} more bullets
                    </li>
                  )}
                </ul>
              </div>
              <button
                onClick={() => del(n.id)}
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.4rem 0.6rem', cursor: 'pointer', marginLeft: '1rem' }}
              >
                <Trash2 size={14} color="#f87171" />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

// ─── HEALTH TAB ───────────────────────────────────────────────────────────────
function HealthTab() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/admin/health`).then(r => setLogs(r.data));
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>
        Health Logs ({logs.length})
      </h2>
      {logs.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
          <Heart size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>No health data logged yet</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Date', 'Water 💧', 'Sleep 😴', 'Exercise 🏃', 'Mood'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'white', fontSize: '0.875rem' }}>{l.date}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#3b82f6', fontSize: '0.875rem' }}>{l.water} glasses</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#8b5cf6', fontSize: '0.875rem' }}>{l.sleep}h</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#10b981', fontSize: '0.875rem' }}>{l.exercise} min</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '1.1rem' }}>{MOODS[l.mood] || '?'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── MESSAGES TAB ─────────────────────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/messages`).then(r => setMessages(r.data));
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);
    const res = await axios.post(`${API}/api/admin/messages`, { title, content });
    setMessages([res.data, ...messages]);
    setTitle(''); setContent('');
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>
        Announcements ({messages.length})
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', alignSelf: 'start' }}>
          <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Mail size={16} color="#6c63ff" /> Send New Message
          </h3>
          <form onSubmit={send}>
            <input
              className="input"
              placeholder="Message Title"
              value={title} onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <textarea
              className="input"
              placeholder="Type your announcement here..."
              value={content} onChange={e => setContent(e.target.value)}
              rows={5}
              style={{ width: '100%', marginBottom: '1rem', resize: 'vertical' }}
            />
            <button type="submit" className="btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} disabled={loading}>
              <Send size={16} /> {loading ? 'Sending...' : 'Send to Students'}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '1rem' }}>Sent History</h3>
          {messages.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No announcements sent yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map(m => (
                <div key={m.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{m.title}</p>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.5 }}>{m.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EMERGENCIES TAB ──────────────────────────────────────────────────────────
function EmergenciesTab() {
  const [alerts, setAlerts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/admin/emergencies`)
      .then(r => { setAlerts(r.data); setLoaded(true); })
      .catch(() => setLoaded(true));
    // Poll every 15 seconds for new alerts
    const interval = setInterval(() => {
      axios.get(`${API}/api/admin/emergencies`)
        .then(r => setAlerts(r.data))
        .catch(() => { });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', margin: 0 }}>
          Emergency SOS Alerts ({alerts.length})
        </h2>
        {alerts.length > 0 && (
          <span style={{
            background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem',
            color: '#f87171', fontWeight: 600, animation: 'pulse 1.5s infinite'
          }}>🔴 LIVE</span>
        )}
      </div>

      {!loaded ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
      ) : alerts.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
          <AlertTriangle size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p style={{ fontWeight: 600 }}>No emergency alerts yet</p>
          <p style={{ fontSize: '0.8rem', marginTop: 4 }}>SOS alerts from students will appear here in real-time</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {alerts.map((alert, idx) => {
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${alert.latitude},${alert.longitude}&travelmode=walking`;
            return (
              <div
                key={alert.id}
                className="card"
                style={{
                  padding: '1.25rem',
                  border: idx === 0 ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  background: idx === 0 ? 'rgba(239,68,68,0.06)' : undefined
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <AlertTriangle size={20} color="#f87171" />
                    </div>
                    <div>
                      <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>
                        {alert.studentName}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 4 }}>
                        📚 {alert.department}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                        🕐 {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        border: 'none', borderRadius: 10, padding: '0.5rem 1rem',
                        color: 'white', fontWeight: 600, fontSize: '0.82rem',
                        textDecoration: 'none', cursor: 'pointer',
                        boxShadow: '0 0 16px rgba(239,68,68,0.4)'
                      }}
                    >
                      <MapPin size={14} /> Walking Directions
                    </a>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', textAlign: 'right' }}>
                      📍 {alert.latitude?.toFixed(5)}, {alert.longitude?.toFixed(5)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ADMIN APP ────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'messages', label: 'Announcements', icon: Mail },
  { id: 'emergencies', label: 'SOS Alerts', icon: AlertTriangle },
];

export default function App() {
  const [authed, setAuthed] = useState(true);
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!authed) return;
    axios.get(`${API}/api/admin/stats`).then(r => setStats(r.data));
    axios.get(`${API}/api/admin/students`).then(r => setStudents(r.data));
  }, [authed]);

  // Login bypassed

  const renderTab = () => {
    switch (tab) {
      case 'dashboard': return <DashboardTab stats={stats} />;
      case 'students': return <StudentsTab students={students} />;
      case 'notes': return <NotesTab />;
      case 'health': return <HealthTab />;
      case 'messages': return <MessagesTab />;
      case 'emergencies': return <EmergenciesTab />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: 'var(--sidebar)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2.5rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#6c63ff,#a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(108,99,255,0.4)',
          }}>
            <Shield size={18} color="white" />
          </div>
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1 }}>Admin Panel</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>Student Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {NAV.map(item => {
            const active = tab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '0.65rem 0.85rem',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '0.25rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s',
                  background: active ? 'linear-gradient(135deg,rgba(108,99,255,0.25),rgba(168,85,247,0.2))' : 'transparent',
                  color: active ? 'white' : 'rgba(255,255,255,0.45)',
                  borderLeft: active ? '2px solid #6c63ff' : '2px solid transparent',
                }}
              >
                <Icon size={17} color={active ? '#a88dff' : 'rgba(255,255,255,0.35)'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div>
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', textAlign: 'center',
              padding: '0.6rem', borderRadius: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem',
              textDecoration: 'none', marginBottom: '0.75rem',
              transition: 'all 0.2s',
            }}
          >
            → Student App
          </a>
          {/* Sign Out removed to enforce no-password mode */}
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {NAV.find(n => n.id === tab)?.label}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginTop: 2 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f5d4', boxShadow: '0 0 8px #00f5d4' }} />
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>All systems live</span>
          </div>
        </div>
        {renderTab()}
      </main>
    </div>
  );
}
