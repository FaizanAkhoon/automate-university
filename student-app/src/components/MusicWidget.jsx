import { motion } from 'framer-motion';
import { X, Headphones, Search } from 'lucide-react';
import { useState } from 'react';
import { playNormalClick } from '../utils/sound';

export default function MusicWidget({ onClose, theme }) {
  const isPink = theme === 'pink';
  const [videoId, setVideoId] = useState('jfKfPfyJRdk'); // Default Lofi Girl stream
  const [inputUrl, setInputUrl] = useState('');

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
      className="absolute top-24 right-8 w-80 glass rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: isPink ? 'rgba(255,255,255,0.7)' : 'rgba(15,15,30,0.8)',
        border: isPink ? '1px solid rgba(255,182,193,0.5)' : '1px solid rgba(255,255,255,0.1)',
        zIndex: 50
      }}
    >
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2">
          <Headphones size={16} color={isPink ? '#ff1493' : '#00f5d4'} />
          <span className="text-sm font-semibold" style={{ color: isPink ? '#5c454f' : 'white' }}>Study Radio</span>
        </div>
        <button 
          onClick={() => { playNormalClick(); onClose(); }} 
          className="opacity-50 hover:opacity-100 transition-opacity"
        >
          <X size={16} color={isPink ? '#5c454f' : 'white'} />
        </button>
      </div>

      <div className="p-3">
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
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity">
            <Search size={14} color={isPink ? '#5c454f' : 'white'} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
