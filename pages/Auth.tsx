
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_URL = "https://i.ibb.co/5xCWL6pX/Sign-Parse-1.png";
const GOOGLE_LOGO = "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg";
const APPLE_LOGO = "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'individual' | 'company_admin'>('individual');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email || 'demo@signparse.com', role);
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  const handleSSO = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      login(`${provider.toLowerCase()}@example.com`, 'individual');
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      {/* @ts-ignore - bypassing framer-motion type mismatch in this environment */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="w-full max-w-xl space-y-6 relative z-10"
      >
        <div className="text-center">
          <div className="inline-flex w-full h-96 items-center justify-center p-2 mb-4 transition-transform hover:scale-105 duration-500 overflow-hidden">
            <img src={LOGO_URL} alt="SignParse Logo" className="h-full w-auto object-contain" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="text-slate-400 text-base font-medium">
            {isLogin ? 'Welcome back to the standard of trust.' : 'Agree smarter with intelligent signatures.'}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-white/5 rounded-[48px] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          
          {/* Official Google Sign-In Button */}
          <button 
            onClick={() => handleSSO('Google')}
            className="w-full flex items-center justify-center gap-4 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-white/5 active:scale-[0.98] mb-6"
          >
            <img src={GOOGLE_LOGO} alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>

          <div className="mb-8 flex items-center gap-6 text-slate-600">
            <div className="flex-1 h-px bg-white/5"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Or use email</span>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          {/* Auth Mode Toggle */}
          <div className="flex p-1.5 bg-slate-950 rounded-[20px] mb-8 border border-white/5">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[14px] transition-all duration-300 ${isLogin ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[14px] transition-all duration-300 ${!isLogin ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                /* @ts-ignore - bypassing framer-motion type mismatch in this environment */
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block ml-1">Account Category</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setRole('individual')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border transition-all duration-300 ${role === 'individual' ? 'border-blue-600 bg-blue-600/10 text-white' : 'border-white/5 text-slate-500 hover:border-white/20'}`}
                    >
                      <User size={20} />
                      <span className="text-xs font-extrabold tracking-tight">Individual</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole('company_admin')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border transition-all duration-300 ${role === 'company_admin' ? 'border-blue-600 bg-blue-600/10 text-white' : 'border-white/5 text-slate-500 hover:border-white/20'}`}
                    >
                      <Building2 size={20} />
                      <span className="text-xs font-extrabold tracking-tight">Enterprise</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block ml-1">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] block ml-1">Secure Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] font-extrabold text-base shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'Enter Workspace' : 'Initialize Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-6 text-slate-600">
            <div className="flex-1 h-px bg-white/5"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Other options</span>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => handleSSO('Apple')}
              className="flex items-center justify-center gap-3 py-3.5 bg-slate-950 border border-white/5 rounded-2xl text-xs font-bold hover:bg-white/5 transition-all text-slate-300"
            >
              <img src={APPLE_LOGO} alt="Apple" className="w-4 h-4 invert" />
              Sign in with Apple
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-500 font-medium">
          Protected by AES-256 bank-level encryption. <br />
          By continuing, you accept our <button className="text-blue-500 hover:underline">Compliance Standards</button>.
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
