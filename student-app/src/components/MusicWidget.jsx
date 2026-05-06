import { motion } from 'framer-motion';
import { X, Headphones, Search } from 'lucide-react';
import { useState } from 'react';
import { playNormalClick } from '../utils/sound';

export default function MusicWidget({ onClose, theme }) {
  const isPink = theme === 'pink';
  const [videoId, setVideoId] = useState('jfKfPfyJRdk'); // Default Lofi Girl stream
  const [inputUrl, setInputUrl] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    playNormalClick();
    // Extract video ID from URL
    const match = inputUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
    if (match && match[1]) {
      setVideoId(match[1]);
      setInputUrl('');
    } else if (inputUrl.length === 11) {
      setVideoId(inputUrl);
      setInputUrl('');
    } else {
      alert("Please paste a valid YouTube URL or 11-character Video ID");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        position: 'fixed',
        top: 'auto',
        bottom: 'env(safe-area-inset-bottom, 1rem)',
        right: '1rem',
        left: '1rem',
        width: 'auto',
        maxWidth: '360px',
        marginLeft: 'auto',
        background: isPink ? 'rgba(255,255,255,0.85)' : 'rgba(15,15,30,0.85)',
        border: isPink ? '1px solid rgba(255,182,193,0.5)' : '1px solid rgba(255,255,255,0.1)',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        zIndex: 100,
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
      }}
    >
      <div className="flex items-center justify-between p-3" style={{ borderBottom: isMinimized ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2">
          <Headphones size={16} color={isPink ? '#ff1493' : '#00f5d4'} />
          <span className="text-sm font-semibold" style={{ color: isPink ? '#5c454f' : 'white' }}>Study Radio</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => { playNormalClick(); setIsMinimized(!isMinimized); }} 
            className="opacity-50 hover:opacity-100 transition-opacity p-1"
          >
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: isPink ? '#5c454f' : 'white' }}>
              {isMinimized ? 'EXPAND' : 'MINIMIZE'}
            </span>
          </button>
          <button 
            onClick={() => { playNormalClick(); onClose(); }} 
            className="opacity-50 hover:opacity-100 transition-opacity p-1"
          >
            <X size={16} color={isPink ? '#5c454f' : 'white'} />
          </button>
        </div>
      </div>

      <div style={{ height: isMinimized ? 0 : 'auto', overflow: 'hidden', opacity: isMinimized ? 0 : 1, transition: 'all 0.3s ease' }}>
        <div className="p-3 pt-0">
          <div className="rounded-xl overflow-hidden mb-3" style={{ border: isPink ? '1px solid rgba(255,182,193,0.4)' : '1px solid rgba(255,255,255,0.1)' }}>
            <iframe 
              width="100%" 
              height="160" 
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
          
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder="Paste YouTube Link or ID..." 
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              className="input-glass w-full text-xs py-2 pl-3 pr-8"
              style={{ background: isPink ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)' }}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity">
              <Search size={14} color={isPink ? '#5c454f' : 'white'} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
