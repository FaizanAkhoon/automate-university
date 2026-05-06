import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Search, ExternalLink, Star, X, Play } from 'lucide-react';
import { addScore } from '../../utils/dailyScore';

const CHANNELS = [
  { id: 1, name: 'freeCodeCamp',        url: 'https://youtube.com/@freecodecamp',         subs: '9.2M', tag: 'Full Courses',        color: '#0A0A23', emoji: '🟦', desc: 'Full-length courses on web dev, Python, ML and more.' },
  { id: 2, name: 'Traversy Media',      url: 'https://youtube.com/@TraversyMedia',         subs: '2.2M', tag: 'Web Dev',             color: '#f7df1e', emoji: '🟨', desc: 'Brad Traversy teaches web dev crash courses.' },
  { id: 3, name: 'CS50 Harvard',        url: 'https://youtube.com/@cs50',                  subs: '1.8M', tag: 'CS Fundamentals',     color: '#A51C30', emoji: '🔴', desc: "Harvard's legendary intro to computer science." },
  { id: 4, name: 'The Coding Train',    url: 'https://youtube.com/@TheCodingTrain',        subs: '1.7M', tag: 'Creative Coding',     color: '#ff6b6b', emoji: '🚂', desc: 'Fun, creative coding with p5.js and more.' },
  { id: 5, name: 'Fireship',            url: 'https://youtube.com/@Fireship',              subs: '3.5M', tag: '100s / Quick Tips',   color: '#ff5a00', emoji: '🔥', desc: 'High-intensity coding tutorials in 100 seconds.' },
  { id: 6, name: 'Programming with Mosh', url: 'https://youtube.com/@programmingwithmosh', subs: '4.1M', tag: 'Beginner Friendly',   color: '#6c63ff', emoji: '🎓', desc: 'Beginner-friendly courses on Python, JS, React.' },
  { id: 7, name: 'Corey Schafer',       url: 'https://youtube.com/@coreyms',               subs: '1.2M', tag: 'Python',              color: '#3572A5', emoji: '🐍', desc: 'In-depth Python tutorials and data science.' },
  { id: 8, name: 'Kevin Powell',        url: 'https://youtube.com/@KevinPowell',           subs: '980K', tag: 'CSS / Design',        color: '#264de4', emoji: '🎨', desc: 'The king of CSS — deep dives into modern styling.' },
  { id: 9, name: 'MIT OpenCourseWare',  url: 'https://youtube.com/@mitocw',                subs: '4.7M', tag: 'University Level',    color: '#A31F34', emoji: '🏛️', desc: 'Official MIT courses on algorithms, math, and AI.' },
  { id:10, name: 'Tech With Tim',       url: 'https://youtube.com/@TechWithTim',           subs: '1.5M', tag: 'Python / ML',         color: '#00f5d4', emoji: '💻', desc: 'Python, machine learning, and game dev projects.' },
  { id:11, name: 'Wes Bos',            url: 'https://youtube.com/@WesBos',                subs: '400K', tag: 'JavaScript',          color: '#f5a623', emoji: '📦', desc: 'Advanced JavaScript and React tutorials.' },
  { id:12, name: 'Academind',           url: 'https://youtube.com/@academind',             subs: '1.1M', tag: 'Full Stack',          color: '#742774', emoji: '🎯', desc: 'Full-stack courses on React, Angular, Node.js.' },
];

const TAGS = ['All', 'Full Courses', 'Web Dev', 'CS Fundamentals', 'Python', 'JavaScript', 'CSS / Design', 'ML', 'University Level'];

export default function YouTubeChannels({ onClose }) {
  const [query, setQuery]       = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const filtered = useMemo(() => {
    return CHANNELS.filter(ch => {
      const matchTag = activeTag === 'All' || ch.tag.includes(activeTag.split(' / ')[0]);
      const matchSearch = !query || ch.name.toLowerCase().includes(query.toLowerCase()) || ch.desc.toLowerCase().includes(query.toLowerCase()) || ch.tag.toLowerCase().includes(query.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [query, activeTag]);

  return (
    <div className="tile-overlay" onClick={onClose}>
      <motion.div
        className="tile-modal"
        style={{ maxWidth: 780 }}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#ef444433,#ef444411)', border: '1px solid #ef444444' }}>
              <PlayCircle size={20} color="#ef4444" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Learn Skills</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{CHANNELS.length} curated channels · 100% free</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X size={18} /></button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
          <input
            className="input-glass"
            style={{ paddingLeft: 38 }}
            placeholder="Search channels, topics..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Tag filters */}
        <div className="flex gap-2 flex-wrap mb-5">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activeTag === tag ? 'linear-gradient(135deg,#ef4444,#f97316)' : 'rgba(255,255,255,0.06)',
                color: activeTag === tag ? 'white' : 'rgba(255,255,255,0.5)',
                border: activeTag === tag ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Channel grid */}
        <div className="youtube-grid grid gap-3 overflow-y-auto pr-1" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxHeight: 'clamp(280px, 45vh, 380px)' }}>
          {filtered.length === 0 ? (
            <div className="col-span-2 text-center py-10" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <PlayCircle size={36} className="mx-auto mb-2 opacity-30" />
              <p>No channels found for "{query}"</p>
            </div>
          ) : filtered.map((ch, idx) => (
            <motion.a
              key={ch.id}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="glass rounded-xl p-3 flex gap-3 items-start group no-underline"
              style={{ textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(239,68,68,0.15)' }}
              onClick={() => addScore('video_watched')}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {ch.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <p className="text-sm font-semibold text-white truncate">{ch.name}</p>
                  <ExternalLink size={11} style={{ color: 'rgba(255,255,255,0.3)', flexShrink:0 }} className="group-hover:text-red-400 transition-colors" />
                </div>
                <p className="text-xs mb-1 truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{ch.desc}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>{ch.tag}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>👥 {ch.subs}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
