import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, X, Moon, Sun, Headphones } from 'lucide-react';
import { playNormalClick } from './utils/sound';
import KineticChain from './components/KineticChain';
import NotesSummarizer from './components/tiles/NotesSummarizer';
import StudentInfo from './components/tiles/StudentInfo';
import HealthTile from './components/tiles/HealthTile';
import YouTubeChannels from './components/tiles/YouTubeChannels';
import StudyTimer from './components/tiles/StudyTimer';
import Calculator from './components/tiles/Calculator';
import Login from './components/Login';
import MusicWidget from './components/MusicWidget';
import './index.css';

const ThemeTransitionOverlay = ({ targetTheme }) => {
  const [corePos, setCorePos] = useState({ left: '50%', top: '53%' });

  useEffect(() => {
    const el = document.getElementById('center-ball-core');
    if (el) {
      const rect = el.getBoundingClientRect();
      setCorePos({ left: rect.left + rect.width / 2 + 'px', top: rect.top + rect.height / 2 + 'px' });
    }
  }, []);

  if (!targetTheme) return null;

  if (targetTheme === 'dark') {
    return (
      <motion.div 
        exit={{ opacity: 0 }} 
        transition={{ duration: 2.0, ease: 'easeInOut' }}
        style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none', overflow: 'hidden' }}
      >
        {/* 3 Converging Liquid Waves */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ width: '150vmax', height: '150vmax' }}
            animate={{ width: '0vmax', height: '0vmax' }}
            transition={{ 
              duration: 8 - (i * 0.8), // 8.0s, 7.2s, 6.4s
              ease: [0.7, 0.05, 0.9, 0.3], 
              delay: i * 0.8 // Starts staggered
            }}
            style={{
              position: 'absolute',
              left: corePos.left, top: corePos.top,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              // Opacities: 0.5, 0.75, 1.0
              boxShadow: `0 0 0 200vmax rgba(5,5,10,${0.5 + i * 0.25}), inset 0 0 ${150 - i * 30}px ${80 - i * 15}px rgba(5,5,10,${0.5 + i * 0.25})`,
              background: 'transparent',
            }}
          />
        ))}

        {/* Pink Vortex - Sucked over the black waves */}
        <motion.div
          initial={{ width: '250vw', height: '250vw', opacity: 0.8, rotate: 0 }}
          animate={{ width: 0, height: 0, opacity: 1, rotate: 2160 }}
          transition={{ duration: 8, ease: [0.7, 0.05, 0.9, 0.3] }}
          style={{
            position: 'absolute',
            left: corePos.left, top: corePos.top,
            transform: 'translate(-50%, -50%)',
            background: 'conic-gradient(from 0deg, transparent, rgba(255,105,180,0.6), transparent, rgba(255,182,193,0.6), transparent)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            zIndex: 1
          }}
        />

        {/* Duplicate Dark Dot - Permanently visible ON TOP of waves */}
        <div style={{
          position: 'absolute',
          left: corePos.left, top: corePos.top,
          transform: 'translate(-50%, -50%)',
          width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)',
          boxShadow: '0 0 30px rgba(0,245,212,0.2), inset 0 0 20px rgba(108,99,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            background: '#00f5d4',
            boxShadow: '0 0 15px #00f5d4, 0 0 30px #6c63ff',
          }} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', overflow: 'hidden'
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ position: 'absolute', inset: 0, background: '#fff0f5' }}
      />
      <motion.div
        initial={{ scale: 0, rotate: -45, opacity: 0 }}
        animate={{ scale: 15, rotate: 90, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', width: 400, height: 400,
          background: 'conic-gradient(from 0deg, #ffb6c1, #ff69b4, #ff1493, #ffb6c1)',
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          filter: 'blur(40px)'
        }}
      />
      <motion.div
        initial={{ scale: 0, rotate: 45, opacity: 0 }}
        animate={{ scale: 12, rotate: -90, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.1 }}
        style={{
          position: 'absolute', width: 300, height: 300,
          background: 'conic-gradient(from 0deg, white, #ffe4e1, white)',
          borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
          filter: 'blur(20px)'
        }}
      />
    </motion.div>
  );
};

const TILE_MAP = {
  notes:   NotesSummarizer,
  student: StudentInfo,
  health:  HealthTile,
  youtube: YouTubeChannels,
  timer:   StudyTimer,
  calc:    Calculator,
};

// ─── INBOX MODAL ─────────────────────────────────────────────────────────────
function InboxModal({ messages, onClose, theme }) {
  const isPink = theme === 'pink';
  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="tile-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 30, opacity: 0, rotateX: 10 }}
        animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.95, y: 30, opacity: 0, rotateX: -10 }}
        transition={{ type: "spring", stiffness: 350, damping: 30, mass: 1 }}
        className="tile-modal"
        style={{
          background: isPink ? 'rgba(255,240,245,0.95)' : 'rgba(15,15,30,0.95)',
          border: isPink ? '1px solid rgba(255,182,193,0.5)' : '1px solid rgba(255,255,255,0.12)',
          color: isPink ? '#5c454f' : 'white',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Mail size={24} color={isPink ? "#ff1493" : "#6c63ff"} /> 
            Announcements
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.5rem', border: 'none' }}>
            <X size={20} />
          </button>
        </div>
        
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>No announcements yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map(m => (
              <div key={m.id} style={{ 
                padding: '1.25rem', 
                borderRadius: 16, 
                background: isPink ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.05)',
                border: isPink ? '1px solid rgba(255,182,193,0.4)' : '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{m.title}</h3>
                  <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{new Date(m.createdAt).toLocaleString()}</span>
                </div>
                <p style={{ lineHeight: 1.6, opacity: 0.8, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTile, setActiveTile] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [themeAnim, setThemeAnim] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showInbox, setShowInbox] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [lastReadId, setLastReadId] = useState(localStorage.getItem('lastReadMessageId') || null);

  useEffect(() => {
    fetch('http://localhost:5000/api/messages')
      .then(r => r.json())
      .then(data => setMessages(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (theme === 'pink') {
      document.body.classList.add('theme-pink');
    } else {
      document.body.classList.remove('theme-pink');
    }
  }, [theme]);

  const hasUnread = messages.length > 0 && messages[0].id !== lastReadId;

  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target.closest('button') || e.target.closest('.btn-ghost') || e.target.closest('.btn-3d-glass')) {
        playNormalClick();
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleThemeToggle = () => {
    if (themeAnim) return; // prevent spam clicking
    const nextTheme = theme === 'dark' ? 'pink' : 'dark';
    setThemeAnim(nextTheme);
    
    if (nextTheme === 'dark') {
      // 1. Hole closes perfectly over 8.0 seconds.
      // 2. At 8.2s (screen is pitch black), swap React state to avoid frame drops being visible.
      setTimeout(() => {
        setTheme(nextTheme);
      }, 8200);
      
      // 3. At 8.5s, trigger the ultra-smooth 2.0s fade out of the pitch black overlay.
      setTimeout(() => {
        setThemeAnim(null);
      }, 8500);
    } else {
      setTimeout(() => setTheme(nextTheme), 500);
      setTimeout(() => setThemeAnim(null), 1500);
    }
  };

  const openInbox = () => {
    setShowInbox(true);
    if (messages.length > 0) {
      setLastReadId(messages[0].id);
      localStorage.setItem('lastReadMessageId', messages[0].id);
    }
  };

  const ActiveComponent = activeTile ? TILE_MAP[activeTile] : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AnimatePresence>
        {themeAnim && <ThemeTransitionOverlay targetTheme={themeAnim} />}
      </AnimatePresence>
      
      {!isAuthenticated ? (
        <Login onLogin={() => setIsAuthenticated(true)} theme={theme} />
      ) : (
        <>
          {/* Top bar */}
          <header className="glass" style={{
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#6c63ff,#a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(108,99,255,0.5)',
            }}
          >
            <span style={{ fontSize: 16 }}>🎓</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-none">Student Portal</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>Your learning hub</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMusic(!showMusic)}
            className="btn-3d-glass"
          >
            <Headphones size={18} />
          </button>
          <button
            onClick={openInbox}
            className="btn-3d-glass"
            style={{ position: 'relative' }}
          >
            <Mail size={18} />
            {hasUnread && (
              <span 
                className="animate-pulse"
                style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#ef4444', border: '2px solid var(--bg)',
                  boxShadow: '0 0 8px #ef4444'
                }} 
              />
            )}
          </button>
          <button
            onClick={handleThemeToggle}
            className="btn-3d-glass"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <span style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))', fontSize: '0.75rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })}
          </span>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs"
            style={{ textDecoration:'none', padding:'0.4rem 0.9rem' }}
          >
            Admin →
          </a>
        </div>
      </header>

      {/* Hero section */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 1rem 1rem',
        position: 'relative',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500, height: 300,
          background: 'radial-gradient(ellipse, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: '#6c63ff', letterSpacing: '0.12em' }}>
            WELCOME BACK
          </p>
          <h2 className="gradient-text font-black" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '0.75rem' }}>
            Your Smart<br />Learning Dashboard
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
            Scroll to spin the chain and explore your tools.
            Click any tile to open it.
          </p>
        </motion.div>
      </section>

      {/* Kinetic chain */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem 4rem',
        minHeight: 580,
      }}>
        <KineticChain onSelect={setActiveTile} theme={theme} themeAnim={themeAnim} />
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.2)',
        fontSize: '0.75rem',
      }}>
        Student Portal · Built with React + Framer Motion + Node.js
      </footer>

      {/* Active tile modal */}
      <AnimatePresence>
        {ActiveComponent && (
          <ActiveComponent onClose={() => setActiveTile(null)} />
        )}
        {showInbox && (
          <InboxModal messages={messages} onClose={() => setShowInbox(false)} theme={theme} />
        )}
        {showMusic && (
          <MusicWidget onClose={() => setShowMusic(false)} theme={theme} />
        )}
      </AnimatePresence>
        </>
      )}
    </div>
  );
}
