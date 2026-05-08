import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, X, Moon, Sun, Headphones, LogOut, AlertTriangle, Droplets, Check } from 'lucide-react';
import {
  recordActivity, getMissedWaterReminders, addWater, ackWater,
  requestNotificationPermission, sendWaterNotification
} from './utils/healthTracker';
import { getDailyScore, addScore, checkDayEnd, awardLoginBonus } from './utils/dailyScore';
import { playNormalClick } from './utils/sound';
import KineticChain from './components/KineticChain';
import NotesSummarizer from './components/tiles/NotesSummarizer';
import StudentInfo from './components/tiles/StudentInfo';
import HealthTile from './components/tiles/HealthTile';
import YouTubeChannels from './components/tiles/YouTubeChannels';
import StudyTimer from './components/tiles/StudyTimer';
import CsBook from './components/tiles/CsBook';
import CommunityBoard from './components/tiles/CommunityBoard';
import VoiceAssistant from './components/VoiceAssistant';
import Login from './components/Login';
import MusicWidget from './components/MusicWidget';
import { checkSession, signOut } from './utils/auth';
import { dailyQuotes } from './data/quotes';
import './index.css';
import {
  BookOpen, User, Heart, PlayCircle, Timer, GraduationCap, Users
} from 'lucide-react';

function AxiomLogo({ theme }) {
  const isPink = theme === 'pink';
  const color1 = isPink ? '#ff1493' : '#00f5d4';
  const color2 = isPink ? '#ffb6c1' : '#6c63ff';

  return (
    <svg className="axiom-logo-svg" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 8px ${color1}55)` }}>
      <defs>
        <linearGradient id="axiom-grad" x1="0" y1="0" x2="160" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor={color1} />
          <stop offset="1" stopColor={color2} />
        </linearGradient>
      </defs>
      <path 
        d="M10 35 L25 10 L40 35 Q45 40 50 10 L70 35 M70 10 L50 35 Q65 40 85 10 L85 35 Q95 40 105 35 A12 15 0 1 0 105 10 Q120 10 130 35 L130 10 L142 25 L154 10 L154 35"
        stroke="url(#axiom-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" 
      />
      <path d="M18 22 L32 22" stroke="url(#axiom-grad)" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );
}

// ─── DUSTER THEME TRANSITION ─────────────────────────────────────────────────
// Overlay covers the screen with the OLD theme color. The actual CSS theme
// swaps instantly underneath. Then dusters wipe the old color away left to
// right, revealing the new theme beneath. Zero blank time.

const DUSTER_TILES = [
  { icon: BookOpen,      label: 'Notes' },
  { icon: User,          label: 'Student' },
  { icon: Heart,         label: 'Health' },
  { icon: PlayCircle,    label: 'Learn Skills' },
  { icon: Timer,         label: 'Pomodoro Technique' },
  { icon: GraduationCap, label: 'CS Book' },
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
  csbook:  CsBook,
};

const TILE_REVEAL_MAP = {
  notes: 'book',
  student: 'nodes',
  health: 'ripple',
  youtube: 'lens',
  timer: 'timeline',
  csbook: 'circuit',
};

const TILES_LABELS = {
  notes: 'Note Summarizer',
  student: 'Data Analyzer',
  health: 'Creative Composer',
  youtube: 'Research Explorer',
  timer: 'Task Planner',
  csbook: 'Automation Runner',
};

function ActionLoadingOverlay({ theme, reveal, label }) {
  const isPink = theme === 'pink';
  const baseBg = isPink ? 'rgba(255,240,245,0.92)' : 'rgba(6,6,14,0.92)';
  const textColor = isPink ? '#5c454f' : 'rgba(255,255,255,0.92)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        background: baseBg,
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'relative', width: 220, height: 120 }}>
        {reveal === 'book' && (
          <>
            <motion.div
              initial={{ rotateY: 0, x: 0 }}
              animate={{ rotateY: -25, x: -24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                left: 20,
                top: 20,
                width: 86,
                height: 80,
                borderRadius: '12px 0 0 12px',
                background: 'linear-gradient(90deg, #f7ebd2, #ead2a6)',
                transformOrigin: 'right center',
              }}
            />
            <motion.div
              initial={{ rotateY: 0, x: 0 }}
              animate={{ rotateY: 25, x: 24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                right: 20,
                top: 20,
                width: 86,
                height: 80,
                borderRadius: '0 12px 12px 0',
                background: 'linear-gradient(270deg, #f7ebd2, #ead2a6)',
                transformOrigin: 'left center',
              }}
            />
            <motion.div
              initial={{ opacity: 0.2, scaleY: 0.4 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.25, delay: 0.08 }}
              style={{
                position: 'absolute',
                left: '50%',
                top: 20,
                width: 1,
                height: 80,
                background: 'rgba(194,154,96,0.95)',
              }}
            />
          </>
        )}
        {reveal === 'nodes' && (
          <>
            {[[-50, -10], [0, -28], [50, -10], [-28, 30], [28, 30]].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18, delay: i * 0.05 }}
                style={{ position: 'absolute', left: `calc(50% + ${p[0]}px)`, top: `calc(50% + ${p[1]}px)`, width: 10, height: 10, borderRadius: '50%', background: '#91d5ff', boxShadow: '0 0 10px #91d5ff' }}
              />
            ))}
          </>
        )}
        {reveal === 'ripple' && [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.25, opacity: 0.75 }}
            animate={{ scale: 1.8 + i * 0.35, opacity: 0 }}
            transition={{ duration: 0.55, delay: i * 0.1, repeat: Infinity }}
            style={{ position: 'absolute', left: '50%', top: '50%', width: 36, height: 36, marginLeft: -18, marginTop: -18, borderRadius: '50%', border: '2px solid rgba(255,129,218,0.7)' }}
          />
        ))}
        {reveal === 'lens' && (
          <motion.div
            initial={{ x: -120 }}
            animate={{ x: 220 }}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: 8, width: 80, height: 104, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,174,174,0.5), rgba(255,255,255,0))' }}
          />
        )}
        {reveal === 'timeline' && (
          <>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4 }}
              style={{ position: 'absolute', left: 24, right: 24, top: 60, height: 2, background: 'rgba(0,245,212,0.8)', transformOrigin: 'left center' }}
            />
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 400, damping: 20 }}
                style={{ position: 'absolute', left: `${30 + i * 20}%`, top: 55, width: 10, height: 10, borderRadius: '50%', background: '#00f5d4' }}
              />
            ))}
          </>
        )}
        {reveal === 'circuit' && [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.22, delay: i * 0.08 }}
            style={{ position: 'absolute', left: 30 + i * 26, top: 34 + i * 15, width: 95 - i * 12, height: 2, background: 'rgba(245,158,11,0.9)', transformOrigin: 'left center' }}
          />
        ))}
      </div>
      <p style={{ color: textColor, fontWeight: 700, letterSpacing: '0.02em' }}>
        Opening {label}...
      </p>
    </motion.div>
  );
}

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

// ─── TECH NEWS BANNER ────────────────────────────────────────────────────────
function TechNewsBanner({ theme }) {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isPink = theme === 'pink';

  useEffect(() => {
    const curated = [
      { id: 'fs1', title: '🔥 Fireship: 100 Seconds of Code — Learn any tech fast', url: 'https://www.youtube.com/@Fireship', source: 'Fireship' },
      { id: 'fs2', title: '🔥 Fireship: God-Tier Developer Roadmap 2025', url: 'https://www.youtube.com/watch?v=pEfrdAtAmqk', source: 'Fireship' },
      { id: 'fs3', title: '🔥 Fireship: AI just changed everything... again', url: 'https://www.youtube.com/@Fireship/videos', source: 'Fireship' },
    ];

    // Fetch DEV.to trending articles
    const devtoPromise = fetch('https://dev.to/api/articles?per_page=5&top=1')
      .then(r => r.json())
      .then(data => (data || []).map(a => ({ id: 'dev_' + a.id, title: a.title, url: a.url, source: 'DEV.to' })))
      .catch(() => []);

    // Fetch Hacker News top stories
    const hnPromise = fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(r => r.json())
      .then(ids => Promise.all(
        (ids || []).slice(0, 4).map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
        )
      ))
      .then(items => items.filter(i => i && i.title).map(i => ({ id: 'hn_' + i.id, title: i.title, url: i.url || `https://news.ycombinator.com/item?id=${i.id}`, source: 'Hacker News' })))
      .catch(() => []);

    Promise.all([devtoPromise, hnPromise]).then(([devArticles, hnArticles]) => {
      const all = [...curated, ...devArticles, ...hnArticles].filter(a => a.title && a.url);
      if (all.length > 0) setArticles(all);
    });
  }, []);

  useEffect(() => {
    if (articles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [articles.length]);

  if (articles.length === 0) {
    return (
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
        Loading latest tech updates...
      </div>
    );
  }

  const article = articles[currentIndex];
  const sourceColors = { 'Fireship': '#ff4500', 'DEV.to': '#00f5d4', 'Hacker News': '#ff6600' };
  const srcColor = sourceColors[article.source] || '#00f5d4';

  return (
    <div style={{ overflow: 'hidden', width: '90%', maxWidth: 650, margin: '1.5rem auto 0', position: 'relative', zIndex: 5 }}>
      <AnimatePresence mode="wait">
        <motion.a
          key={article.id}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '0.75rem 1rem', textDecoration: 'none',
            background: isPink ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.03)',
            border: isPink ? '1px solid rgba(255,182,193,0.5)' : `1px solid ${isHovered ? 'rgba(108,99,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 16,
            boxShadow: isHovered
              ? (isPink ? '0 4px 25px rgba(255,105,180,0.3)' : '0 4px 25px rgba(108,99,255,0.3)')
              : (isPink ? '0 4px 15px rgba(255,105,180,0.1)' : '0 4px 15px rgba(0,0,0,0.2)'),
            cursor: 'pointer', textAlign: 'left',
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: isPink ? 'linear-gradient(135deg, #ff1493, #ffb6c1)' : `linear-gradient(135deg, ${srcColor}, #00b4d8)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', boxShadow: `0 0 10px ${srcColor}44`
          }}>
            {article.source === 'Fireship' ? '🔥' : article.source === 'Hacker News' ? '🟠' : '📰'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ color: isPink ? '#ff1493' : srcColor, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              {article.source} · CLICK TO READ ↗
            </p>
            <p style={{ 
              color: isPink ? '#5c454f' : 'rgba(255,255,255,0.9)', 
              fontSize: '1.05rem', fontWeight: 600, margin: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
            }}>
              {article.title}
            </p>
          </div>
          <div style={{
            width: 24, height: 24, borderRadius: 6, flexShrink: 0,
            background: 'rgba(255,255,255,0.08)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem'
          }}>↗</div>
        </motion.a>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTile, setActiveTile] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [themeAnim, setThemeAnim] = useState(null);
  const [messages, setMessages] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [showInbox, setShowInbox] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [waterQueue, setWaterQueue] = useState([]);
  const [waterPopupIndex, setWaterPopupIndex] = useState(-1); // -1 = no popup
  const [showCommunity, setShowCommunity] = useState(false);
  const [lastReadId, setLastReadId] = useState(localStorage.getItem('lastReadMessageId') || null);
  const [dailyScore, setDailyScore] = useState(0);
  const [quoteData, setQuoteData] = useState({ visible: false, text: '' });
  const [sosStatus, setSosStatus] = useState('idle'); // 'idle' | 'locating' | 'sending' | 'sent' | 'error'
  const waterTimerRef = useRef(null);
  const launchTimerRef = useRef(null);
  const [loadingTransition, setLoadingTransition] = useState(null);

  useEffect(() => {
    checkSession().then(hasSession => setIsAuthenticated(hasSession));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5001/api/messages')
      .then(r => r.json())
      .then(data => setMessages(data))
      .catch(() => {});

    fetch('http://localhost:5001/api/students')
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) {
          setStudentName(data[0].name);
          setStudentDept(data[0].grade || data[0].subjects?.[0] || 'General');
        }
      })
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

  // ── Record activity for sleep detection ──────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    recordActivity();
    requestNotificationPermission();

    // Award login bonus and load today's score
    awardLoginBonus();
    setDailyScore(getDailyScore());

    // Check if day should be finalized (6 PM IST)
    checkDayEnd();
    const scoreInterval = setInterval(() => {
      checkDayEnd();
      setDailyScore(getDailyScore());
    }, 60 * 1000); // check every minute

    // On focus, record activity
    const onFocus = () => recordActivity();
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      clearInterval(scoreInterval);
    };
  }, [isAuthenticated]);

  // ── Water reminder: check missed hours on mount + hourly live timer ────────
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check for missed reminders from when app was closed
    const missed = getMissedWaterReminders();
    if (missed.length > 0) {
      setWaterQueue(missed);
      setWaterPopupIndex(0);
      ackWater(); // reset the ack timer from now
    }

    // Live hourly timer while app is open
    waterTimerRef.current = setInterval(() => {
      setWaterQueue([{ hour: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }), timestamp: Date.now() }]);
      setWaterPopupIndex(0);
      ackWater();
      sendWaterNotification();
    }, 60 * 60 * 1000);

    return () => {
      if (waterTimerRef.current) clearInterval(waterTimerRef.current);
    };
  }, [isAuthenticated]);

  // ── Daily Quote Random Timer ───────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const showRandomQuote = () => {
      const randomQuote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
      setQuoteData({ visible: true, text: randomQuote });
      
      setTimeout(() => {
        setQuoteData(prev => ({ ...prev, visible: false }));
      }, 5000);
    };

    const initialTimer = setTimeout(showRandomQuote, 2000);
    const intervalTimer = setInterval(showRandomQuote, 30 * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [isAuthenticated]);

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

  const sendSOS = async (latitude, longitude, accuracy) => {
    setSosStatus('sending');
    try {
      const res = await fetch('http://localhost:5001/api/emergencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentName || 'Unknown Student',
          department: studentDept || 'Unknown Dept',
          latitude: latitude || null,
          longitude: longitude || null,
          accuracy: accuracy || null,
        })
      });
      if (!res.ok) throw new Error('Server error');
      setSosStatus('sent');
      setTimeout(() => setSosStatus('idle'), 4000);
    } catch {
      setSosStatus('error');
      setTimeout(() => setSosStatus('idle'), 4000);
    }
  };

  const handleSOS = () => {
    playNormalClick();
    if (sosStatus === 'locating' || sosStatus === 'sending') return;

    if (!navigator.geolocation) {
      // No geolocation — send without coords
      sendSOS(null, null, null);
      return;
    }

    setSosStatus('locating');
    const geoTimeout = setTimeout(() => {
      // GPS timed out — send without coords anyway
      sendSOS(null, null, null);
    }, 8000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(geoTimeout);
        const { latitude, longitude, accuracy } = position.coords;
        sendSOS(latitude, longitude, accuracy);
      },
      () => {
        clearTimeout(geoTimeout);
        // Location denied — send without coords
        sendSOS(null, null, null);
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
    );
  };

  const ActiveComponent = activeTile ? TILE_MAP[activeTile] : null;
  const handleTileSelect = (tileId) => {
    const reveal = TILE_REVEAL_MAP[tileId] || 'ripple';
    const label = TILES_LABELS[tileId] || 'module';
    setLoadingTransition({ reveal, label });
    if (launchTimerRef.current) clearTimeout(launchTimerRef.current);
    launchTimerRef.current = setTimeout(() => {
      setActiveTile(tileId);
      setLoadingTransition(null);
    }, 520);
  };

  useEffect(() => {
    return () => {
      if (launchTimerRef.current) clearTimeout(launchTimerRef.current);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AnimatePresence>
        {themeAnim && <ThemeTransitionOverlay fromTheme={themeAnim} />}
      </AnimatePresence>
      
      {!isAuthenticated ? (
        <Login onLogin={() => setIsAuthenticated(true)} theme={theme} />
      ) : (
        <>
          <VoiceAssistant theme={theme} />
          {/* Top bar */}
          <header className="glass app-header" style={{
        padding: '0.6rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div className="flex items-center">
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '2rem',
            padding: '0.4rem 0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            cursor: 'default',
          }}>
            <AxiomLogo theme={theme} />
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2" style={{ flexWrap: 'nowrap' }}>
          <button
              onClick={handleSOS}
              className="btn-3d-glass"
              disabled={sosStatus === 'locating' || sosStatus === 'sending'}
              style={{
                background: sosStatus === 'sent'
                  ? 'rgba(16,185,129,0.2)'
                  : sosStatus === 'error'
                  ? 'rgba(239,68,68,0.2)'
                  : 'rgba(255,50,50,0.1)',
                borderColor: sosStatus === 'sent'
                  ? 'rgba(16,185,129,0.5)'
                  : sosStatus === 'error'
                  ? 'rgba(239,68,68,0.5)'
                  : 'rgba(255,50,50,0.4)',
                boxShadow: '0 0 15px rgba(255,50,50,0.2)',
                minWidth: 32,
                position: 'relative',
              }}
              title={sosStatus === 'locating' ? 'Getting location...' : sosStatus === 'sending' ? 'Sending SOS...' : sosStatus === 'sent' ? 'SOS Sent!' : sosStatus === 'error' ? 'Failed - retry' : 'Send SOS Alert'}
            >
              {sosStatus === 'locating' || sosStatus === 'sending' ? (
                <span style={{ fontSize: '0.75rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
              ) : sosStatus === 'sent' ? (
                <span style={{ fontSize: '0.85rem' }}>✅</span>
              ) : sosStatus === 'error' ? (
                <span style={{ fontSize: '0.85rem' }}>❌</span>
              ) : (
                <AlertTriangle id="sos-btn-icon" size={16} color="#ff3333" />
              )}
            </button>
          <button
            onClick={() => setShowMusic(!showMusic)}
            className="btn-3d-glass"
          >
            <Headphones size={16} />
          </button>
          <button
            onClick={openInbox}
            className="btn-3d-glass"
            style={{ position: 'relative' }}
          >
            <Mail size={16} />
            {hasUnread && (
              <span 
                className="animate-pulse"
                style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 8, height: 8, borderRadius: '50%',
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
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={async () => {
              await signOut();
              setIsAuthenticated(false);
            }}
            className="btn-3d-glass"
          >
            <LogOut size={16} />
          </button>
          <span className="header-date" style={{ color: 'var(--text-muted, rgba(255,255,255,0.3))', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
            {new Date().toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })}
          </span>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs header-admin-link"
            style={{ textDecoration:'none', padding:'0.4rem 0.9rem', whiteSpace: 'nowrap' }}
          >
            Admin →
          </a>
        </div>
      </header>

      {/* Hero section */}
      <section style={{
        textAlign: 'center',
        padding: 'clamp(1.25rem, 4vw, 3rem) 1rem clamp(0.5rem, 2vw, 1rem)',
        position: 'relative',
      }}>
        {/* Daily Score Badge */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            position: 'absolute',
            top: '1rem',
            left: 'max(1rem, env(safe-area-inset-left))',
            display: 'flex', alignItems: 'center', gap: 6,
            background: theme === 'pink' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.4rem 0.8rem',
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 5,
          }}
        >
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
            fontWeight: 800,
            color: dailyScore >= 0
              ? (theme === 'pink' ? '#ff1493' : '#00f5d4')
              : '#ef4444',
            textShadow: dailyScore >= 0
              ? (theme === 'pink' ? '0 0 8px rgba(255,20,147,0.4)' : '0 0 8px rgba(0,245,212,0.4)')
              : '0 0 8px rgba(239,68,68,0.4)',
            letterSpacing: '0.02em',
          }}>
            {dailyScore >= 0 ? '+' : ''}{dailyScore}
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>XP</span>
        </motion.div>

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
          <p className="text-sm font-semibold mb-2" style={{ color: '#6c63ff', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {studentName ? studentName : 'WELCOME BACK'}
          </p>
          <h2 className="gradient-text font-black" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '0.75rem' }}>
            Your Smart<br />Learning Dashboard
          </h2>
          <TechNewsBanner theme={theme} />
        </motion.div>
      </section>

      {/* Kinetic chain */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 0 clamp(1rem, 3vw, 4rem)',
        marginTop: 'clamp(-3rem, 8vw - 5rem, -1rem)',
        minHeight: '280px',
        overflow: 'hidden',
      }}>
        <KineticChain onSelect={handleTileSelect} theme={theme} themeAnim={themeAnim} />

        {/* Floating Daily Encouragement Quote */}
        <AnimatePresence>
          {quoteData.visible && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                bottom: 'clamp(70px, 10vw, 100px)',
                left: '50%',
                zIndex: 100,
                maxWidth: 'clamp(300px, 80vw, 600px)',
                width: 'max-content',
                padding: 'clamp(1rem, 3vw, 1.25rem) clamp(1.2rem, 4vw, 2rem)',
                textAlign: 'center',
                borderRadius: '24px',
                pointerEvents: 'none',
                ...(theme === 'pink' 
                  ? {
                      background: 'rgba(255, 20, 147, 0.08)',
                      boxShadow: '0 8px 30px rgba(255, 20, 147, 0.15)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    } 
                  : {
                      background: 'rgba(15, 15, 30, 0.4)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    })
              }}
            >
              <p style={{
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                lineHeight: 1.6,
                color: theme === 'pink' ? '#ff69b4' : 'rgba(255,255,255,0.9)',
                margin: 0,
                letterSpacing: '0.02em',
              }}>
                "{quoteData.text}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
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

      {/* Community Board floating button */}
      <motion.button
        onClick={() => setShowCommunity(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: 'clamp(16px, 4vw, 24px)', right: 'clamp(16px, 4vw, 24px)', zIndex: 50,
          width: 48, height: 48, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
          border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(108,99,255,0.35), 0 0 0 1px rgba(108,99,255,0.2)',
        }}
      >
        <Users size={20} color="white" strokeWidth={2.5} />
      </motion.button>

      {/* Active tile modal */}
      <AnimatePresence>
        {loadingTransition && (
          <ActionLoadingOverlay
            theme={theme}
            reveal={loadingTransition.reveal}
            label={loadingTransition.label}
          />
        )}
        {ActiveComponent && (
          <ActiveComponent onClose={() => setActiveTile(null)} />
        )}
        {showInbox && (
          <InboxModal messages={messages} onClose={() => setShowInbox(false)} theme={theme} />
        )}
        {showMusic && (
          <MusicWidget onClose={() => setShowMusic(false)} theme={theme} />
        )}
        {showCommunity && (
          <CommunityBoard
            onClose={() => setShowCommunity(false)}
            studentName={studentName}
            studentDept={studentDept}
          />
        )}
        {waterPopupIndex >= 0 && waterPopupIndex < waterQueue.length && (
          <motion.div
            key={`water-popup-${waterPopupIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <motion.div
              key={waterPopupIndex}
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, rgba(15,15,40,0.98), rgba(10,10,30,0.98))',
                border: '1px solid rgba(59,130,246,0.5)',
                borderRadius: 24, padding: '2.5rem 2rem',
                textAlign: 'center', maxWidth: 380, width: '90vw',
                boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 60px rgba(59,130,246,0.2)'
              }}
            >
              <motion.div
                animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1 }}
              >
                💧
              </motion.div>
              {waterQueue.length > 1 && (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  REMINDER {waterPopupIndex + 1} OF {waterQueue.length}
                </p>
              )}
              <h2 style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                Did you drink water?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Around <strong style={{ color: '#60a5fa' }}>{waterQueue[waterPopupIndex]?.hour}</strong>, did you have a glass of water?
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    addWater();
                    addScore('water_logged');
                    setDailyScore(getDailyScore());
                    if (waterPopupIndex + 1 < waterQueue.length) {
                      setWaterPopupIndex(waterPopupIndex + 1);
                    } else {
                      setWaterPopupIndex(-1);
                      setWaterQueue([]);
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none', borderRadius: 14, padding: '0.75rem 1.8rem',
                    color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(16,185,129,0.4)',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}
                >
                  <Check size={18} /> Yes
                </button>
                <button
                  onClick={() => {
                    addScore('water_missed');
                    setDailyScore(getDailyScore());
                    if (waterPopupIndex + 1 < waterQueue.length) {
                      setWaterPopupIndex(waterPopupIndex + 1);
                    } else {
                      setWaterPopupIndex(-1);
                      setWaterQueue([]);
                    }
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14,
                    padding: '0.75rem 1.8rem',
                    color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}
                >
                  <X size={18} /> No
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
    </div>
  );
}
