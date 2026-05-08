import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, ShieldCheck, ArrowRight, User, AlertCircle,
  Phone, BookOpen, FileText, Eye, EyeOff, CheckCircle2, Loader2, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { signInWithEmail, signUpWithEmail } from '../utils/auth';
import { playNormalClick } from '../utils/sound';

const GRADES = [
  '7th','8th','9th','10th','11th','12th',
  'College 1st Year','College 2nd Year','College 3rd Year','College 4th Year'
];

// Orb that floats around
function GlowOrb({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

// Step indicator pill
function StepDot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <motion.div
      animate={{ scale: active ? 1.2 : 1, opacity: done || active ? 1 : 0.3 }}
      style={{
        width: done ? 24 : active ? 8 : 6,
        height: 6,
        borderRadius: 99,
        background: done
          ? 'linear-gradient(135deg, #10b981, #00f5d4)'
          : active
          ? 'linear-gradient(135deg, #6c63ff, #a855f7)'
          : 'rgba(255,255,255,0.2)',
        transition: 'all 0.4s ease',
      }}
    />
  );
}

export default function Login({ onLogin, theme }: { onLogin: () => void; theme: string }) {
  const isPink = theme === 'pink';

  type Mode = 'signin' | 'signup' | 'setup_profile';
  const [mode, setMode] = useState<Mode>('signin');
  const [step, setStep] = useState(0); // 0=auth, 1=profile

  // Auth fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Profile fields
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ── helpers ──────────────────────────────────────────────────────────────────
  const accentColor = isPink ? '#ec4899' : '#a855f7';
  const accentGlow = isPink ? 'rgba(236,72,153,' : 'rgba(168,85,247,';

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 0.9rem 0.85rem 2.75rem',
    borderRadius: 14,
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'all 0.25s ease',
    background: isPink ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
    color: isPink ? '#1a1a2e' : 'white',
  };

  const getInputStyle = (id: string): React.CSSProperties => ({
    ...inputBase,
    border: focused === id
      ? `1.5px solid ${accentColor}`
      : isPink
      ? '1.5px solid rgba(0,0,0,0.08)'
      : '1.5px solid rgba(255,255,255,0.08)',
    boxShadow: focused === id
      ? `0 0 0 3px ${accentGlow}0.12), 0 0 16px ${accentGlow}0.08)`
      : 'none',
  });

  const switchMode = (m: 'signin' | 'signup') => {
    playNormalClick();
    setMode(m);
    setErrorMsg(null);
    setSuccessMsg(null);
    setStep(0);
  };

  // ── submission ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playNormalClick();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Client-side validation
    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (mode !== 'setup_profile' && password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'setup_profile') {
        // Save profile to backend
        const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.put(`${API}/api/student`, {
          name, email, phone, grade, bio,
          subjects: [], gpa: '0.0',
        }, { withCredentials: true });
        setSuccessMsg('Profile saved! Entering dashboard...');
        setTimeout(() => onLogin(), 800);
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
        setSuccessMsg('Account created! Now set up your profile.');
        setTimeout(() => { setMode('setup_profile'); setStep(1); }, 700);
      } else {
        await signInWithEmail(email, password);
        setSuccessMsg('Welcome back! Loading dashboard...');
        setTimeout(() => onLogin(), 600);
      }
    } catch (err: any) {
      const msg = err?.message || 'Something went wrong. Please try again.';
      // Make error messages more human-friendly
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credentials')) {
        setErrorMsg('Incorrect email or password. Please try again.');
      } else if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists')) {
        setErrorMsg('An account with this email already exists. Try signing in.');
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('failed')) {
        setErrorMsg('Cannot reach the server. Check your connection and try again.');
      } else {
        setErrorMsg(msg);
      }
    }
    setLoading(false);
  };

  // ── label helper ──────────────────────────────────────────────────────────────
  const Label = ({ text }: { text: string }) => (
    <p style={{
      fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', marginBottom: 6,
      color: isPink ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)',
    }}>{text}</p>
  );

  const IconWrap = ({ children, id }: { children: React.ReactNode; id: string }) => (
    <div style={{
      position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
      color: focused === id ? accentColor : (isPink ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)'),
      transition: 'color 0.25s ease', display: 'flex', pointerEvents: 'none',
    }}>{children}</div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      background: isPink
        ? 'linear-gradient(135deg, #fdf2f8, #fce7f3, #f3e8ff)'
        : 'linear-gradient(135deg, #06060e, #0d0a1a, #0a0d1f)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Orbs */}
      <GlowOrb style={{ width: 350, height: 350, top: '-100px', right: '-80px', background: isPink ? 'rgba(236,72,153,0.25)' : 'rgba(108,99,255,0.18)', animationDelay: '0s' }} />
      <GlowOrb style={{ width: 280, height: 280, bottom: '-60px', left: '-60px', background: isPink ? 'rgba(168,85,247,0.2)' : 'rgba(0,245,212,0.12)', animationDelay: '3s' }} />
      <GlowOrb style={{ width: 200, height: 200, top: '40%', left: '10%', background: isPink ? 'rgba(251,207,232,0.3)' : 'rgba(168,85,247,0.1)', animationDelay: '1.5s' }} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%', maxWidth: 440, position: 'relative', zIndex: 10,
          borderRadius: 28,
          background: isPink
            ? 'rgba(255,255,255,0.88)'
            : 'rgba(14,12,26,0.82)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: isPink
            ? '1.5px solid rgba(236,72,153,0.25)'
            : '1.5px solid rgba(255,255,255,0.1)',
          boxShadow: isPink
            ? '0 40px 80px rgba(236,72,153,0.15), 0 8px 30px rgba(0,0,0,0.08)'
            : '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(108,99,255,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Top gradient bar */}
        <div style={{
          height: 4, width: '100%',
          background: isPink
            ? 'linear-gradient(90deg, #ec4899, #a855f7, #06b6d4)'
            : 'linear-gradient(90deg, #6c63ff, #a855f7, #00f5d4)',
        }} />

        <div style={{ padding: '2rem 2rem 2.25rem' }}>

          {/* Step indicator (only during signup flow) */}
          {(mode === 'signup' || mode === 'setup_profile') && (
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: '1.5rem' }}>
              <StepDot active={step === 0} done={step > 0} />
              <StepDot active={step === 1} done={step > 1} />
            </div>
          )}

          {/* Tab switcher (only on signin/signup) */}
          {mode !== 'setup_profile' && (
            <div style={{
              display: 'flex', gap: 4, padding: 4, borderRadius: 16, marginBottom: '1.5rem',
              background: isPink ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)',
              border: isPink ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)',
            }}>
              {(['signin', 'signup'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  style={{
                    flex: 1, padding: '0.6rem', borderRadius: 12, border: 'none', cursor: 'pointer',
                    fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.25s ease',
                    background: mode === m
                      ? isPink ? 'white' : 'rgba(255,255,255,0.1)'
                      : 'transparent',
                    color: mode === m
                      ? accentColor
                      : isPink ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)',
                    boxShadow: mode === m
                      ? isPink ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                      : 'none',
                  }}
                >
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
          )}

          {/* Header icon + title */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              style={{
                width: 60, height: 60, borderRadius: 18, margin: '0 auto 1rem',
                background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 12px 30px rgba(108,99,255,0.4)',
                position: 'relative',
              }}
            >
              {mode === 'setup_profile'
                ? <User size={28} color="white" />
                : <ShieldCheck size={28} color="white" />}
              <Sparkles size={12} color="#ffffffcc" style={{ position: 'absolute', top: 6, right: 6 }} />
            </motion.div>
            <h1 style={{
              fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px',
              color: isPink ? '#1a1a2e' : 'white',
            }}>
              {mode === 'signin'
                ? 'Welcome Back 👋'
                : mode === 'setup_profile'
                ? 'Complete Your Profile'
                : 'Join the Portal 🚀'}
            </h1>
            <p style={{
              fontSize: '0.85rem', margin: 0,
              color: isPink ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
            }}>
              {mode === 'signin'
                ? 'Sign in to access your smart dashboard'
                : mode === 'setup_profile'
                ? 'One more step — tell us about yourself'
                : 'Create your student account in seconds'}
            </p>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  overflow: 'hidden',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1.5px solid rgba(239,68,68,0.3)',
                  borderRadius: 12, padding: '0.75rem',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}
              >
                <AlertCircle size={16} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: '0.85rem', color: '#f87171', margin: 0, fontWeight: 500 }}>{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success message */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  overflow: 'hidden',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1.5px solid rgba(16,185,129,0.3)',
                  borderRadius: 12, padding: '0.75rem',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                <p style={{ fontSize: '0.85rem', color: '#10b981', margin: 0, fontWeight: 500 }}>{successMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="on">
            <AnimatePresence mode="wait">

              {/* ── SETUP PROFILE STEP ──────────────────────────────────── */}
              {mode === 'setup_profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                >
                  {/* Phone */}
                  <div>
                    <Label text="Phone Number" />
                    <div style={{ position: 'relative' }}>
                      <IconWrap id="phone"><Phone size={16} /></IconWrap>
                      <input
                        type="tel" placeholder="+92 300 0000000"
                        value={phone} onChange={e => setPhone(e.target.value)}
                        onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                        style={getInputStyle('phone')}
                      />
                    </div>
                  </div>

                  {/* Grade */}
                  <div>
                    <Label text="Academic Grade" />
                    <div style={{ position: 'relative' }}>
                      <IconWrap id="grade"><BookOpen size={16} /></IconWrap>
                      <select
                        required value={grade} onChange={e => setGrade(e.target.value)}
                        onFocus={() => setFocused('grade')} onBlur={() => setFocused(null)}
                        style={{ ...getInputStyle('grade'), appearance: 'none' }}
                      >
                        <option value="" disabled>Select your grade...</option>
                        {GRADES.map(g => (
                          <option key={g} value={g}
                            style={{ background: isPink ? 'white' : '#1a1a2e', color: isPink ? '#1a1a2e' : 'white' }}
                          >{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <Label text="Short Bio / Goals" />
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: '0.85rem', top: '0.85rem',
                        color: focused === 'bio' ? accentColor : (isPink ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)'),
                        transition: 'color 0.25s', pointerEvents: 'none',
                      }}><FileText size={16} /></div>
                      <textarea
                        placeholder="I want to master algorithms and get into a top university..."
                        required value={bio} onChange={e => setBio(e.target.value)}
                        onFocus={() => setFocused('bio')} onBlur={() => setFocused(null)}
                        style={{ ...getInputStyle('bio'), minHeight: 90, resize: 'none', alignItems: undefined, paddingTop: '0.85rem' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── SIGNIN / SIGNUP FIELDS ───────────────────────────────── */}
              {mode !== 'setup_profile' && (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                >
                  {/* Name (signup only) */}
                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Label text="Full Name" />
                        <div style={{ position: 'relative' }}>
                          <IconWrap id="name"><User size={16} /></IconWrap>
                          <input
                            type="text" placeholder="Jane Doe"
                            value={name} onChange={e => setName(e.target.value)}
                            onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                            autoComplete="name"
                            style={getInputStyle('name')}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div>
                    <Label text="Email Address" />
                    <div style={{ position: 'relative' }}>
                      <IconWrap id="email"><Mail size={16} /></IconWrap>
                      <input
                        type="email" placeholder="student@university.edu" required
                        value={email} onChange={e => setEmail(e.target.value)}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                        autoComplete="email"
                        style={getInputStyle('email')}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <Label text="Password" />
                    <div style={{ position: 'relative' }}>
                      <IconWrap id="password"><Lock size={16} /></IconWrap>
                      <input
                        type={showPass ? 'text' : 'password'}
                        placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                        required
                        value={password} onChange={e => setPassword(e.target.value)}
                        onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                        style={{ ...getInputStyle('password'), paddingRight: '2.75rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(s => !s)}
                        style={{
                          position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                          color: isPink ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
                          display: 'flex',
                        }}
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {/* Password strength indicator for signup */}
                    {mode === 'signup' && password.length > 0 && (
                      <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                        {[1,2,3,4].map(level => (
                          <div key={level} style={{
                            flex: 1, height: 3, borderRadius: 99,
                            background: password.length >= level * 2
                              ? level <= 1 ? '#ef4444' : level <= 2 ? '#f59e0b' : level <= 3 ? '#10b981' : '#6c63ff'
                              : 'rgba(255,255,255,0.1)',
                            transition: 'all 0.3s ease',
                          }} />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -1 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              style={{
                width: '100%', marginTop: 20, padding: '0.95rem',
                borderRadius: 16, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading
                  ? (isPink ? 'rgba(236,72,153,0.5)' : 'rgba(108,99,255,0.5)')
                  : isPink
                  ? 'linear-gradient(135deg, #ec4899, #a855f7)'
                  : 'linear-gradient(135deg, #6c63ff, #a855f7)',
                color: 'white',
                fontWeight: 800, fontSize: '0.95rem', fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: loading
                  ? 'none'
                  : isPink
                  ? '0 12px 28px rgba(236,72,153,0.35)'
                  : '0 12px 28px rgba(108,99,255,0.35)',
                transition: 'all 0.25s ease',
              }}
            >
              {loading && <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />}
              {!loading && (
                mode === 'signin' ? 'Sign In'
                : mode === 'setup_profile' ? 'Complete Setup'
                : 'Create Account'
              )}
              {loading && (
                mode === 'signin' ? 'Signing In...'
                : mode === 'setup_profile' ? 'Saving Profile...'
                : 'Creating Account...'
              )}
              {!loading && <ArrowRight size={18} />}
            </motion.button>
          </form>

          {/* Footer hint */}
          <p style={{
            textAlign: 'center', marginTop: '1.25rem', fontSize: '0.78rem',
            color: isPink ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)',
          }}>
            {mode === 'signin'
              ? "Don't have an account? "
              : mode === 'setup_profile'
              ? 'Step 2 of 2 — almost done!'
              : 'Already have an account? '}
            {mode !== 'setup_profile' && (
              <button
                onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: accentColor, fontWeight: 700, fontSize: '0.78rem',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {mode === 'signin' ? 'Create one' : 'Sign in instead'}
              </button>
            )}
          </p>

        </div>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
