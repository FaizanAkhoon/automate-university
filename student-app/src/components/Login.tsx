import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight, Sparkles, User, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../utils/auth';
import { playNormalClick } from '../utils/sound';

export default function Login({ onLogin, theme }) {
  const isPink = theme === 'pink';
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const switchMode = (newMode: 'signin' | 'signup') => {
    playNormalClick();
    setMode(newMode);
    setErrorMsg(null);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    playNormalClick();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error("Name is required");
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      onLogin();
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    playNormalClick();
    setErrorMsg(null);
    try {
      await signInWithGoogle();
      onLogin();
    } catch (err: any) {
      setErrorMsg(err.message || "Google sign in failed");
    }
  };

  const inputStyle = (id: string) => ({
    background: isPink ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.2)',
    border: focusedInput === id 
      ? `1px solid ${isPink ? '#ec4899' : '#a855f7'}` 
      : (isPink ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.05)'),
    color: isPink ? '#333' : 'white',
    boxShadow: focusedInput === id 
      ? `0 0 0 3px ${isPink ? 'rgba(236,72,153,0.15)' : 'rgba(168,85,247,0.15)'}` 
      : 'none'
  });

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative z-50">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="p-8 md:p-10 rounded-2xl w-full max-w-md relative overflow-hidden backdrop-blur-2xl"
        style={{
          background: isPink ? 'rgba(255,255,255,0.85)' : 'rgba(15,15,30,0.75)',
          border: isPink ? '1px solid rgba(255,182,193,0.6)' : '1px solid rgba(255,255,255,0.12)',
          boxShadow: isPink ? '0 30px 60px rgba(255,105,180,0.15)' : '0 30px 60px rgba(0,0,0,0.6)'
        }}
      >
        {/* Animated Gradient Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
        
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-[64px] opacity-30 animate-pulse pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[64px] opacity-30 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

        {/* Toggle Header */}
        <div className="flex justify-center mb-8 relative z-10">
          <div 
            className="flex p-1 rounded-xl w-full"
            style={{ 
              background: isPink ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.3)',
              border: isPink ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.05)' 
            }}
          >
            <button
              onClick={() => switchMode('signin')}
              className="flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 relative"
              style={{ color: mode === 'signin' ? (isPink ? '#ff1493' : '#a855f7') : (isPink ? '#886c78' : 'rgba(255,255,255,0.5)') }}
            >
              {mode === 'signin' && (
                <motion.div layoutId="auth-pill" className="absolute inset-0 rounded-lg shadow-sm" style={{ background: isPink ? 'white' : 'rgba(255,255,255,0.1)' }} />
              )}
              <span className="relative z-10">Sign In</span>
            </button>
            <button
              onClick={() => switchMode('signup')}
              className="flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 relative"
              style={{ color: mode === 'signup' ? (isPink ? '#ff1493' : '#a855f7') : (isPink ? '#886c78' : 'rgba(255,255,255,0.5)') }}
            >
              {mode === 'signup' && (
                <motion.div layoutId="auth-pill" className="absolute inset-0 rounded-lg shadow-sm" style={{ background: isPink ? 'white' : 'rgba(255,255,255,0.1)' }} />
              )}
              <span className="relative z-10">Create Account</span>
            </button>
          </div>
        </div>

        <div className="text-center mb-6 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center relative cursor-pointer" 
            style={{ background: 'linear-gradient(135deg, #6c63ff, #a855f7)', boxShadow: '0 10px 25px rgba(108,99,255,0.4)' }}
          >
            <ShieldCheck size={28} color="white" />
            <Sparkles size={12} color="#fff" className="absolute -top-1 -right-1 opacity-80" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: isPink ? '#5c454f' : 'white' }}>
            {mode === 'signin' ? 'Welcome Back' : 'Join the Portal'}
          </h1>
          <p className="text-sm font-medium" style={{ color: isPink ? '#886c78' : 'rgba(255,255,255,0.5)' }}>
            {mode === 'signin' ? 'Enter your credentials to access your dashboard' : 'Set up your student account in seconds'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0, mb: 0 }}
              animate={{ opacity: 1, height: 'auto', mb: 16 }}
              exit={{ opacity: 0, height: 0, mb: 0 }}
              className="relative z-10 bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2 overflow-hidden"
            >
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          <AnimatePresence mode="popLayout">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <label className="block text-[11px] font-bold mb-1.5 tracking-wider uppercase" style={{ color: isPink ? '#5c454f' : 'rgba(255,255,255,0.6)' }}>
                  Full Name
                </label>
                <div className="relative group">
                  <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === 'name' ? (isPink ? 'text-pink-500' : 'text-purple-500') : 'opacity-40'}`} size={18} />
                  <input 
                    type="text" 
                    placeholder="Jane Doe" 
                    required={mode === 'signup'}
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm font-medium"
                    style={inputStyle('name')}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-[11px] font-bold mb-1.5 tracking-wider uppercase" style={{ color: isPink ? '#5c454f' : 'rgba(255,255,255,0.6)' }}>
              Email Address
            </label>
            <div className="relative group">
              <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === 'email' ? (isPink ? 'text-pink-500' : 'text-purple-500') : 'opacity-40'}`} size={18} />
              <input 
                type="email" 
                placeholder="student@university.edu" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm font-medium"
                style={inputStyle('email')}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold mb-1.5 tracking-wider uppercase" style={{ color: isPink ? '#5c454f' : 'rgba(255,255,255,0.6)' }}>
              Password
            </label>
            <div className="relative group">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === 'password' ? (isPink ? 'text-pink-500' : 'text-purple-500') : 'opacity-40'}`} size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm font-medium"
                style={inputStyle('password')}
              />
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading} 
            className="w-full py-3.5 mt-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
            style={{
              background: isPink ? 'linear-gradient(135deg, #ff1493, #ffb6c1)' : 'linear-gradient(135deg, #6c63ff, #a855f7)',
              opacity: loading ? 0.7 : 1,
              boxShadow: isPink ? '0 10px 25px rgba(255,20,147,0.3)' : '0 10px 25px rgba(108,99,255,0.3)'
            }}
          >
            {loading ? (mode === 'signin' ? 'Authenticating...' : 'Creating account...') : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={18} />}
          </motion.button>
        </form>

        <div className="mt-6 flex items-center gap-4 relative z-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Or</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogle}
          type="button"
          className="w-full mt-6 py-3 rounded-xl flex items-center justify-center gap-3 text-sm font-bold transition-shadow relative z-10 shadow-sm hover:shadow-md"
          style={{
            background: isPink ? 'white' : 'rgba(255,255,255,0.05)',
            border: isPink ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.1)',
            color: isPink ? '#333' : 'white',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
}
