import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Droplets, Moon, Smile, Footprints, X, TrendingUp, Activity } from 'lucide-react';
import axios from 'axios';
import { startStepCounter, getSteps, checkSleepStatus, getWaterCount } from '../../utils/healthTracker';
import { addScore } from '../../utils/dailyScore';

const API = 'http://localhost:5001';

const MOODS = [
  { val: 1, emoji: '😞', label: 'Rough' },
  { val: 2, emoji: '😐', label: 'Meh' },
  { val: 3, emoji: '🙂', label: 'Okay' },
  { val: 4, emoji: '😊', label: 'Good' },
  { val: 5, emoji: '🤩', label: 'Amazing' },
];

const STEP_GOAL = 10000;
const WATER_GOAL = 8;

function Ring({ value, max, color, size = 80, label, icon: Icon, suffix = '' }) {
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
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={size === 80 ? 20 : size >= 100 ? 24 : 16} color={color} />
        </div>
      </div>
      <p className="text-sm font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}<span className="text-xs font-normal" style={{ color:'rgba(255,255,255,0.4)' }}>{suffix ? ` ${suffix}` : `/${max}`}</span></p>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
    </div>
  );
}

function SleepCard({ sleepData }) {
  const { status, sleepStart, sleepEnd } = sleepData;

  if (!status) {
    return (
      <div style={{
        padding: '1rem', borderRadius: 16,
        background: 'rgba(139,92,246,0.06)',
        border: '1px solid rgba(139,92,246,0.2)',
        textAlign: 'center'
      }}>
        <Moon size={24} color="#8b5cf6" style={{ margin: '0 auto 8px' }} />
        <p className="text-sm font-semibold text-white" style={{ marginBottom: 4 }}>Sleep Status</p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          No overnight data yet. Sleep detection begins after 9 PM IST.
        </p>
      </div>
    );
  }

  const isGood = status === 'good';
  const startTime = sleepStart ? new Date(sleepStart).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '—';
  const endTime = sleepEnd ? new Date(sleepEnd).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '—';
  const durationMs = sleepStart && sleepEnd ? new Date(sleepEnd) - new Date(sleepStart) : 0;
  const durationH = Math.round(durationMs / (1000 * 60 * 60) * 10) / 10;

  return (
    <div style={{
      padding: '1.25rem', borderRadius: 16,
      background: isGood
        ? 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))'
        : 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))',
      border: isGood
        ? '1px solid rgba(16,185,129,0.25)'
        : '1px solid rgba(239,68,68,0.25)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: isGood ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${isGood ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Moon size={20} color={isGood ? '#10b981' : '#ef4444'} />
        </div>
        <div>
          <p className="font-bold text-white" style={{ fontSize: '1.05rem', margin: 0 }}>
            {isGood ? 'Good Sleep 😴✅' : 'Poor Sleep 😴❌'}
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {isGood ? 'You got 7+ hours of rest' : 'Less than 7 hours detected'}
          </p>
        </div>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '0.6rem 0.8rem', borderRadius: 10,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', margin: 0 }}>Slept at</p>
          <p className="text-sm font-semibold text-white" style={{ margin: 0 }}>{startTime}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', margin: 0 }}>Woke up</p>
          <p className="text-sm font-semibold text-white" style={{ margin: 0 }}>{endTime}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', margin: 0 }}>Duration</p>
          <p className="text-sm font-semibold" style={{ color: isGood ? '#10b981' : '#ef4444', margin: 0 }}>{durationH}h</p>
        </div>
      </div>
    </div>
  );
}

export default function HealthTile({ onClose }) {
  const [steps, setSteps]       = useState(0);
  const [sleepData, setSleepData] = useState({ status: null, sleepStart: null, sleepEnd: null });
  const [waterCount, setWaterCount] = useState(0);
  const [mood, setMood]         = useState(3);
  const [logs, setLogs]         = useState([]);
  const [saved, setSaved]       = useState(false);
  const [tab, setTab]           = useState('dashboard');
  const [hasAccelerometer, setHasAccelerometer] = useState(true);
  const cleanupRef = useRef(null);

  // Initialize passive trackers
  useEffect(() => {
    // Step counter
    const cleanup = startStepCounter((count) => {
      setSteps(count);
      // Award steps_goal once when target is reached
      if (count >= STEP_GOAL) {
        const log = JSON.parse(localStorage.getItem('daily_score_log') || '[]');
        if (!log.some(l => l.action === 'steps_goal')) {
          addScore('steps_goal');
        }
      }
    });
    cleanupRef.current = cleanup;

    // Check if accelerometer data is arriving
    const checkTimer = setTimeout(() => {
      if (getSteps() === 0) {
        setHasAccelerometer(false);
      }
    }, 3000);

    // Sleep status — award or penalize
    const sleep = checkSleepStatus();
    setSleepData(sleep);
    if (sleep.status) {
      const scoreLog = JSON.parse(localStorage.getItem('daily_score_log') || '[]');
      const alreadyScored = scoreLog.some(l => l.action === 'good_sleep' || l.action === 'poor_sleep');
      if (!alreadyScored) {
        if (sleep.status === 'good') addScore('good_sleep');
        else if (sleep.status === 'poor') addScore('poor_sleep');
      }
    }

    // Water count
    setWaterCount(getWaterCount());

    // Fetch history
    axios.get(`${API}/api/health`).then(r => setLogs(r.data)).catch(() => {});

    return () => {
      if (cleanupRef.current) cleanupRef.current();
      clearTimeout(checkTimer);
    };
  }, []);

  // Update water count periodically (in case popups are being answered in App.jsx)
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterCount(getWaterCount());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const saveToday = async () => {
    try {
      await axios.post(`${API}/api/health`, {
        water: waterCount,
        sleep: sleepData.status === 'good' ? 8 : sleepData.status === 'poor' ? 4 : 0,
        mood,
        steps,
      });
      setSaved(true);
      addScore('health_saved');
      const res = await axios.get(`${API}/api/health`);
      setLogs(res.data);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  return (
    <div className="tile-overlay" onClick={onClose}>
      <motion.div
        className="tile-modal"
        style={{
          background: 'linear-gradient(145deg, rgba(18,15,28,0.96), rgba(12,18,26,0.96))',
          border: '1px solid rgba(236,72,153,0.32)',
          boxShadow: '0 25px 85px rgba(0,0,0,0.55), 0 0 45px rgba(236,72,153,0.14)',
        }}
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
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Auto-tracking · Steps · Sleep · Water</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {['dashboard', 'history'].map(t => (
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
              {t === 'dashboard' ? '📊 Dashboard' : '📈 History'}
            </button>
          ))}
        </div>

        <div
          className="glass rounded-xl mb-4"
          style={{
            padding: '0.8rem 1rem',
            border: '1px solid rgba(236,72,153,0.24)',
            background: 'linear-gradient(90deg, rgba(236,72,153,0.08), rgba(59,130,246,0.06))',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em' }}>
            LIVE WELLNESS SIGNAL
          </p>
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '18%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.08), rgba(255,255,255,0))',
              pointerEvents: 'none',
            }}
          />
          <svg width="100%" height="34" viewBox="0 0 600 34" style={{ opacity: 0.9 }}>
            <path
              d="M0 20 L80 20 L110 20 L130 10 L150 26 L170 6 L190 20 L250 20 L280 20 L300 12 L320 24 L340 8 L360 20 L600 20"
              fill="none"
              stroke="#ec4899"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'dashboard' ? (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Top Rings Row */}
              <div className="glass rounded-xl p-5 mb-4" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <Ring value={steps} max={STEP_GOAL} color="#10b981" size={90} label="Steps" icon={Footprints} />
                <Ring value={waterCount} max={WATER_GOAL} color="#3b82f6" size={90} label="Water" icon={Droplets} />
              </div>

              {/* Step Counter Status */}
              <div className="glass rounded-xl p-4 mb-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Footprints size={16} color="#10b981" />
                  <span className="text-sm font-semibold text-white">Step Counter</span>
                  <span className="ml-auto text-sm font-bold" style={{ color: '#10b981' }}>{steps.toLocaleString()} steps</span>
                </div>
                <div className="mt-1 rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((steps / STEP_GOAL) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #00f5d4)', borderRadius: 999 }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <span>0</span><span>{(STEP_GOAL / 2).toLocaleString()}</span><span>{STEP_GOAL.toLocaleString()}</span>
                </div>
                {!hasAccelerometer && (
                  <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                    <Activity size={10} style={{ display: 'inline', marginRight: 4 }} />
                    Accelerometer not available — open on mobile for live tracking
                  </p>
                )}
              </div>

              {/* Sleep Status */}
              <div className="mb-3">
                <SleepCard sleepData={sleepData} />
              </div>

              {/* Water Intake - read only summary */}
              <div className="glass rounded-xl p-4 mb-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Droplets size={16} color="#3b82f6" />
                  <span className="text-sm font-semibold text-white">Water Intake</span>
                  <span className="ml-auto text-sm font-bold" style={{ color: '#3b82f6' }}>{waterCount} / {WATER_GOAL} glasses</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: WATER_GOAL }, (_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center"
                      style={{
                        background: waterCount > i ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                        color: waterCount > i ? 'white' : 'rgba(255,255,255,0.15)',
                        boxShadow: waterCount > i ? '0 0 8px rgba(59,130,246,0.5)' : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      💧
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Water reminders appear hourly. Confirm via popups to log intake.
                </p>
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
                      onClick={() => setMood(m.val)}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1"
                      style={{
                        background: mood === m.val ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                        border: mood === m.val ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                        transform: mood === m.val ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={saveToday} className="btn-primary w-full flex items-center justify-center gap-2">
                <TrendingUp size={16} />
                {saved ? '✓ Saved!' : "Save Today's Summary"}
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
