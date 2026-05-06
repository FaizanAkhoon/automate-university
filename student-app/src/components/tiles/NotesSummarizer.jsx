import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Save, Trash2, X, FileText, Loader2 } from 'lucide-react';
import { addScore } from '../../utils/dailyScore';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function NotesSummarizer({ onClose }) {
  const [text, setText]       = useState('');
  const [bullets, setBullets] = useState([]);
  const [title, setTitle]     = useState('');
  const [notes, setNotes]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [tab, setTab]         = useState('summarize'); // 'summarize' | 'saved'
  const textRef = useRef(null);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/api/notes`);
      setNotes(res.data);
    } catch {}
  };

  const summarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setBullets([]);
    setSaved(false);
    try {
      // Free Pollinations AI Endpoint
      const res = await axios.post('https://text.pollinations.ai/', {
        messages: [
          { role: 'system', content: 'You are an expert summarizer. Extract exactly 3 to 5 concise bullet points from the provided text. Return ONLY the bullet points, each on a new line starting with a dash (-). Do not include any intro or outro text.' },
          { role: 'user', content: text }
        ]
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const resultText = res.data;
      const bulletList = resultText.split('\n')
        .map(line => line.replace(/^[-*•]\s*/, '').trim())
        .filter(line => line.length > 0);

      setBullets(bulletList.length ? bulletList : ['⚠ No bullets generated.']);
      if (bulletList.length > 0 && !bulletList[0].startsWith('⚠')) {
        addScore('notes_summarized');
      }
    } catch {
      setBullets(['⚠ Could not connect to AI service. Please try again.']);
    }
    setLoading(false);
  };

  const saveNote = async () => {
    if (!bullets.length || saved) return;
    try {
      const res = await axios.post(`${API}/api/notes`, { title: title || 'My Note', content: text, bullets });
      setSaved(true);
      setNotes(prev => [res.data, ...prev]);
      setTitle('');
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save note. Make sure the backend is running.');
    }
  };


  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/api/notes/${id}`);
      setNotes(n => n.filter(note => note.id !== id));
    } catch {}
  };

  return (
    <div className="tile-overlay" onClick={onClose}>
      <motion.div
        className="tile-modal"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6c63ff33, #6c63ff11)', border: '1px solid #6c63ff44' }}>
              <BookOpen size={20} color="#6c63ff" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Notes Summarizer</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>AI-style bullet extraction</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {['summarize', 'saved'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); if (t === 'saved') fetchNotes(); }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === t ? 'linear-gradient(135deg,#6c63ff,#a855f7)' : 'rgba(255,255,255,0.06)',
                color: tab === t ? 'white' : 'rgba(255,255,255,0.5)',
                border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {t === 'summarize' ? '✨ Summarize' : '📂 Saved Notes'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'summarize' ? (
            <motion.div key="sum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <textarea
                ref={textRef}
                className="input-glass mb-3"
                style={{ minHeight: 160, resize: 'vertical', lineHeight: 1.6 }}
                placeholder="Paste your notes, article, or any text here..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <button onClick={summarize} className="btn-primary w-full mb-5 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {loading ? 'Summarizing...' : 'Generate Bullet Points'}
              </button>

              <AnimatePresence>
                {bullets.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-4 mb-4"
                  >
                    <p className="text-xs font-semibold mb-3" style={{ color: '#a855f7' }}>KEY POINTS</p>
                    <ul className="space-y-2">
                      {bullets.map((b, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="flex items-start gap-2 text-sm"
                          style={{ color: 'rgba(255,255,255,0.85)' }}
                        >
                          <span style={{ color: '#6c63ff', flexShrink: 0, marginTop: 2 }}>▸</span>
                          {b}
                        </motion.li>
                      ))}
                    </ul>
                    <div className="flex gap-2 mt-4">
                      <input
                        className="input-glass flex-1"
                        placeholder="Give this note a title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                      />
                      <button onClick={saveNote} className="btn-primary flex items-center gap-1 px-4">
                        <Save size={14} />
                        {saved ? 'Saved!' : 'Save'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {notes.length === 0 ? (
                <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <FileText size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No saved notes yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {notes.map(note => (
                    <div key={note.id} className="glass rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white text-sm">{note.title}</h3>
                        <div className="flex gap-2">
                          <button onClick={() => deleteNote(note.id)} className="text-red-400 hover:text-red-300">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                      <ul className="space-y-1">
                        {note.bullets.slice(0, 3).map((b, i) => (
                          <li key={i} className="text-xs flex gap-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            <span style={{ color: '#6c63ff' }}>▸</span> {b}
                          </li>
                        ))}
                        {note.bullets.length > 3 && (
                          <li className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            +{note.bullets.length - 3} more...
                          </li>
                        )}
                      </ul>
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
