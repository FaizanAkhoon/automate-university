import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ChevronDown, Phone, BookOpen, FileText, Mail, Edit3, Check, X } from 'lucide-react';
import axios from 'axios';
import { signOut } from '../utils/auth';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AVATAR_EMOJIS = ['🦊','🐼','🦁','🐯','🐸','🦋','🦄','🐙','🦅','🐺','🦝','🦉'];

interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  grade?: string;
  bio?: string;
  avatar?: string;
}

export default function ProfileWidget({ theme, onSignOut }: { theme: string; onSignOut: () => void }) {
  const isPink = theme === 'pink';
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileData>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const accentColor = isPink ? '#ec4899' : '#a855f7';

  // Fetch profile on mount
  useEffect(() => {
    axios.get(`${API}/api/student`, { withCredentials: true })
      .then(r => { setProfile(r.data); setForm(r.data); })
      .catch(() => {});
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setEditing(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/api/student`, form, { withCredentials: true });
      setProfile(form);
      setSaved(true);
      setTimeout(() => { setSaved(false); setEditing(false); }, 1200);
    } catch {}
    setSaving(false);
  };

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    onSignOut();
  };

  const initials = profile.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const avatarBg = isPink
    ? 'linear-gradient(135deg, #ec4899, #f9a8d4)'
    : 'linear-gradient(135deg, #6c63ff, #a855f7)';

  const cardBg = isPink
    ? 'rgba(255,255,255,0.95)'
    : 'rgba(14,12,26,0.95)';

  const borderColor = isPink
    ? 'rgba(236,72,153,0.2)'
    : 'rgba(255,255,255,0.1)';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: isPink ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.06)',
    border: isPink ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '0.5rem 0.75rem',
    color: isPink ? '#1a1a2e' : 'white',
    fontSize: '0.82rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Avatar trigger button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => { setOpen(o => !o); setEditing(false); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0.35rem 0.6rem 0.35rem 0.35rem',
          borderRadius: 99,
          border: isPink ? '1.5px solid rgba(236,72,153,0.3)' : '1.5px solid rgba(255,255,255,0.12)',
          background: isPink ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
          boxShadow: open ? `0 0 0 3px ${isPink ? 'rgba(236,72,153,0.2)' : 'rgba(108,99,255,0.2)'}` : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: avatarBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: profile.avatar ? '1rem' : '0.7rem',
          fontWeight: 800, color: 'white',
          boxShadow: `0 0 12px ${isPink ? 'rgba(236,72,153,0.4)' : 'rgba(108,99,255,0.4)'}`,
          flexShrink: 0,
        }}>
          {profile.avatar || initials}
        </div>
        {/* Name — hide on very small screens */}
        <span style={{
          fontSize: '0.82rem', fontWeight: 600, maxWidth: 90,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: isPink ? '#1a1a2e' : 'white',
          display: 'var(--profile-name-display, block)',
        }}>
          {profile.name || 'My Profile'}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: isPink ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              width: 300, zIndex: 1000,
              background: cardBg,
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: `1.5px solid ${borderColor}`,
              borderRadius: 20,
              boxShadow: isPink
                ? '0 24px 50px rgba(236,72,153,0.15), 0 8px 20px rgba(0,0,0,0.1)'
                : '0 24px 50px rgba(0,0,0,0.5), 0 0 40px rgba(108,99,255,0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Top gradient bar */}
            <div style={{
              height: 3,
              background: isPink
                ? 'linear-gradient(90deg, #ec4899, #a855f7)'
                : 'linear-gradient(90deg, #6c63ff, #a855f7, #00f5d4)',
            }} />

            <div style={{ padding: '1.25rem' }}>
              {!editing ? (
                /* ── VIEW MODE ─────────────────────────────────────────── */
                <>
                  {/* Avatar + Name row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: avatarBg, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: profile.avatar ? '1.6rem' : '1rem',
                      fontWeight: 800, color: 'white',
                      boxShadow: `0 0 20px ${isPink ? 'rgba(236,72,153,0.4)' : 'rgba(108,99,255,0.4)'}`,
                    }}>
                      {profile.avatar || initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontWeight: 800, fontSize: '1rem',
                        color: isPink ? '#1a1a2e' : 'white',
                        margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {profile.name || 'Student'}
                      </p>
                      {profile.grade && (
                        <p style={{
                          fontSize: '0.75rem', margin: '2px 0 0',
                          color: accentColor, fontWeight: 600,
                        }}>{profile.grade}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditing(true)}
                      style={{
                        background: isPink ? 'rgba(236,72,153,0.1)' : 'rgba(108,99,255,0.15)',
                        border: `1px solid ${isPink ? 'rgba(236,72,153,0.2)' : 'rgba(108,99,255,0.25)'}`,
                        borderRadius: 8, padding: '0.35rem',
                        cursor: 'pointer', display: 'flex', color: accentColor,
                      }}
                    ><Edit3 size={14} /></button>
                  </div>

                  {/* Profile details */}
                  <div style={{
                    background: isPink ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
                    border: isPink ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14, padding: '0.75rem',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    marginBottom: '1rem',
                  }}>
                    {[
                      { icon: Mail, label: profile.email || 'No email set' },
                      { icon: Phone, label: profile.phone || 'No phone set' },
                      { icon: BookOpen, label: profile.grade || 'No grade set' },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon size={13} style={{ color: accentColor, flexShrink: 0 }} />
                        <p style={{
                          fontSize: '0.78rem', margin: 0,
                          color: isPink ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.5)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{label}</p>
                      </div>
                    ))}
                    {profile.bio && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <FileText size={13} style={{ color: accentColor, flexShrink: 0, marginTop: 2 }} />
                        <p style={{
                          fontSize: '0.75rem', margin: 0, lineHeight: 1.4,
                          color: isPink ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)',
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>{profile.bio}</p>
                      </div>
                    )}
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%', padding: '0.7rem',
                      borderRadius: 12, border: '1px solid rgba(239,68,68,0.25)',
                      background: 'rgba(239,68,68,0.08)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      color: '#f87171', fontWeight: 700, fontSize: '0.85rem',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </>
              ) : (
                /* ── EDIT MODE ──────────────────────────────────────────── */
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, color: isPink ? '#1a1a2e' : 'white' }}>
                      Edit Profile
                    </p>
                    <button
                      onClick={() => setEditing(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: isPink ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)', display: 'flex' }}
                    ><X size={16} /></button>
                  </div>

                  {/* Avatar picker */}
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, color: isPink ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)' }}>Choose Avatar</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '0.75rem' }}>
                    {AVATAR_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setForm(f => ({ ...f, avatar: emoji }))}
                        style={{
                          width: 34, height: 34, borderRadius: 10, border: 'none',
                          cursor: 'pointer', fontSize: '1.1rem',
                          background: form.avatar === emoji
                            ? isPink ? 'rgba(236,72,153,0.2)' : 'rgba(108,99,255,0.25)'
                            : isPink ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
                          boxShadow: form.avatar === emoji
                            ? `0 0 0 2px ${accentColor}` : 'none',
                          transition: 'all 0.15s',
                        }}
                      >{emoji}</button>
                    ))}
                  </div>

                  {/* Edit fields */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { key: 'name', label: 'Name', placeholder: 'Your name' },
                      { key: 'phone', label: 'Phone', placeholder: '+92 300 0000000' },
                      { key: 'bio', label: 'Bio', placeholder: 'Your goals...' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, color: isPink ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)' }}>{label}</p>
                        <input
                          placeholder={placeholder}
                          value={(form as any)[key] || ''}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          style={inputStyle}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      width: '100%', marginTop: 12, padding: '0.7rem',
                      borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: saved
                        ? 'linear-gradient(135deg, #10b981, #00f5d4)'
                        : isPink
                        ? 'linear-gradient(135deg, #ec4899, #a855f7)'
                        : 'linear-gradient(135deg, #6c63ff, #a855f7)',
                      color: 'white', fontWeight: 700, fontSize: '0.85rem',
                      fontFamily: 'Inter, sans-serif',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {saved ? <><Check size={15} /> Saved!</> : saving ? 'Saving...' : <><Check size={15} /> Save Changes</>}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
