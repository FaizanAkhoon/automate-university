import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { signInWithEmail, signInWithGoogle } from '../utils/auth';
import { playNormalClick } from '../utils/sound';

export default function Login({ onLogin, theme }) {
  const isPink = theme === 'pink';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    playNormalClick();
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      onLogin();
    } catch (err) {
      alert("Sign in failed: " + err.message);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    playNormalClick();
    try {
      await signInWithGoogle();
      onLogin();
    } catch (err) {
      alert("Google sign in failed: " + err.message);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative z-50">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass p-8 md:p-10 rounded-2xl w-full max-w-md relative overflow-hidden"
        style={{
          background: isPink ? 'rgba(255,255,255,0.7)' : 'rgba(15,15,30,0.6)',
          border: isPink ? '1px solid rgba(255,182,193,0.5)' : '1px solid rgba(255,255,255,0.1)',
          boxShadow: isPink ? '0 25px 50px rgba(255,105,180,0.2)' : '0 25px 50px rgba(0,0,0,0.5)'
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6c63ff, #a855f7)', boxShadow: '0 10px 25px rgba(108,99,255,0.4)' }}>
            <ShieldCheck size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: isPink ? '#5c454f' : 'white' }}>Student Portal</h1>
          <p className="text-sm" style={{ color: isPink ? '#886c78' : 'rgba(255,255,255,0.5)' }}>Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: isPink ? '#5c454f' : 'rgba(255,255,255,0.7)' }}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={16} />
              <input type="email" placeholder="student@university.edu" className="input-glass w-full pl-9 py-3" required 
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: isPink ? '#5c454f' : 'rgba(255,255,255,0.7)' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={16} />
              <input type="password" placeholder="••••••••" className="input-glass w-full pl-9 py-3" required 
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2 group">
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs opacity-50">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button 
          onClick={handleGoogle}
          type="button"
          className="w-full mt-6 py-3 rounded-xl flex items-center justify-center gap-3 font-medium transition-all hover:-translate-y-1"
          style={{
            background: isPink ? 'white' : 'rgba(255,255,255,0.05)',
            border: isPink ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
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
        </button>
      </motion.div>
    </div>
  );
}
