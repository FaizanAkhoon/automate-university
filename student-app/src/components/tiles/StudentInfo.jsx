import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, X, BookOpen, Star, Mail, GraduationCap } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000';

const GRADES = ['7th','8th','9th','10th','11th','12th','College 1st Year','College 2nd Year','College 3rd Year','College 4th Year'];
const SUBJECT_OPTIONS = ['Math','Physics','Chemistry','Biology','English','History','Geography','Computer Science','Economics','Art','Music','PE'];

export default function StudentInfo({ onClose }) {
  const [form, setForm] = useState({ name: '', grade: '', subjects: [], gpa: '', email: '', bio: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/student`)
      .then(res => { if (res.data?.name) setForm(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleSubject = (s) => {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(s)
        ? f.subjects.filter(x => x !== s)
        : [...f.subjects, s]
    }));
  };

  const save = async () => {
    try {
      await axios.put(`${API}/api/student`, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  const gpaNum = parseFloat(form.gpa) || 0;
  const gpaColor = gpaNum >= 3.5 ? '#00f5d4' : gpaNum >= 3.0 ? '#a855f7' : gpaNum >= 2.0 ? '#f59e0b' : '#ef4444';

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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f733,#a855f711)', border: '1px solid #a855f744' }}>
              <User size={20} color="#a855f7" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Student Information</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Your profile & academic details</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X size={18} /></button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
              boxShadow: '0 0 30px rgba(168,85,247,0.4)',
            }}
          >
            {form.name ? form.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '?'}
          </div>
        </div>

        <div className="space-y-4">
          {/* Name & Email */}
          <div className="student-grid-2 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Full Name</label>
              <input className="input-glass" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</label>
              <input className="input-glass" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>
          </div>

          {/* Grade & GPA */}
          <div className="student-grid-2 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Grade / Year</label>
              <select
                className="input-glass"
                value={form.grade}
                onChange={e => setForm(f => ({...f, grade: e.target.value}))}
                style={{ appearance: 'none' }}
              >
                <option value="">Select grade...</option>
                {GRADES.map(g => <option key={g} value={g} style={{ background: '#1a1a2e' }}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                GPA / Score
                {form.gpa && (
                  <span className="ml-2 font-bold" style={{ color: gpaColor }}>{form.gpa}</span>
                )}
              </label>
              <input
                className="input-glass"
                type="number"
                step="0.1"
                min="0"
                max="4"
                placeholder="e.g. 3.8"
                value={form.gpa}
                onChange={e => setForm(f => ({...f, gpa: e.target.value}))}
              />
            </div>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Subjects ({form.subjects.length} selected)
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSubject(s)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: form.subjects.includes(s) ? 'linear-gradient(135deg,#6c63ff,#a855f7)' : 'rgba(255,255,255,0.06)',
                    color: form.subjects.includes(s) ? 'white' : 'rgba(255,255,255,0.5)',
                    border: form.subjects.includes(s) ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Bio / Goals</label>
            <textarea
              className="input-glass"
              style={{ minHeight: 80, resize: 'none' }}
              placeholder="Your academic goals or interests..."
              value={form.bio}
              onChange={e => setForm(f => ({...f, bio: e.target.value}))}
            />
          </div>

          <button onClick={save} className="btn-primary w-full flex items-center justify-center gap-2">
            <Save size={16} />
            {saved ? '✓ Saved!' : 'Save Profile'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
