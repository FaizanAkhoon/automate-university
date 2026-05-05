import { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform, useAnimationFrame, AnimatePresence, useMotionValue } from 'framer-motion';
import {
  BookOpen, User, Heart, PlayCircle, Timer, Calculator, Sparkles, Layers
} from 'lucide-react';
import { playDropSound } from '../utils/sound';

const TILES = [
  { id: 'notes',    label: 'Notes Summarizer',  icon: BookOpen,   color: '#6c63ff', glow: 'rgba(108,99,255,0.8)' },
  { id: 'student',  label: 'Student Info',        icon: User,       color: '#a855f7', glow: 'rgba(168,85,247,0.8)' },
  { id: 'health',   label: 'Health Tracker',      icon: Heart,      color: '#ec4899', glow: 'rgba(236,72,153,0.8)' },
  { id: 'youtube',  label: 'YouTube Channels',    icon: PlayCircle, color: '#ef4444', glow: 'rgba(239,68,68,0.8)'  },
  { id: 'timer',    label: 'Study Timer',         icon: Timer,      color: '#00f5d4', glow: 'rgba(0,245,212,0.8)'  },
  { id: 'calc',     label: 'Calculator',          icon: Calculator, color: '#f59e0b', glow: 'rgba(245,158,11,0.8)' },
];

const ITEM_COUNT = TILES.length;
const STEP = (2 * Math.PI) / ITEM_COUNT;

const ANIMATION_MODES = [
  { id: 'orbital',  label: 'Orbital Ring' },
  { id: 'vertical', label: 'Vertical Wheel' },
  { id: 'infinity', label: 'Infinity Wave' },
];

// --- 120 FPS Universal Tile ---
function UniversalTile({ tile, x, y, z, zRange, onSelect, theme }) {
  const isPink = theme === 'pink';
  const Icon = tile.icon;
  
  const zNorm = useTransform(z, zv => (zv + zRange) / (2 * zRange));
  const scale = useTransform(zNorm, zn => 0.6 + zn * 0.55);
  const opacity = useTransform(zNorm, zn => 0.15 + zn * 0.85);
  const blurValue = useTransform(zNorm, zn => (1 - zn) * 8);
  const filter = useTransform(blurValue, b => `blur(${b}px)`);

  const boxShadow = useTransform(z, zv => zv > 0 
    ? `0 20px 50px rgba(0,0,0,${isPink ? '0.1' : '0.6'}), inset 0 1px 2px rgba(255,255,255,${isPink ? '0.6' : '0.2'}), 0 0 50px ${tile.glow.replace('0.8', isPink ? '0.5' : '0.3')}`
    : `0 4px 20px rgba(0,0,0,${isPink ? '0.05' : '0.3'}), inset 0 1px 1px rgba(255,255,255,${isPink ? '0.2' : '0.05'})`);

  const edgeOpacity = useTransform(z, zv => zv > 0 ? 0.8 : 0.2);
  const shadowOpacity = useTransform(z, zv => zv > 0 ? 1 : 0.2);
  const iconShadow = useTransform(z, zv => zv > 0 ? `0 0 15px ${tile.color}44` : 'none');
  const textShadow = useTransform(z, zv => {
    if (!isPink && zv > 0) return '0 2px 10px rgba(0,0,0,0.8)';
    return 'none';
  });

  const bgDefault = isPink 
    ? `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.01))`
    : `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.005))`;
  const bgHover = isPink
    ? `linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05))`
    : `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))`;
  
  const borderDefault = isPink ? `1px solid rgba(255,255,255,0.4)` : `1px solid rgba(255,255,255,0.15)`;
  const borderHover = isPink ? `1px solid rgba(255,255,255,0.8)` : `1px solid rgba(255,255,255,0.4)`;

  return (
    <motion.button
      onClick={() => onSelect(tile.id)}
      style={{
        position: 'absolute', left: '50%', top: '50%',
        marginLeft: -130, marginTop: -42,
        x, y, z, scale, opacity, filter, boxShadow,
        width: 260, height: 84,
        background: bgDefault,
        border: borderDefault,
        backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '1.5rem', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1.5rem',
        color: isPink ? '#333' : 'white', fontFamily: 'Inter, sans-serif', fontWeight: 600,
        fontSize: '1rem', letterSpacing: '0.02em',
        transition: 'background 0.6s cubic-bezier(0.16, 1, 0.3, 1), border 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        outline: 'none',
      }}
      whileHover={{ scale: 1.05, background: bgHover, border: borderHover }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(tile.id)}
      aria-label={`Open ${tile.label}`}
    >
      <motion.div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: `linear-gradient(90deg, transparent, ${tile.color}, transparent)`, opacity: edgeOpacity }} />
      <motion.span
        style={{
          width: 48, height: 48, borderRadius: '1rem',
          background: `linear-gradient(135deg, ${tile.color}33, ${tile.color}11)`, border: `1px solid ${tile.color}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: iconShadow
        }}
      >
        <Icon size={24} color={tile.color} strokeWidth={2} />
      </motion.span>
      <motion.span style={{ textAlign: 'left', lineHeight: 1.2, textShadow }}>{tile.label}</motion.span>
      <motion.span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: tile.color, boxShadow: `0 0 10px ${tile.color}`, opacity: shadowOpacity }} />
    </motion.button>
  );
}

// ─── LAYOUT 1: ORBITAL RING ──────────────────────────────────────────────────
function OrbitalSpoke({ index, springAngle }) {
  const angle = useTransform(springAngle, v => v + index * STEP);
  const x2 = useTransform(angle, a => Math.sin(a) * 320);
  const y2 = useTransform(angle, a => Math.cos(a) * 60);
  const z = useTransform(angle, a => Math.cos(a) * 220);
  const opacity = useTransform(z, zv => zv > 0 ? 0.25 : 0.05);

  return <motion.line x1="0" y1="0" x2={x2} y2={y2} stroke="url(#ring-grad)" strokeWidth="1" style={{ opacity }} />;
}

function OrbitalLayout({ springAngle, onSelect, theme }) {
  const isPink = theme === 'pink';
  const RADIUS_X = 320, RADIUS_Z = 220, TILT_Y = 60;
  
  return (
    <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, transform: 'translateZ(-50px)' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 500" style={{ overflow: 'visible' }}>
          <defs>
            <filter id="soft-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isPink ? "rgba(255,140,0,0.4)" : "rgba(108,99,255,0.4)"} />
              <stop offset="50%" stopColor={isPink ? "rgba(255,234,0,0.3)" : "rgba(0,245,212,0.1)"} />
              <stop offset="100%" stopColor={isPink ? "rgba(255,105,180,0.4)" : "rgba(168,85,247,0.4)"} />
            </linearGradient>
          </defs>
          <g transform="translate(400, 250)">
            <ellipse cx="0" cy="0" rx={RADIUS_X + 40} ry={Math.abs(TILT_Y) + 10} fill="none" stroke={isPink ? "rgba(255,105,180,0.1)" : "rgba(255,255,255,0.03)"} strokeWidth="1" strokeDasharray="4 8" />
            <ellipse cx="0" cy="0" rx={RADIUS_X} ry={Math.abs(TILT_Y)} fill="none" stroke="url(#ring-grad)" strokeWidth="3" filter="url(#soft-glow)" />
            <ellipse cx="0" cy="0" rx={RADIUS_X} ry={Math.abs(TILT_Y)} fill="none" stroke={isPink ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)"} strokeWidth="1" />
            <ellipse cx="0" cy="0" rx={RADIUS_X - 30} ry={Math.abs(TILT_Y) - 5} fill="none" stroke={isPink ? "rgba(255,140,0,0.2)" : "rgba(0,245,212,0.15)"} strokeWidth="1" strokeDasharray="2 6" />
            {TILES.map((_, i) => <OrbitalSpoke key={`spoke-${i}`} index={i} springAngle={springAngle} />)}
          </g>
        </svg>
      </div>

      {TILES.map((tile, i) => {
        const angle = useTransform(springAngle, v => v + i * STEP);
        const x = useTransform(angle, a => Math.sin(a) * RADIUS_X);
        const y = useTransform(angle, a => Math.cos(a) * TILT_Y);
        const z = useTransform(angle, a => Math.cos(a) * RADIUS_Z);
        return <UniversalTile key={tile.id} tile={tile} x={x} y={y} z={z} zRange={RADIUS_Z} onSelect={onSelect} theme={theme} />;
      })}
    </div>
  );
}

// ─── LAYOUT 2: VERTICAL WHEEL ────────────────────────────────────────────────
function VerticalLayout({ springAngle, onSelect, theme }) {
  const isPink = theme === 'pink';
  const RADIUS_Z = 220, VERTICAL = 150;
  return (
    <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, transform: 'translateZ(-50px)' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 500" style={{ overflow: 'visible' }}>
          <line x1="400" y1="50" x2="400" y2="450" stroke={isPink ? "rgba(255,105,180,0.4)" : "rgba(168,85,247,0.4)"} strokeWidth="2" strokeDasharray="6 8" />
          <line x1="390" y1="50" x2="390" y2="450" stroke={isPink ? "rgba(255,105,180,0.1)" : "rgba(255,255,255,0.05)"} strokeWidth="1" />
          <line x1="410" y1="50" x2="410" y2="450" stroke={isPink ? "rgba(255,105,180,0.1)" : "rgba(255,255,255,0.05)"} strokeWidth="1" />
        </svg>
      </div>
      {TILES.map((tile, i) => {
        const angle = useTransform(springAngle, v => v + i * STEP);
        const x = useTransform(angle, a => 0); 
        const y = useTransform(angle, a => Math.sin(a) * VERTICAL);
        const z = useTransform(angle, a => Math.cos(a) * RADIUS_Z);
        return <UniversalTile key={tile.id} tile={tile} x={x} y={y} z={z} zRange={RADIUS_Z} onSelect={onSelect} theme={theme} />;
      })}
    </div>
  );
}

// ─── LAYOUT 3: INFINITY WAVE ─────────────────────────────────────────────────
function InfinityLayout({ springAngle, onSelect, theme }) {
  const isPink = theme === 'pink';
  const RADIUS_X = 350, RADIUS_Y = 120, RADIUS_Z = 220;
  return (
    <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, transform: 'translateZ(-50px)' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 500" style={{ overflow: 'visible' }}>
          <g transform="translate(400, 250)">
            <path 
              d="M -180,0 C -180,-150 0,-150 0,0 C 0,150 180,150 180,0 C 180,-150 0,-150 0,0 C 0,150 -180,150 -180,0 Z" 
              fill="none" 
              stroke={isPink ? "rgba(255,140,0,0.3)" : "rgba(0,245,212,0.2)"} 
              strokeWidth="2" 
              strokeDasharray="10 15" 
            />
          </g>
        </svg>
      </div>
      {TILES.map((tile, i) => {
        const angle = useTransform(springAngle, v => v + i * STEP);
        const x = useTransform(angle, a => Math.sin(a) * RADIUS_X);
        const y = useTransform(angle, a => Math.sin(a * 2) * RADIUS_Y); 
        const z = useTransform(angle, a => Math.cos(a) * RADIUS_Z);
        return <UniversalTile key={tile.id} tile={tile} x={x} y={y} z={z} zRange={RADIUS_Z} onSelect={onSelect} theme={theme} />;
      })}
    </div>
  );
}


// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function KineticChain({ onSelect, theme, themeAnim }) {
  const isPink = theme === 'pink';
  const targetAngle = useRef(0);
  const currentSlot = useRef(0);
  const [modeIdx, setModeIdx] = useState(0);
  const mode = ANIMATION_MODES[modeIdx];
  const containerRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  
  // Parallax Mouse Tracking
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  // Dynamic scale: measure container, fit the 800px logical width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const newScale = Math.min(w / 800, 1);
        setScaleFactor(newScale);
        // Auto-switch to vertical on narrow screens
        if (w < 520) {
          setModeIdx(1); // vertical
        }
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const rawTiltX = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [8, -8]);
  const rawTiltY = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-8, 8]);
  const tiltX = useSpring(rawTiltX, { stiffness: 150, damping: 30 });
  const tiltY = useSpring(rawTiltY, { stiffness: 150, damping: 30 });
  
  const springAngle = useSpring(0, { stiffness: 40, damping: 14, mass: 1.5 });

  // Handle scroll → rotate chain
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      targetAngle.current += e.deltaY * 0.004;
      springAngle.set(targetAngle.current);
    };
    
    let startY = 0;
    const onTouchStart = (e) => startY = e.touches[0].clientY;
    const onTouchMove = (e) => {
      e.preventDefault();
      const dy = startY - e.touches[0].clientY;
      targetAngle.current += dy * 0.01;
      springAngle.set(targetAngle.current);
      startY = e.touches[0].clientY;
    };

    const container = document.getElementById('kinetic-container');
    if (container) {
      container.addEventListener('wheel', onWheel, { passive: false });
      container.addEventListener('touchstart', onTouchStart, { passive: false });
      container.addEventListener('touchmove', onTouchMove, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', onWheel);
        container.removeEventListener('touchstart', onTouchStart);
        container.removeEventListener('touchmove', onTouchMove);
      }
    };
  }, [springAngle]);

  useAnimationFrame(() => {
    targetAngle.current += 0.001; 
    springAngle.set(targetAngle.current);

    const newSlot = Math.floor(targetAngle.current / STEP);
    if (newSlot !== currentSlot.current) {
      currentSlot.current = newSlot;
      playDropSound();
    }
  });

  const renderLayout = () => {
    switch (mode.id) {
      case 'orbital':  return <OrbitalLayout springAngle={springAngle} onSelect={onSelect} theme={theme} />;
      case 'vertical': return <VerticalLayout springAngle={springAngle} onSelect={onSelect} theme={theme} />;
      case 'infinity': return <InfinityLayout springAngle={springAngle} onSelect={onSelect} theme={theme} />;
      default: return null;
    }
  };

  return (
    <div
      id="kinetic-container"
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full h-full select-none cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none', padding: '1rem 0' }}
    >
      {/* View Mode Toggle */}
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 50 }}>
        <button
          onClick={() => setModeIdx((m) => (m + 1) % ANIMATION_MODES.length)}
          className="btn-3d-glass"
        >
          <Layers size={18} />
        </button>
      </div>

      {/* Sizing shell — collapses to match scaled height so layout flows correctly */}
      <div style={{ width: 800 * scaleFactor, height: 500 * scaleFactor, position: 'relative', flexShrink: 0 }}>
        {/* Perspective wrapper — scales down for smaller screens */}
        <motion.div
          style={{
            perspective: '1400px',
            perspectiveOrigin: '50% 30%',
            width: 800,
            height: 500,
            position: 'absolute',
            top: 0,
            left: 0,
            transformStyle: 'preserve-3d',
            rotateX: tiltX,
            rotateY: tiltY,
            scale: scaleFactor,
            transformOrigin: 'top left',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, rotateY: 90, scale: 0.85 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 220, damping: 25, mass: 1.1 }}
              style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              {renderLayout()}
            </motion.div>
          </AnimatePresence>

          {/* Central Holographic Core / Magical Heart */}
          <motion.div
            id="center-ball-core"
            style={{
              position: 'absolute', left: '50%', top: '50%',
              marginLeft: -60, marginTop: -60,
              width: 120, height: 120, borderRadius: '50%',
              background: (isPink && themeAnim !== 'dark') ? 'radial-gradient(circle, rgba(255,105,180,0.3) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)',
              boxShadow: (isPink && themeAnim !== 'dark') ? '0 0 60px rgba(255,182,193,0.6), inset 0 0 40px rgba(255,105,180,0.6)' : '0 0 40px rgba(0,245,212,0.3), inset 0 0 30px rgba(108,99,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'translateZ(0px)',
              zIndex: 10000,
              transition: 'all 0.5s ease-in-out'
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {(isPink && themeAnim !== 'dark') ? (
              <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                {/* Intricate detailed 2D line-art rose head */}
                <svg
                  width="64" height="64" viewBox="0 0 42 42"
                  fill="none"
                  style={{ filter: 'drop-shadow(0 0 15px rgba(255,20,147,0.9)) drop-shadow(0 0 25px rgba(255,105,180,0.7))' }}
                >
                  {/* Core Swirl */}
                  <path d="M 21 22 C 22 22, 23 21, 23 20 C 23 18, 20 18, 19 20 C 18 22, 21 24, 24 23 C 26 21, 25 17, 22 16" stroke="#ff1493" strokeWidth="1.2" strokeLinecap="round" />
                  
                  {/* Inner Petals */}
                  <path d="M 18 19 C 16 15, 22 13, 26 16 C 29 19, 28 25, 24 27 C 19 29, 14 26, 14 21" stroke="#ff1493" strokeWidth="1.5" strokeLinecap="round" />
                  
                  {/* Mid Petals */}
                  <path d="M 16 15 C 11 11, 20 5, 29 10 C 35 15, 36 24, 30 30 C 24 36, 12 34, 8 26 C 5 19, 9 12, 15 11" stroke="#ff1493" strokeWidth="1.8" strokeLinecap="round" />

                  {/* Outer Petals */}
                  <path d="M 20 8 C 28 3, 38 9, 39 19" stroke="#ff1493" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 36 25 C 38 34, 29 42, 19 40" stroke="#ff1493" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 13 38 C 4 35, 1 24, 5 16" stroke="#ff1493" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 5 16 C 7 10, 13 6, 20 8" stroke="#ff1493" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Detail crease lines inside petals */}
                  <path d="M 21 16 Q 24 14 26 16" stroke="#ff1493" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                  <path d="M 14 21 Q 12 18 16 15" stroke="#ff1493" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                  <path d="M 24 27 Q 28 27 30 22" stroke="#ff1493" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                  <path d="M 25 36 Q 28 32 29 27" stroke="#ff1493" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                  <path d="M 13 31 Q 10 28 9 22" stroke="#ff1493" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                  <path d="M 13 13 Q 16 9 22 9" stroke="#ff1493" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                </svg>
              </motion.div>
            ) : (
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: '#00f5d4',
                boxShadow: '0 0 20px #00f5d4, 0 0 40px #6c63ff',
                transition: 'all 0.5s ease-in-out'
              }} />
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Interactive hints */}
      <div
        className="kinetic-hint"
        style={{
          marginTop: '0.75rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          opacity: 0.6, fontSize: '0.75rem', color: isPink ? '#ff1493' : 'rgba(255,255,255,0.7)',
          pointerEvents: 'none', userSelect: 'none', letterSpacing: '0.05em',
          textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={12} color={isPink ? '#ff1493' : '#00f5d4'} />
          Scroll or swipe to explore
          <Sparkles size={12} color={isPink ? '#ff1493' : '#a855f7'} />
        </span>
      </div>
    </div>
  );
}

