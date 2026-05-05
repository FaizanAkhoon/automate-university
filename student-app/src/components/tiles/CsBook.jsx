import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Lock, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import { SUBJECTS as AI_SUBJECTS } from '../../data/csbook_ai';
import { CYBERSECURITY } from '../../data/csbook_cyber';
import { BLOCKCHAIN } from '../../data/csbook_blockchain';
import { CLOUD } from '../../data/csbook_cloud';
import { QUANTUM } from '../../data/csbook_quantum';
import { DATASCIENCE } from '../../data/csbook_datascience';

const SUBJECTS = [...AI_SUBJECTS, CYBERSECURITY, BLOCKCHAIN, CLOUD, QUANTUM, DATASCIENCE];

export default function CsBook({ onClose }) {
  const [unlockedUpTo, setUnlockedUpTo] = useState(() => {
    const saved = localStorage.getItem('csbook_unlocked');
    return saved ? parseInt(saved) : 0;
  });
  const [completedIds, setCompletedIds] = useState(() => {
    const saved = localStorage.getItem('csbook_completed');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedId, setSelectedId] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageUnlocked, setPageUnlocked] = useState(0);
  
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef(null);

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileContent, setShowMobileContent] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedSubject = SUBJECTS[selectedId];
  const activePageData = selectedSubject.pages[currentPage];
  const totalPages = selectedSubject.pages.length;

  // Reset pagination when subject changes
  useEffect(() => {
    setCurrentPage(0);
    setPageUnlocked(isCompleted(selectedId) ? SUBJECTS[selectedId].pages.length - 1 : 0);
    setHasScrolledToBottom(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [selectedId]);

  // Reset scroll state when page changes
  useEffect(() => {
    if (isCompleted(selectedId) || currentPage < pageUnlocked) {
      setHasScrolledToBottom(true);
    } else {
      setHasScrolledToBottom(false);
    }
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [currentPage, selectedId, pageUnlocked]);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
    
    if (atBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      
      if (currentPage === pageUnlocked) {
        setPageUnlocked(prev => Math.min(prev + 1, totalPages - 1));
      }

      // If we hit the bottom of the final page, complete the subject
      if (currentPage === totalPages - 1) {
        const newCompleted = completedIds.includes(selectedId)
          ? completedIds
          : [...completedIds, selectedId];
        const newUnlocked = Math.max(unlockedUpTo, selectedId + 1);
        
        setCompletedIds(newCompleted);
        setUnlockedUpTo(newUnlocked);
        localStorage.setItem('csbook_completed', JSON.stringify(newCompleted));
        localStorage.setItem('csbook_unlocked', String(newUnlocked));
      }
    }
  };

  const isCompleted = (id) => completedIds.includes(id);
  const isUnlocked = (id) => id <= unlockedUpTo;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotateY: -20 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.85, rotateY: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '95vw', maxWidth: 1000, height: '85vh',
          display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(135deg, #1a1025 0%, #120d1e 100%)',
          borderRadius: 24, overflow: 'hidden',
          border: '1px solid rgba(168,85,247,0.3)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(108,99,255,0.2)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(108,99,255,0.08)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg,#6c63ff,#a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(108,99,255,0.5)'
            }}>
              <BookOpen size={18} color="white" />
            </div>
            <div>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Advanced CS Library</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', margin: 0 }}>60 pages · Complete all pages to unlock next subject</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '0.4rem', cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Book body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>

          {/* LEFT — coin list */}
          {(!isMobile || !showMobileContent) && (
            <div style={{
              width: isMobile ? '100%' : 260, flexShrink: 0,
              borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
              padding: '1.25rem 1rem',
              overflowY: 'auto',
              background: 'rgba(0,0,0,0.2)',
              display: 'flex', flexDirection: 'column', gap: 10,
              flex: isMobile ? 1 : 'none'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Subjects</p>
              {SUBJECTS.map(sub => {
                const done = isCompleted(sub.id);
                const unlocked = isUnlocked(sub.id);
                const active = selectedId === sub.id && !isMobile;
                return (
                  <motion.button
                    key={sub.id}
                    onClick={() => {
                      if (unlocked) {
                        setSelectedId(sub.id);
                        if (isMobile) setShowMobileContent(true);
                      }
                    }}
                    whileHover={unlocked ? { scale: 1.02 } : {}}
                    whileTap={unlocked ? { scale: 0.98 } : {}}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '0.75rem 0.8rem', borderRadius: 14,
                      border: active
                        ? '1px solid rgba(168,85,247,0.6)'
                        : done
                        ? '1px solid rgba(245,158,11,0.4)'
                        : '1px solid rgba(255,255,255,0.08)',
                      background: active
                        ? 'rgba(108,99,255,0.2)'
                        : done
                        ? 'rgba(245,158,11,0.08)'
                        : 'rgba(255,255,255,0.03)',
                      cursor: unlocked ? 'pointer' : 'not-allowed',
                      opacity: unlocked ? 1 : 0.45,
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    {/* Coin */}
                    <motion.div
                      animate={done ? { rotate: [0, 360] } : {}}
                      transition={{ duration: 0.6 }}
                      style={{
                        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem',
                        background: done
                          ? 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)'
                          : unlocked
                          ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%)'
                          : 'rgba(255,255,255,0.05)',
                        border: done
                          ? '2px solid #fbbf24'
                          : unlocked
                          ? '1px solid rgba(255,255,255,0.4)'
                          : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: done
                          ? '0 0 16px rgba(245,158,11,0.6), inset 0 1px 2px rgba(255,255,255,0.5)'
                          : unlocked
                          ? '0 0 8px rgba(255,255,255,0.1), inset 0 1px 2px rgba(255,255,255,0.3)'
                          : 'none',
                      }}
                    >
                      {unlocked ? sub.emoji : <Lock size={14} color="rgba(255,255,255,0.3)" />}
                    </motion.div>

                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p style={{
                        color: done ? '#fbbf24' : unlocked ? 'white' : 'rgba(255,255,255,0.3)',
                        fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.2,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>{sub.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: 2 }}>
                        {done ? `✓ Completed (${sub.pages.length} pages)` : unlocked ? `${sub.pages.length} pages · ${sub.level}` : '🔒 Locked'}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* RIGHT — content page */}
          {(!isMobile || showMobileContent) && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
              {/* Page header */}
              <div style={{
                padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)', flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                {isMobile && (
                  <button
                    onClick={() => setShowMobileContent(false)}
                    style={{
                      background: 'rgba(255,255,255,0.1)', border: 'none',
                      borderRadius: 8, padding: '0.5rem', color: 'white',
                      marginRight: '0.5rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center'
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: '1.2rem' }}>{selectedSubject.emoji}</span>
                    <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {selectedSubject.title}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: 'rgba(108,99,255,0.2)', color: '#a88dff',
                      border: '1px solid rgba(108,99,255,0.3)'
                    }}>Page {currentPage + 1} of {totalPages}</span>
                    
                    {isCompleted(selectedId) && (
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                        background: 'rgba(245,158,11,0.2)', color: '#fbbf24',
                        border: '1px solid rgba(245,158,11,0.3)'
                      }}>✓ Subject Completed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable content */}
              <div
                ref={contentRef}
                onScroll={handleScroll}
                style={{
                  flex: 1, overflowY: 'auto', padding: isMobile ? '1.25rem' : '2rem',
                  color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? '0.95rem' : '1.05rem', lineHeight: 1.8,
                  fontFamily: 'Inter, sans-serif', paddingBottom: '6rem'
                }}
              >
                <h2 style={{ color: '#00f5d4', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                  {activePageData.subtitle}
                </h2>

                {activePageData.content.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h4 key={i} style={{ color: '#a88dff', fontWeight: 800, marginTop: '1.8rem', marginBottom: '0.5rem', fontSize: '1.15rem' }}>{line.replace(/\*\*/g, '')}</h4>;
                  }
                  if (line.trim().startsWith('- ')) {
                    return <li key={i} style={{ margin: '0.4rem 0', marginLeft: '1rem', listStyleType: 'disc' }}>{line.substring(2)}</li>;
                  }
                  if (/^\d+\.\s/.test(line.trim())) {
                    return <li key={i} style={{ margin: '0.4rem 0', marginLeft: '1rem', listStyleType: 'decimal' }}>{line.replace(/^\d+\.\s/, '')}</li>;
                  }
                  return <p key={i} style={{ margin: '0.75rem 0' }}>{line || <br />}</p>;
                })}

                {/* Bottom scroll cue if page not completed */}
                {!hasScrolledToBottom && (
                  <motion.div
                    animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      textAlign: 'center', paddingTop: '3rem',
                      color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 600
                    }}
                  >
                    ↓ Scroll to bottom to unlock next step ↓
                  </motion.div>
                )}
                
                {hasScrolledToBottom && currentPage === totalPages - 1 && isCompleted(selectedId) && (
                  <div style={{
                    textAlign: 'center', padding: '3rem 1rem 1rem',
                    color: '#fbbf24', fontSize: '1.1rem', fontWeight: 700
                  }}>
                    🌟 Subject Complete! Your coin is now Golden!
                  </div>
                )}
              </div>

              {/* Pagination Footer */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '1rem 1.5rem',
                background: 'rgba(15,10,30,0.95)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '0.5rem 1rem', borderRadius: 8,
                    background: currentPage === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.1)',
                    color: currentPage === 0 ? 'rgba(255,255,255,0.2)' : 'white',
                    border: 'none', cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 600, transition: '0.2s'
                  }}
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                  {currentPage + 1} / {totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1 || !hasScrolledToBottom}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '0.5rem 1rem', borderRadius: 8,
                    background: (currentPage === totalPages - 1 || !hasScrolledToBottom) 
                      ? 'rgba(255,255,255,0.02)' 
                      : 'linear-gradient(135deg, #6c63ff, #a855f7)',
                    color: (currentPage === totalPages - 1 || !hasScrolledToBottom) 
                      ? 'rgba(255,255,255,0.2)' 
                      : 'white',
                    border: 'none', 
                    cursor: (currentPage === totalPages - 1 || !hasScrolledToBottom) ? 'not-allowed' : 'pointer',
                    fontWeight: 600, transition: '0.2s',
                    boxShadow: (!hasScrolledToBottom || currentPage === totalPages - 1) ? 'none' : '0 0 15px rgba(108,99,255,0.4)'
                  }}
                >
                  {currentPage === totalPages - 1 ? 'Finished' : 'Next Page'} <ArrowRight size={16} />
                </button>
              </div>

            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
