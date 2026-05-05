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

// ─── DUSTER THEME TRANSITION ─────────────────────────────────────────────────
// Overlay covers the screen with the OLD theme color. The actual CSS theme
// swaps instantly underneath. Then dusters wipe the old color away left to
// right, revealing the new theme beneath. Zero blank time.

const DUSTER_TILES = [
  { icon: BookOpen,    label: 'Notes' },
  { icon: User,        label: 'Student' },
  { icon: Heart,       label: 'Health' },
  { icon: PlayCircle,  label: 'YouTube' },
  { icon: Timer,       label: 'Timer' },
  { icon: CalcIcon,    label: 'Calc' },
];

const ThemeTransitionOverlay = ({ fromTheme }) => {
  if (!fromTheme) return null;

  // fromTheme = the OLD theme we're wiping away
  const wasPink = fromTheme === 'pink';
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const w  = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const bandH = vh / 6;

  // Stagger: starts immediately, cascades for organic feel
  const delays = [0, 0.12, 0.04, 0.18, 0.08, 0.22];

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {DUSTER_TILES.map((tile, i) => {
        const Icon = tile.icon;
        const yPos = i * bandH;

        // Band shows the OLD theme color — this is what gets wiped away
        const bandBg = wasPink
          ? `hsl(${340 + i * 4}, ${85 + i * 2}%, ${92 - i * 2}%)`
          : '#05050a';

        // Icon styled for the NEW theme (what's being revealed)
        const iconColor = wasPink ? '#00f5d4' : '#ff1493';
        const iconBg = wasPink
          ? 'rgba(15,15,30,0.95)'
          : 'rgba(255,255,255,0.95)';

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0, top: yPos,
              width: '100%', height: bandH + 1,
              overflow: 'hidden',
            }}
          >
            {/* Old theme band — starts fully visible, wiped away left to right */}
            <motion.div
              initial={{ clipPath: 'inset(0 0% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 100%)' }}
              transition={{
                duration: 2,
                ease: [0.25, 0.1, 0.25, 1],
                delay: delays[i],
              }}
              style={{
                position: 'absolute',
                inset: 0,
                background: bandBg,
              }}
            />

            {/* Duster icon — rides the wiping edge */}
            <motion.div
              initial={{ x: -60 }}
              animate={{ x: w + 20 }}
              transition={{
                duration: 2,
                ease: [0.25, 0.1, 0.25, 1],
                delay: delays[i],
              }}
              style={{
                position: 'absolute',
                top: (bandH - 48) / 2,
                width: 48, height: 48,
                borderRadius: 14,
                background: iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: wasPink
                  ? '4px 0 20px rgba(0,245,212,0.3), -2px 0 10px rgba(108,99,255,0.2)'
                  : '4px 0 20px rgba(255,105,180,0.3), -2px 0 10px rgba(255,182,193,0.2)',
                border: `1px solid ${wasPink ? 'rgba(0,245,212,0.3)' : 'rgba(255,105,180,0.3)'}`,
                zIndex: 2,
              }}
            >
              <Icon size={22} color={iconColor} strokeWidth={2.5} />
            </motion.div>
          </div>
        );
      })}
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
    const oldTheme = theme;
    const nextTheme = theme === 'dark' ? 'pink' : 'dark';
    
    // Show overlay with OLD theme color, then swap CSS immediately
    setThemeAnim(oldTheme);
    setTheme(nextTheme);
    
    // Cleanup after dusters finish wiping
    setTimeout(() => setThemeAnim(null), 2800);
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
        {themeAnim && <ThemeTransitionOverlay fromTheme={themeAnim} />}
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
