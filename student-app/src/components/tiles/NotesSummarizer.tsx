import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Save, Trash2, X, FileText, Loader2 } from 'lucide-react';
import { addScore } from '../../utils/dailyScore';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function NotesSummarizer({ onClose }) {
  const [text, setText]       = useState('');
  const [summary, setSummary] = useState('');
  const [title, setTitle]     = useState('');
  const [notes, setNotes]     = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [tab, setTab]         = useState('summarize'); // 'summarize' | 'saved'
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/api/notes`);
      setNotes(res.data);
    } catch {}
  };

  const summarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setSummary('');
    setSaved(false);
    try {
      const res = await axios.post('https://text.pollinations.ai/', {
        messages: [
          { role: 'system', content: 'You are an expert tutor. Analyze the provided text and generate a comprehensive, step-by-step summary of the core concepts. Use Markdown format with clear headers, actionable bullet points, and numbered steps. Do not include introductory or concluding conversational filler.' },
          { role: 'user', content: text }
        ]
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      setSummary(res.data);
      addScore('notes_summarized');
    } catch {
      setSummary('⚠ Could not connect to AI service. Please try again.');
    }
    setLoading(false);
  };

  const uploadPdf = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setSummary('');
    setSaved(false);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      const res = await axios.post(`${API}/api/notes/summarize-pdf`, formData);
      setSummary(res.data.result);
      addScore('notes_summarized');
    } catch {
      setSummary('⚠ Failed to summarize PDF. Make sure the backend is running and the PDF is text-based.');
    }
    setLoading(false);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const saveNote = async () => {
    if (!summary || saved) return;
    try {
      const res = await axios.post(`${API}/api/notes`, { title: title || 'My Note', content: text, bullets: [summary] });
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

  const bookPaperStyle = {
    background: 'linear-gradient(180deg, rgba(250,241,223,0.95), rgba(242,228,199,0.92))',
    border: '1px solid rgba(214,174,110,0.35)',
    color: '#3d2f1f',
  };
  const ruledPaper = 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 28px)';

  return (
    <div className="tile-overlay" onClick={onClose}>
      <motion.div
        className="tile-modal"
        style={{
          maxWidth: 920,
          background: 'linear-gradient(145deg, rgba(84,54,24,0.96), rgba(60,37,14,0.96))',
          border: '1px solid rgba(214,174,110,0.45)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 40px rgba(214,174,110,0.22)',
        }}
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
              <h2 className="font-bold text-xl" style={{ color: '#f4e6c8' }}>Notes Summarizer</h2>
              <p className="text-xs" style={{ color: 'rgba(244,230,200,0.75)' }}>Open-book AI bullet extraction</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2" style={{ color: '#f4e6c8', borderColor: 'rgba(244,230,200,0.35)', background: 'rgba(255,255,255,0.06)' }}>
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
                background: tab === t ? 'linear-gradient(135deg,#b07a32,#7a5121)' : 'rgba(250,241,223,0.2)',
                color: tab === t ? '#fff5e5' : 'rgba(244,230,200,0.85)',
                border: tab === t ? 'none' : '1px solid rgba(244,230,200,0.3)',
              }}
            >
              {t === 'summarize' ? '✨ Summarize' : '📂 Saved Notes'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'summarize' ? (
            <motion.div key="sum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                style={{
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 0,
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid rgba(214,174,110,0.35)',
                  background: 'linear-gradient(180deg, rgba(250,241,223,0.95), rgba(242,228,199,0.92))',
                  minHeight: 360,
                }}
              >
                <div style={{ padding: '1rem', borderRight: '1px solid rgba(214,174,110,0.25)', backgroundImage: ruledPaper, backgroundSize: '100% 29px', display: 'flex', flexDirection: 'column' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#7f5c2c', letterSpacing: '0.06em' }}>SOURCE MATERIAL</p>
                  <textarea
                    className="input-glass mb-3 flex-1"
                    style={{
                      minHeight: 180,
                      resize: 'vertical',
                      lineHeight: 1.7,
                      background: 'rgba(255,255,255,0.5)',
                      color: '#3d2f1f',
                      border: '1px solid rgba(174,132,66,0.35)',
                    }}
                    placeholder="Paste your notes, article, or any text here..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                  <div className="flex gap-2 mb-3">
                    <button onClick={summarize} className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={loading}>
                      {loading && !fileInputRef.current?.value ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      Summarize Text
                    </button>
                    <label className="btn-glass flex items-center justify-center gap-2 px-4 cursor-pointer" style={{ background: 'rgba(255,255,255,0.6)', color: '#3d2f1f', border: '1px solid rgba(174,132,66,0.35)' }}>
                      <FileText size={16} />
                      {loading && fileInputRef.current?.value ? 'Uploading...' : 'Upload PDF'}
                      <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={uploadPdf} disabled={loading} />
                    </label>
                  </div>
                </div>

                <div style={{ padding: '1rem', borderLeft: '1px solid rgba(214,174,110,0.2)', backgroundImage: ruledPaper, backgroundSize: '100% 29px', display: 'flex', flexDirection: 'column' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#7f5c2c', letterSpacing: '0.06em' }}>STEP-BY-STEP SUMMARY</p>
                  <div
                    style={{
                      flex: 1,
                      minHeight: 230,
                      maxHeight: 350,
                      overflowY: 'auto',
                      borderRadius: 12,
                      padding: '0.9rem',
                      background: 'rgba(255,255,255,0.45)',
                      border: '1px solid rgba(174,132,66,0.28)',
                    }}
                  >
                    {!summary ? (
                      <p style={{ color: 'rgba(61,47,31,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Your step-by-step notes will appear here.
                      </p>
                    ) : (
                      <div className="text-sm" style={{ color: '#3d2f1f', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {summary}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <input
                      className="input-glass flex-1"
                      style={{ background: 'rgba(255,255,255,0.5)', color: '#3d2f1f', border: '1px solid rgba(174,132,66,0.35)' }}
                      placeholder="Give this note a title..."
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                    <button onClick={saveNote} className="btn-primary flex items-center gap-1 px-4">
                      <Save size={14} />
                      {saved ? 'Saved!' : 'Save'}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    width: 2,
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(180deg, rgba(163,118,54,0.15), rgba(163,118,54,0.9), rgba(163,118,54,0.15))',
                    boxShadow: '0 0 8px rgba(163,118,54,0.35)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                style={{
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 0,
                  borderRadius: 16,
                  overflow: 'hidden',
                  ...bookPaperStyle,
                  minHeight: 330,
                }}
              >
                <div style={{ padding: '1rem', borderRight: '1px solid rgba(214,174,110,0.25)', backgroundImage: ruledPaper, backgroundSize: '100% 29px' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#7f5c2c', letterSpacing: '0.06em' }}>SAVED TITLES</p>
                  {notes.length === 0 ? (
                    <div className="text-center py-10" style={{ color: 'rgba(61,47,31,0.65)' }}>
                      <FileText size={34} className="mx-auto mb-2 opacity-60" />
                      <p>No saved notes yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {notes.map(note => (
                        <div key={note.id} style={{ border: '1px solid rgba(174,132,66,0.25)', borderRadius: 10, padding: '0.55rem 0.6rem', background: 'rgba(255,255,255,0.45)' }}>
                          <p className="text-sm font-semibold" style={{ color: '#3d2f1f' }}>{note.title}</p>
                          <p className="text-xs" style={{ color: 'rgba(61,47,31,0.6)' }}>
                            {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ padding: '1rem', borderLeft: '1px solid rgba(214,174,110,0.2)', backgroundImage: ruledPaper, backgroundSize: '100% 29px' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#7f5c2c', letterSpacing: '0.06em' }}>HIGHLIGHTS & ACTION</p>
                  {notes.length === 0 ? (
                    <p style={{ color: 'rgba(61,47,31,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      Saved summaries will appear here with quick insight bullets.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {notes.map(note => (
                        <div key={`r-${note.id}`} style={{ border: '1px solid rgba(174,132,66,0.25)', borderRadius: 10, padding: '0.6rem', background: 'rgba(255,255,255,0.45)' }}>
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-semibold" style={{ color: '#3d2f1f' }}>{note.title}</p>
                            <button onClick={() => deleteNote(note.id)} style={{ color: '#b91c1c', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <ul className="space-y-1">
                            {note.bullets.slice(0, 2).map((b, i) => (
                              <li key={i} className="text-xs flex gap-1" style={{ color: '#3d2f1f' }}>
                                <span style={{ color: '#6c63ff' }}>▸</span> {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    width: 2,
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(180deg, rgba(163,118,54,0.15), rgba(163,118,54,0.9), rgba(163,118,54,0.15))',
                    boxShadow: '0 0 8px rgba(163,118,54,0.35)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
