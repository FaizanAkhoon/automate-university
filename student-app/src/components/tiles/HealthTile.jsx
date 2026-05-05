import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Droplets, Moon, Smile, Footprints, Save, X, TrendingUp, Plus, Minus } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000';

const MOODS = [
  { val: 1, emoji: '😞', label: 'Rough' },
  { val: 2, emoji: '😐', label: 'Meh' },
  { val: 3, emoji: '🙂', label: 'Okay' },
  { val: 4, emoji: '😊', label: 'Good' },
  { val: 5, emoji: '🤩', label: 'Amazing' },
];

function Ring({ value, max, color, size = 80, label, icon: Icon }) {
  const pct = Math.min(value / max, 1);
  const r   = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
          <motion.circle
            cx={size/2} cy={size/2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={size === 80 ? 20 : 16} color={color} />
        </div>
      </div>
      <p className="text-xs font-semibold text-white">{value}<span className="text-xs font-normal" style={{ color:'rgba(255,255,255,0.4)' }}>/{max}</span></p>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
    </div>
  );
}

export default function HealthTile({ onClose }) {
  const [form, setForm]   = useState({ water: 0, sleep: 0, mood: 3, steps: 0 });
  const [logs, setLogs]   = useState([]);
  const [saved, setSaved] = useState(false);
  const [tab, setTab]     = useState('log');

  useEffect(() => {
    axios.get(`${API}/api/health`).then(r => setLogs(r.data)).catch(() => {});
  }, []);

  const save = async () => {
    try {
      await axios.post(`${API}/api/health`, form);
      setSaved(true);
      const res = await axios.get(`${API}/api/health`);
      setLogs(res.data);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  const todayLog = logs[0];

  return (
    <div className="tile-overlay" onClick={onClose}>
      <motion.div
        className="tile-modal"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#ec489933,#ec489911)', border: '1px solid #ec489944' }}>
              <Heart size={20} color="#ec4899" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Health Tracker</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Water · Sleep · Mood · Exercise</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {['log', 'history'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === t ? 'linear-gradient(135deg,#ec4899,#f43f5e)' : 'rgba(255,255,255,0.06)',
                color: tab === t ? 'white' : 'rgba(255,255,255,0.5)',
                border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {t === 'log' ? "📝 Today's Log" : '📈 History'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'log' ? (
            <motion.div key="log" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Today rings preview */}
              {todayLog && (
                <div className="glass rounded-xl p-4 mb-5 flex justify-around">
                  <Ring value={todayLog.water} max={8}    color="#3b82f6" size={70} label="Water" icon={Droplets} />
                  <Ring value={todayLog.sleep} max={9}    color="#8b5cf6" size={70} label="Sleep" icon={Moon} />
                  <Ring value={Math.min(todayLog.steps || 0, 10000)} max={10000} color="#10b981" size={70} label="Steps" icon={Footprints} />
                </div>
              )}

              {/* Water */}
              <div className="glass rounded-xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <Droplets size={16} color="#3b82f6" />
                  <span className="text-sm font-semibold text-white">Water Intake</span>
                  <span className="ml-auto text-sm font-bold" style={{ color: '#3b82f6' }}>{form.water} / 8 glasses</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: 8 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setForm(f => ({ ...f, water: i + 1 }))}
                      className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: form.water > i ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                        color: form.water > i ? 'white' : 'rgba(255,255,255,0.3)',
                        boxShadow: form.water > i ? '0 0 8px rgba(59,130,246,0.5)' : 'none',
                      }}
                    >
                      💧
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep */}
              <div className="glass rounded-xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Moon size={16} color="#8b5cf6" />
                  <span className="text-sm font-semibold text-white">Sleep Hours</span>
                  <span className="ml-auto text-sm font-bold" style={{ color: '#8b5cf6' }}>{form.sleep}h</span>
                </div>
                <input
                  type="range" min="0" max="12" step="0.5"
                  value={form.sleep}
                  onChange={e => setForm(f => ({ ...f, sleep: parseFloat(e.target.value) }))}
                  className="w-full"
                  style={{ accentColor: '#8b5cf6' }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <span>0h</span><span>6h</span><span>12h</span>
                </div>
              </div>

              {/* Step Counter */}
              <div className="glass rounded-xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <Footprints size={16} color="#10b981" />
                  <span className="text-sm font-semibold text-white">Step Counter</span>
                  <span className="ml-auto text-sm font-bold" style={{ color: '#10b981' }}>{form.steps.toLocaleString()} steps</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setForm(f => ({ ...f, steps: Math.max(0, f.steps - 500) }))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
                  >
                    <Minus size={16} color="#10b981" />
                  </button>
                  <input
                    type="number" min="0" max="50000" step="100"
                    value={form.steps}
                    onChange={e => setForm(f => ({ ...f, steps: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="flex-1 text-center text-white font-bold text-lg rounded-xl p-2"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(16,185,129,0.3)', outline: 'none' }}
                  />
                  <button
                    onClick={() => setForm(f => ({ ...f, steps: f.steps + 500 }))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
                  >
                    <Plus size={16} color="#10b981" />
                  </button>
                </div>
                <div className="flex justify-between text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <span>0</span><span>5,000 (goal)</span><span>10,000+</span>
                </div>
                <div className="mt-2 rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ height: '100%', width: `${Math.min((form.steps / 10000) * 100, 100)}%`, background: 'linear-gradient(90deg, #10b981, #00f5d4)', borderRadius: 999, transition: 'width 0.4s' }} />
                </div>
              </div>

              {/* Mood */}
              <div className="glass rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Smile size={16} color="#f59e0b" />
                  <span className="text-sm font-semibold text-white">How are you feeling?</span>
                </div>
                <div className="flex justify-between gap-1">
                  {MOODS.map(m => (
                    <button
                      key={m.val}
                      onClick={() => setForm(f => ({ ...f, mood: m.val }))}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1"
                      style={{
                        background: form.mood === m.val ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                        border: form.mood === m.val ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                        transform: form.mood === m.val ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={save} className="btn-primary w-full flex items-center justify-center gap-2">
                <Save size={16} />
                {saved ? '✓ Logged!' : "Save Today's Health"}
              </button>
            </motion.div>
          ) : (
            <motion.div key="hist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {logs.length === 0 ? (
                <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No health logs yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {logs.map(log => (
                    <div key={log.id} className="glass rounded-xl p-3 flex items-center gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">{log.date}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          Mood: {MOODS.find(m => m.val === log.mood)?.emoji || '?'}
                        </p>
                      </div>
                      <div className="ml-auto flex gap-4 text-xs">
                        <span style={{ color: '#3b82f6' }}>💧 {log.water}</span>
                        <span style={{ color: '#8b5cf6' }}>😴 {log.sleep}h</span>
                        <span style={{ color: '#10b981' }}>👣 {(log.steps || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
