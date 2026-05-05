import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, X, Moon, Sun, Headphones, LogOut, AlertTriangle } from 'lucide-react';
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
import { checkSession, signOut } from './utils/auth';
import './index.css';
import {
  BookOpen, User, Heart, PlayCircle, Timer, Calculator as CalcIcon
} from 'lucide-react';

// ─── THE SPINNING WHEEL THEME TRANSITION ─────────────────────────────────────
// The 6 tiles form a 2D wheel at the center ball. When you toggle themes,
// the wheel spins and each tile acts as a paint brush, artistically
// sweeping color across the screen.

const WHEEL_TILES = [
  { icon: BookOpen,    color: '#6c63ff', pinkColor: '#ff69b4' },
  { icon: User,        color: '#a855f7', pinkColor: '#ff85c8' },
  { icon: Heart,       color: '#ec4899', pinkColor: '#ff1493' },
  { icon: PlayCircle,  color: '#ef4444', pinkColor: '#ff6b9d' },
  { icon: Timer,       color: '#00f5d4', pinkColor: '#ffb6c1' },
  { icon: CalcIcon,    color: '#f59e0b', pinkColor: '#ff9ecd' },
];

const ThemeTransitionOverlay = ({ targetTheme }) => {
  const [corePos, setCorePos] = useState({ x: 50, y: 53 });

  useEffect(() => {
    const el = document.getElementById('center-ball-core');
    if (el) {
      const rect = el.getBoundingClientRect();
      setCorePos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, []);

  if (!targetTheme) return null;

  const cx = `${corePos.x}px`;
  const cy = `${corePos.y}px`;
  const WHEEL_RADIUS = 120;
  const ARM_LENGTH = Math.max(window.innerWidth, window.innerHeight);
  const toDark = targetTheme === 'dark';

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none' }}
    >
      {/* ── LAYER 1: Background color reveal synced to the spin ── */}
      <motion.div
        initial={toDark
          ? { clipPath: `circle(150vmax at ${cx} ${cy})` }
          : { clipPath: `circle(0px at ${cx} ${cy})` }
        }
        animate={toDark
          ? { clipPath: `circle(0px at ${cx} ${cy})` }
          : { clipPath: `circle(200vmax at ${cx} ${cy})` }
        }
        transition={{ duration: 5, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        style={{
          position: 'absolute', inset: 0,
          background: toDark
            ? `radial-gradient(circle at ${cx} ${cy}, transparent 0%, rgba(255,182,193,0.5) 30%, rgba(255,105,180,0.8) 60%, #ffb6c1 100%)`
            : `radial-gradient(ellipse at ${cx} ${cy}, rgba(255,255,255,1) 0%, rgba(255,240,245,0.98) 15%, rgba(255,220,235,0.95) 35%, rgba(255,182,193,0.9) 55%, #ffb6c1 100%)`,
        }}
      />

      {/* ── LAYER 2: 6 paint brush arms — long color trails ── */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: toDark ? -1080 : 1080 }}
        transition={{ duration: 5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: 'absolute',
          left: corePos.x, top: corePos.y,
          width: 0, height: 0,
        }}
      >
        {WHEEL_TILES.map((tile, i) => {
          const angle = (i / 6) * 360;
          const rad   = (angle * Math.PI) / 180;
          const brushColor = toDark ? tile.color : tile.pinkColor;

          return (
            <div key={i} style={{ position: 'absolute', width: 0, height: 0 }}>
              {/* Paint brush arm — a long gradient that sweeps like a paint roller */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: [0, 0.7, 0.5, 0], scaleX: [0, 1, 1, 0.5] }}
                transition={{ duration: 5, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.15, 0.7, 1] }}
                style={{
                  position: 'absolute',
                  width: ARM_LENGTH,
                  height: 60 + i * 10,
                  left: 0, top: -(30 + i * 5),
                  transformOrigin: '0% 50%',
                  transform: `rotate(${angle}deg)`,
                  background: `linear-gradient(90deg, ${brushColor}88 0%, ${brushColor}44 40%, transparent 100%)`,
                  filter: 'blur(25px)',
                  borderRadius: '0 50% 50% 0',
                }}
              />

              {/* The tile icon — orbiting at the end of each brush arm */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0.5] }}
                transition={{ duration: 5, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.1, 0.75, 1] }}
                style={{
                  position: 'absolute',
                  left: Math.cos(rad) * WHEEL_RADIUS - 22,
                  top:  Math.sin(rad) * WHEEL_RADIUS - 22,
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: toDark
                    ? 'rgba(15,15,30,0.8)'
                    : 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 20px ${brushColor}66, 0 4px 15px rgba(0,0,0,0.2)`,
                  border: `1px solid ${brushColor}55`,
                }}
              >
                <tile.icon size={20} color={brushColor} strokeWidth={2} />
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* ── LAYER 3: Soft central glow — the hub of the wheel ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.8, 0.6, 0], scale: [0.5, 1.5, 1.2, 0.3] }}
        transition={{ duration: 5, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.1, 0.7, 1] }}
        style={{
          position: 'absolute',
          left: cx, top: cy,
          width: 300, height: 300,
          marginLeft: -150, marginTop: -150,
          borderRadius: '50%',
          background: toDark
            ? 'radial-gradient(circle, rgba(108,99,255,0.4) 0%, rgba(0,245,212,0.15) 50%, transparent 100%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,182,193,0.4) 50%, transparent 100%)',
          filter: 'blur(40px)',
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
    checkSession().then(hasSession => setIsAuthenticated(hasSession));
  }, []);

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
    if (themeAnim) {
      setThemeAnim(null);
      return;
    }
    const nextTheme = theme === 'dark' ? 'pink' : 'dark';
    
    setThemeAnim(nextTheme);
    
    if (nextTheme === 'dark') {
      document.body.classList.add('sucking-dark');
      setTimeout(() => setTheme(nextTheme), 1500);
      setTimeout(() => {
        document.body.classList.remove('sucking-dark');
        setThemeAnim(null);
      }, 5500);
    } else {
      setTheme(nextTheme);
      setTimeout(() => setThemeAnim(null), 7000);
    }
  };

  const openInbox = () => {
    setShowInbox(true);
    if (messages.length > 0) {
      setLastReadId(messages[0].id);
      localStorage.setItem('lastReadMessageId', messages[0].id);
    }
  };

  const handleSOS = () => {
    playNormalClick();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    const btn = document.getElementById('sos-btn-icon');
    if (btn) btn.classList.add('animate-pulse');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          console.log("SOS TRIGGERED:", {
            user: "student@university.edu",
            lat: latitude,
            lng: longitude,
            timestamp: new Date().toISOString()
          });
          if (btn) btn.classList.remove('animate-pulse');
          alert(`🚨 SOS ALERT SENT TO ADMIN!\n\nLocation: Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}\nCampus Security has been notified.`);
        } catch (err) {
          alert("Failed to send SOS.");
        }
      },
      (error) => {
        if (btn) btn.classList.remove('animate-pulse');
        alert("Unable to retrieve your location for SOS: " + error.message);
      }
    );
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
          {theme === 'pink' && (
            <button
              onClick={handleSOS}
              className="btn-3d-glass"
              style={{ background: 'rgba(255,50,50,0.1)', borderColor: 'rgba(255,50,50,0.4)', boxShadow: '0 0 15px rgba(255,50,50,0.2)' }}
            >
              <AlertTriangle id="sos-btn-icon" size={18} color="#ff3333" />
            </button>
          )}
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
          <button
            onClick={async () => {
              await signOut();
              setIsAuthenticated(false);
            }}
            className="btn-3d-glass"
          >
            <LogOut size={18} />
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
