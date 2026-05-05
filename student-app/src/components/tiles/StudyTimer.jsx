import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, X, Coffee, Brain } from 'lucide-react';

const MODES = [
  { id: 'focus',  label: 'Focus',       duration: 25 * 60, color: '#6c63ff', icon: Brain },
  { id: 'short',  label: 'Short Break', duration: 5 * 60,  color: '#00f5d4', icon: Coffee },
  { id: 'long',   label: 'Long Break',  duration: 15 * 60, color: '#a855f7', icon: Coffee },
];

function pad(n) { return String(n).padStart(2, '0'); }

export default function StudyTimer({ onClose }) {
  const [modeIdx, setModeIdx]   = useState(0);
  const [secs, setSecs]         = useState(MODES[0].duration);
  const [running, setRunning]   = useState(false);
  const [cycles, setCycles]     = useState(0);
  const [flash, setFlash]       = useState(false);
  const intervalRef = useRef(null);

  const mode = MODES[modeIdx];
  const total = mode.duration;
  const pct   = (total - secs) / total;

  const switchMode = (idx) => {
    clearInterval(intervalRef.current);
    setModeIdx(idx);
    setSecs(MODES[idx].duration);
    setRunning(false);
  };

  const tick = useCallback(() => {
    setSecs(s => {
      if (s <= 1) {
        clearInterval(intervalRef.current);
        setRunning(false);
        setFlash(true);
        if (modeIdx === 0) setCycles(c => c + 1);
        setTimeout(() => setFlash(false), 3000);
        return 0;
      }
      return s - 1;
    });
  }, [modeIdx]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  const reset = () => {
    clearInterval(intervalRef.current);
    setSecs(mode.duration);
    setRunning(false);
  };

  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;

  // SVG ring
  const R = 90;
  const circ = 2 * Math.PI * R;
  const dashOffset = circ * (1 - pct);

  return (
    <div className="tile-overlay" onClick={onClose}>
      <motion.div
        className="tile-modal"
        style={{ maxWidth: 480 }}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${mode.color}33,${mode.color}11)`, border: `1px solid ${mode.color}44` }}>
              <Timer size={20} color={mode.color} />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Study Timer</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Pomodoro technique · {cycles} sessions today</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X size={18} /></button>
        </div>

        {/* Mode selector */}
        <div className="flex gap-2 mb-8 justify-center">
          {MODES.map((m, i) => (
            <button
              key={m.id}
              onClick={() => switchMode(i)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: modeIdx === i ? `linear-gradient(135deg,${m.color},${m.color}aa)` : 'rgba(255,255,255,0.06)',
                color: modeIdx === i ? 'white' : 'rgba(255,255,255,0.4)',
                border: modeIdx === i ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Timer circle */}
        <div className="flex justify-center mb-8">
          <div style={{ position: 'relative', width: 220, height: 220 }}>
            {/* Flash overlay */}
            <AnimatePresence>
              {flash && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 1.5, times: [0, 0.3, 1] }}
                  style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: mode.color, zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '1rem', fontWeight: 700,
                  }}
                >
                  {modeIdx === 0 ? '🎉 Session Done!' : '⚡ Break Over!'}
                </motion.div>
              )}
            </AnimatePresence>

            <svg width={220} height={220} style={{ transform: 'rotate(-90deg)' }}>
              {/* Track */}
              <circle cx={110} cy={110} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
              {/* Progress */}
              <motion.circle
                cx={110} cy={110} r={R}
                fill="none"
                stroke={mode.color}
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dashOffset}
                style={{ filter: `drop-shadow(0 0 10px ${mode.color})`, transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s' }}
              />
            </svg>

            {/* Centre display */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <motion.span
                key={`${mins}-${remSecs}`}
                initial={{ scale: 1.05, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-bold text-white"
                style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px' }}
              >
                {pad(mins)}:{pad(remSecs)}
              </motion.span>
              <span className="text-xs font-medium mt-1" style={{ color: mode.color }}>
                {mode.label.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <RotateCcw size={18} color="rgba(255,255,255,0.6)" />
          </button>

          <motion.button
            onClick={() => setRunning(r => !r)}
            className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${mode.color}, ${mode.color}aa)`,
              boxShadow: `0 0 30px ${mode.color}66`,
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
          >
            {running ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 3 }} />}
          </motion.button>

          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <span className="text-sm font-bold" style={{ color: mode.color }}>{cycles}</span>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 glass rounded-xl p-3 text-center">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {modeIdx === 0
              ? '🎯 Focus fully. Close distractions. 25 minutes of deep work.'
              : '☕ Step away from the screen. Rest your eyes and stretch.'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
