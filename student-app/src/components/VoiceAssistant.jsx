import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, ExternalLink, Search, Loader2 } from 'lucide-react';

// ─── VOICE REDIRECT DATABASE ────────────────────────────────────────────────
const ROUTES = [
  // Driving & Transport
  { keywords: ['driving licence','driving license','dl apply','learner licence','learner license'], url: 'https://parivahan.gov.in/parivahan//en/content/online-learner-licence', label: 'Apply for Driving Licence — Parivahan' },
  { keywords: ['vehicle registration','rc registration','register vehicle','car registration'], url: 'https://parivahan.gov.in/parivahan//en/content/vehicle-registration', label: 'Vehicle Registration — Parivahan' },
  { keywords: ['international driving permit','idp'], url: 'https://parivahan.gov.in/parivahan//en/content/international-driving-permit', label: 'International Driving Permit — Parivahan' },

  // Identity & Documents
  { keywords: ['passport','passport apply','new passport','renew passport'], url: 'https://www.passportindia.gov.in/', label: 'Apply for Passport — Passport Seva' },
  { keywords: ['aadhaar','aadhar','aadhaar card','update aadhaar','aadhar card'], url: 'https://uidai.gov.in/', label: 'Aadhaar Services — UIDAI' },
  { keywords: ['pan card','pan apply','new pan','pan correction'], url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html', label: 'Apply for PAN Card — NSDL' },
  { keywords: ['voter id','voter card','epic','election card','voter registration'], url: 'https://voters.eci.gov.in/', label: 'Voter ID Registration — ECI' },
  { keywords: ['ration card','ration card apply'], url: 'https://nfsa.gov.in/', label: 'Ration Card — National Food Security' },
  { keywords: ['birth certificate','birth registration'], url: 'https://crsorgi.gov.in/web/index.php/auth/signUp', label: 'Birth Certificate — CRS' },
  { keywords: ['death certificate'], url: 'https://crsorgi.gov.in/web/index.php/auth/signUp', label: 'Death Certificate — CRS' },
  { keywords: ['income certificate','domicile certificate','caste certificate'], url: 'https://edistrict.up.gov.in/', label: 'eDistrict Services' },

  // Jobs & Recruitment
  { keywords: ['ssc','staff selection','ssc cgl','ssc chsl','ssc exam'], url: 'https://ssc.nic.in/', label: 'SSC — Staff Selection Commission' },
  { keywords: ['upsc','civil services','ias','ips','upsc exam','union public service'], url: 'https://www.upsc.gov.in/', label: 'UPSC — Union Public Service Commission' },
  { keywords: ['railway job','rrb','railway recruitment','indian railway job'], url: 'https://www.rrbcdg.gov.in/', label: 'Railway Recruitment Board' },
  { keywords: ['bank job','ibps','ibps clerk','ibps po','bank exam'], url: 'https://www.ibps.in/', label: 'IBPS — Bank Recruitment' },
  { keywords: ['naukri','job search','find job','jobs'], url: 'https://www.naukri.com/', label: 'Naukri.com — Job Search' },
  { keywords: ['government job','sarkari result','sarkari naukri','govt job'], url: 'https://www.sarkariresult.com/', label: 'Sarkari Result — Govt Jobs' },
  { keywords: ['defence job','army','navy','airforce','air force','indian army','join army'], url: 'https://www.joinindianarmy.nic.in/', label: 'Join Indian Army' },
  { keywords: ['police job','police recruitment','constable'], url: 'https://ssc.nic.in/', label: 'Police Recruitment — SSC' },
  { keywords: ['teaching job','ctet','tet','teacher eligibility'], url: 'https://ctet.nic.in/', label: 'CTET — Teacher Eligibility' },
  { keywords: ['neet','medical exam','neet ug','neet pg'], url: 'https://neet.nta.nic.in/', label: 'NEET — NTA' },
  { keywords: ['jee','jee main','jee advanced','engineering entrance'], url: 'https://jeemain.nta.ac.in/', label: 'JEE Main — NTA' },
  { keywords: ['gate','gate exam','graduate aptitude'], url: 'https://gate2025.iitr.ac.in/', label: 'GATE Exam' },
  { keywords: ['cat','mba entrance','cat exam','iim'], url: 'https://iimcat.ac.in/', label: 'CAT — MBA Entrance' },
  { keywords: ['internship','internshala'], url: 'https://internshala.com/', label: 'Internshala — Internships' },
  { keywords: ['linkedin','professional network'], url: 'https://www.linkedin.com/jobs/', label: 'LinkedIn Jobs' },

  // Education & Scholarships
  { keywords: ['scholarship','national scholarship','nsp','scholarship portal'], url: 'https://scholarships.gov.in/', label: 'National Scholarship Portal' },
  { keywords: ['ugc net','net exam','university grant'], url: 'https://ugcnet.nta.ac.in/', label: 'UGC NET — NTA' },
  { keywords: ['digilocker','digital locker','document locker'], url: 'https://www.digilocker.gov.in/', label: 'DigiLocker — Digital Documents' },
  { keywords: ['cbse result','cbse','board result'], url: 'https://www.cbse.gov.in/', label: 'CBSE Results' },
  { keywords: ['ignou','open university','distance education'], url: 'https://ignou.ac.in/', label: 'IGNOU — Distance Education' },
  { keywords: ['swayam','online course','mooc','free course'], url: 'https://swayam.gov.in/', label: 'SWAYAM — Free Online Courses' },

  // Finance & Tax
  { keywords: ['income tax','itr','file tax','tax return','efiling'], url: 'https://www.incometax.gov.in/', label: 'Income Tax e-Filing' },
  { keywords: ['gst','gst registration','gst return','goods and services tax'], url: 'https://www.gst.gov.in/', label: 'GST Portal' },
  { keywords: ['epfo','pf','provident fund','epf'], url: 'https://www.epfindia.gov.in/', label: 'EPFO — Provident Fund' },
  { keywords: ['mudra loan','mudra','business loan'], url: 'https://www.mudra.org.in/', label: 'MUDRA Loan Scheme' },
  { keywords: ['pm kisan','kisan samman','farmer scheme'], url: 'https://pmkisan.gov.in/', label: 'PM-KISAN Portal' },

  // Health & Welfare
  { keywords: ['ayushman','ayushman bharat','health insurance','pmjay'], url: 'https://pmjay.gov.in/', label: 'Ayushman Bharat — PMJAY' },
  { keywords: ['cowin','covid vaccine','vaccination','vaccine certificate'], url: 'https://www.cowin.gov.in/', label: 'CoWIN — Vaccination' },

  // Utilities
  { keywords: ['electricity bill','power bill','bijli bill'], url: 'https://www.npci.org.in/what-we-do/bharat-billpay/product-overview', label: 'Bharat BillPay — Electricity' },
  { keywords: ['gas booking','lpg','gas cylinder','indane','bharat gas','hp gas'], url: 'https://www.mybharat.in/', label: 'LPG Gas Booking' },
  { keywords: ['rti','right to information'], url: 'https://rtionline.gov.in/', label: 'RTI Online' },
  { keywords: ['fir','police complaint','online fir','cyber crime','cyber complaint'], url: 'https://cybercrime.gov.in/', label: 'Cyber Crime Reporting' },
  { keywords: ['consumer complaint','consumer forum','consumer court'], url: 'https://consumerhelpline.gov.in/', label: 'Consumer Helpline' },
  { keywords: ['property registration','land record','land registry'], url: 'https://dilrmp.gov.in/', label: 'Land Records — DILRMP' },
  { keywords: ['umang','umang app','government services'], url: 'https://web.umang.gov.in/', label: 'UMANG — Govt Services' },
];

function findBestMatch(transcript) {
  const lower = transcript.toLowerCase().trim();
  let bestMatch = null;
  let bestScore = 0;

  for (const route of ROUTES) {
    for (const kw of route.keywords) {
      if (lower.includes(kw)) {
        const score = kw.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = route;
        }
      }
    }
  }

  // Fallback: Google search
  if (!bestMatch) {
    return {
      url: `https://www.google.com/search?q=${encodeURIComponent(transcript + ' india official site')}`,
      label: `Google Search: "${transcript}"`,
      isFallback: true
    };
  }
  return bestMatch;
}

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [pulseAnim, setPulseAnim] = useState(false);
  const recognitionRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const startListening = () => {
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser. Use Chrome.');
      return;
    }
    setTranscript('');
    setResult(null);
    setError('');
    setIsListening(true);
    setPulseAnim(true);

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
      if (event.results[0].isFinal) {
        const match = findBestMatch(finalTranscript);
        setResult(match);
        setIsListening(false);
        setPulseAnim(false);
      }
    };

    recognition.onerror = (e) => {
      setError(e.error === 'no-speech' ? 'No speech detected. Try again.' : `Error: ${e.error}`);
      setIsListening(false);
      setPulseAnim(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setPulseAnim(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
    setPulseAnim(false);
  };

  const handleRedirect = () => {
    if (result?.url) window.open(result.url, '_blank');
  };

  return (
    <>
      {/* Floating Mic Button — Top Left */}
      <motion.button
        onClick={() => { setIsOpen(true); setTranscript(''); setResult(null); setError(''); }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: 'fixed', top: 80, left: 20, zIndex: 60,
          width: 48, height: 48, borderRadius: '50%',
          background: 'linear-gradient(135deg, #00f5d4, #00bbf9)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 24px rgba(0,245,212,0.4), 0 0 16px rgba(0,245,212,0.2)',
          color: '#0a0a0a', fontSize: '1.2rem'
        }}
        title="Voice Navigator"
      >
        <Mic size={20} strokeWidth={2.5} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsOpen(false); stopListening(); }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1200,
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(14px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '95vw', maxWidth: 440,
                background: 'linear-gradient(145deg, #111827, #0d0f18)',
                borderRadius: 24, overflow: 'hidden',
                border: '1px solid rgba(0,245,212,0.25)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 50px rgba(0,245,212,0.1)'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '1rem 1.25rem', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(0,245,212,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: 'linear-gradient(135deg, #00f5d4, #00bbf9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 14px rgba(0,245,212,0.4)'
                  }}>
                    <Mic size={16} color="#0a0a0a" />
                  </div>
                  <div>
                    <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1rem', margin: 0 }}>Voice Navigator</h2>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', margin: 0 }}>Speak to find any government service or job portal</p>
                  </div>
                </div>
                <button onClick={() => { setIsOpen(false); stopListening(); }} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '0.4rem', cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
                  display: 'flex'
                }}><X size={16} /></button>
              </div>

              {/* Body */}
              <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

                {/* Mic Circle */}
                <div style={{ position: 'relative' }}>
                  {pulseAnim && (
                    <>
                      <motion.div animate={{ scale: [1, 1.8], opacity: [0.4, 0] }} transition={{ duration: 1.2, repeat: Infinity }}
                        style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '2px solid #00f5d4' }} />
                      <motion.div animate={{ scale: [1, 2.2], opacity: [0.2, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                        style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '2px solid #00bbf9' }} />
                    </>
                  )}
                  <motion.button
                    onClick={isListening ? stopListening : startListening}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isListening ? { boxShadow: ['0 0 20px rgba(0,245,212,0.4)', '0 0 40px rgba(0,245,212,0.7)', '0 0 20px rgba(0,245,212,0.4)'] } : {}}
                    transition={isListening ? { duration: 1.2, repeat: Infinity } : {}}
                    style={{
                      width: 80, height: 80, borderRadius: '50%',
                      background: isListening
                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                        : 'linear-gradient(135deg, #00f5d4, #00bbf9)',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isListening ? 'white' : '#0a0a0a',
                      position: 'relative', zIndex: 1,
                      boxShadow: isListening
                        ? '0 0 30px rgba(239,68,68,0.5)'
                        : '0 0 30px rgba(0,245,212,0.4)'
                    }}
                  >
                    {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                  </motion.button>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', textAlign: 'center', fontWeight: 500 }}>
                  {isListening ? '🎤 Listening... speak now' : 'Tap the mic and say what you need'}
                </p>

                {/* Transcript */}
                {transcript && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                      width: '100%', padding: '0.8rem 1rem', borderRadius: 12,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', fontWeight: 600, marginBottom: 4 }}>YOU SAID:</p>
                    <p style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>"{transcript}"</p>
                  </motion.div>
                )}

                {/* Error */}
                {error && (
                  <p style={{ color: '#f87171', fontSize: '0.82rem', textAlign: 'center' }}>{error}</p>
                )}

                {/* Result */}
                {result && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{
                      padding: '1rem', borderRadius: 14,
                      background: result.isFallback ? 'rgba(251,191,36,0.08)' : 'rgba(0,245,212,0.08)',
                      border: `1px solid ${result.isFallback ? 'rgba(251,191,36,0.3)' : 'rgba(0,245,212,0.3)'}`,
                    }}>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: 600, marginBottom: 6 }}>
                        {result.isFallback ? '🔍 BEST GUESS' : '✅ FOUND MATCH'}
                      </p>
                      <p style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{result.label}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: 4, wordBreak: 'break-all' }}>{result.url}</p>
                    </div>

                    <motion.button
                      onClick={handleRedirect}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%', padding: '0.75rem', borderRadius: 12,
                        background: 'linear-gradient(135deg, #00f5d4, #00bbf9)',
                        border: 'none', cursor: 'pointer', color: '#0a0a0a',
                        fontWeight: 800, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: '0 4px 20px rgba(0,245,212,0.35)'
                      }}
                    >
                      <ExternalLink size={16} /> Go to this page
                    </motion.button>
                  </motion.div>
                )}

                {/* Example prompts */}
                {!transcript && !result && (
                  <div style={{ width: '100%' }}>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', fontWeight: 600, marginBottom: 8 }}>TRY SAYING:</p>
                    {[
                      '"Apply for driving licence"',
                      '"SSC CGL exam"',
                      '"Apply for passport"',
                      '"Government jobs"',
                      '"Income tax filing"',
                    ].map((ex, i) => (
                      <div key={i} style={{
                        padding: '0.5rem 0.7rem', marginBottom: 5, borderRadius: 8,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem'
                      }}>{ex}</div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
