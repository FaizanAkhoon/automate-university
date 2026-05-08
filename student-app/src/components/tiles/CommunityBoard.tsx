import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Code, Users, Send, Clock, MapPin, Trash2 } from 'lucide-react';

const TABS = [
  { key: 'hackathon', label: 'Hackathon', emoji: '🏆', icon: Trophy, color: '#f59e0b' },
  { key: 'project', label: 'Project', emoji: '💻', icon: Code, color: '#6c63ff' },
  { key: 'member', label: 'Need Member', emoji: '👥', icon: Users, color: '#00f5d4' },
];

export default function CommunityBoard({ onClose, studentName, studentDept }) {
  const [activeTab, setActiveTab] = useState('hackathon');
  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', skills: '', contact: '' });
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/community`)
      .then(r => r.json())
      .then(data => { setPosts(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/community`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          title: form.title,
          description: form.description,
          skills: form.skills,
          contact: form.contact,
          authorName: studentName || 'Anonymous',
          authorDept: studentDept || 'CS'
        })
      });
      setForm({ title: '', description: '', skills: '', contact: '' });
      setShowForm(false);
      fetchPosts();
    } catch { alert('Failed to post. Is the backend running?'); }
  };

  const handleDelete = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/community/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  const filtered = posts.filter(p => p.type === activeTab);
  const tabData = TABS.find(t => t.key === activeTab)!;

  const timeAgo = (d) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '95vw', maxWidth: 600, maxHeight: '85vh',
          display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(135deg, #1a1025, #120d1e)',
          borderRadius: 24, overflow: 'hidden',
          border: '1px solid rgba(108,99,255,0.3)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(108,99,255,0.15)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(108,99,255,0.06)', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(108,99,255,0.5)'
            }}>
              <Users size={16} color="white" />
            </div>
            <div>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.05rem', margin: 0 }}>Community Board</h2>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', margin: 0 }}>Connect · Collaborate · Create</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '0.4rem', cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
            display: 'flex'
          }}><X size={16} /></button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 6, padding: '0.75rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0
        }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '0.55rem 0.5rem', borderRadius: 10,
                border: activeTab === tab.key ? `1px solid ${tab.color}55` : '1px solid rgba(255,255,255,0.06)',
                background: activeTab === tab.key ? `${tab.color}18` : 'rgba(255,255,255,0.02)',
                color: activeTab === tab.key ? tab.color : 'rgba(255,255,255,0.4)',
                fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                transition: '0.2s'
              }}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {/* New Post Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                width: '100%', padding: '0.7rem', borderRadius: 12, marginBottom: '1rem',
                background: `linear-gradient(135deg, ${tabData.color}22, ${tabData.color}08)`,
                border: `1px dashed ${tabData.color}55`, color: tabData.color,
                fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: '0.2s'
              }}
            >
              + Post a {tabData.label} Request
            </button>
          )}

          {/* Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden', marginBottom: '1rem' }}
              >
                <div style={{
                  padding: '1rem', borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${tabData.color}33`,
                  display: 'flex', flexDirection: 'column', gap: 10
                }}>
                  <input
                    placeholder="Title *"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, padding: '0.6rem 0.8rem', color: 'white', fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <textarea
                    placeholder="Description — what are you looking for?"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, padding: '0.6rem 0.8rem', color: 'white', fontSize: '0.85rem',
                      outline: 'none', resize: 'vertical', fontFamily: 'inherit'
                    }}
                  />
                  <input
                    placeholder="Skills needed (e.g. React, Python, UI/UX)"
                    value={form.skills}
                    onChange={e => setForm({ ...form, skills: e.target.value })}
                    style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, padding: '0.6rem 0.8rem', color: 'white', fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    placeholder="Contact (email, WhatsApp, Discord)"
                    value={form.contact}
                    onChange={e => setForm({ ...form, contact: e.target.value })}
                    style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, padding: '0.6rem 0.8rem', color: 'white', fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={handleSubmit}
                      style={{
                        flex: 1, padding: '0.6rem', borderRadius: 10,
                        background: `linear-gradient(135deg, ${tabData.color}, ${tabData.color}cc)`,
                        border: 'none', color: 'white', fontWeight: 700, fontSize: '0.85rem',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        boxShadow: `0 0 15px ${tabData.color}44`
                      }}
                    ><Send size={14} /> Post Request</button>
                    <button
                      onClick={() => setShowForm(false)}
                      style={{
                        padding: '0.6rem 1rem', borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
                      }}
                    >Cancel</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts List */}
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem' }}>Loading posts...</p>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.25)' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{tabData.emoji}</p>
              <p style={{ fontWeight: 600 }}>No {tabData.label.toLowerCase()} posts yet</p>
              <p style={{ fontSize: '0.8rem' }}>Be the first to post!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '1rem', borderRadius: 14,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: '0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h4 style={{ color: tabData.color, fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>
                      {post.title}
                    </h4>
                    {post.authorName === studentName && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: 2 }}
                      ><Trash2 size={14} /></button>
                    )}
                  </div>
                  {post.description && (
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 8px' }}>
                      {post.description}
                    </p>
                  )}
                  {post.skills && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                      {post.skills.split(',').map((s, i) => (
                        <span key={i} style={{
                          padding: '2px 8px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600,
                          background: `${tabData.color}15`, color: tabData.color,
                          border: `1px solid ${tabData.color}30`
                        }}>{s.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>
                      <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
                        {post.authorName}
                      </span>
                      {post.authorDept && <span>· {post.authorDept}</span>}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={10} /> {timeAgo(post.createdAt)}
                      </span>
                    </div>
                    {post.contact && (
                      <a
                        href={post.contact.includes('@') ? `mailto:${post.contact}` : '#'}
                        style={{
                          padding: '3px 10px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700,
                          background: `${tabData.color}20`, color: tabData.color,
                          border: `1px solid ${tabData.color}40`, textDecoration: 'none',
                          cursor: 'pointer'
                        }}
                      >Contact ↗</a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
