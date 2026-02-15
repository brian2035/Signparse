
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Lock, 
  Globe, 
  Users, 
  Code, 
  ArrowRight, 
  PlayCircle, 
  FileCheck, 
  CheckCircle2, 
  Eye, 
  Database, 
  Fingerprint,
  Cpu,
  ShieldCheck,
  Activity,
  ChevronRight,
  PenTool,
  Keyboard,
  MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_URL = "https://i.ibb.co/5xCWL6pX/Sign-Parse-1.png";

const Landing: React.FC = () => {
  // Add as const to fix type inference for framer-motion variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

  // Add as const to fix type error where 'spring' was inferred as string instead of literal
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
  } as const;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[180px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center">
          {/* @ts-ignore - bypassing framer-motion type mismatch in this environment */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-blue-400 text-sm font-bold tracking-tight mb-10 backdrop-blur-xl"
          >
            SignParse Intelligence v2.0
          </motion.div>
          
          {/* @ts-ignore - bypassing framer-motion type mismatch in this environment */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-[10rem] font-extrabold tracking-tighter mb-10 bg-gradient-to-b from-white via-white to-slate-600 bg-clip-text text-transparent leading-[0.8]"
          >
            Agree <br /> smarter.
          </motion.h1>
          
          {/* @ts-ignore - bypassing framer-motion type mismatch in this environment */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-3xl text-slate-400 mb-16 max-w-3xl mx-auto leading-tight font-medium tracking-tight"
          >
            SignParse merges enterprise-grade security with deep document intelligence. Auto-detect fields, verify identities, and finalize agreements in seconds.
          </motion.p>
          
          {/* @ts-ignore - bypassing framer-motion type mismatch in this environment */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/dashboard" className="w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] font-bold text-xl shadow-2xl shadow-blue-500/40 transition-all flex items-center justify-center gap-3 active:scale-95 group">
              Start Building Free <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 rounded-[24px] font-bold text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-white backdrop-blur-md">
              <PlayCircle size={22} /> Explore Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* NEW: Signature Tools Section */}
      <section className="py-24 relative px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">Create your mark.</h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">Multiple ways to express intent, all backed by cryptographic verification.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Draw Signature */}
            {/* @ts-ignore */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[48px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/10 transition-colors"></div>
              <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-blue-500/10">
                <PenTool size={36} />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-white tracking-tight">Draw Signature</h3>
              <p className="text-slate-400 leading-relaxed font-medium text-lg mb-8">
                Use a touchpad, mouse, phone, tablet, or other mobile device to draw a free downloadable online signature. Customize smoothing, color, and more. Download as PNG/JPG.
              </p>
              <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/50">Digital Ink Engine</span>
                <Link to="/draw" className="flex items-center gap-2 text-white font-bold text-sm hover:gap-3 transition-all">
                  Try Drawing <ArrowRight size={16} className="text-blue-500" />
                </Link>
              </div>
            </motion.div>

            {/* Type Signature */}
            {/* @ts-ignore */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[48px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-600/10 transition-colors"></div>
              <div className="w-20 h-20 bg-emerald-600/10 rounded-3xl flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-emerald-500/10">
                <Keyboard size={36} />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-white tracking-tight">Type Signature</h3>
              <p className="text-slate-400 leading-relaxed font-medium text-lg mb-8">
                Type out an online signature and choose from several great-looking handwriting fonts. Customize the style, colors, and more.
              </p>
              <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/50">Typography Engine</span>
                <Link to="/type" className="flex items-center gap-2 text-white font-bold text-sm hover:gap-3 transition-all">
                  Try Typing <ArrowRight size={16} className="text-emerald-500" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-slate-950/50 relative px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 text-white">The standard for <br /> intelligent workflows.</h2>
              <p className="text-2xl text-slate-400 font-medium tracking-tight">Industry-leading features built for high-scale document orchestration.</p>
            </div>
          </div>

          {/* @ts-ignore - bypassing framer-motion type mismatch in this environment */}
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: Shield, title: 'Smart Compliance', desc: 'Legally binding e-signatures that adapt to eIDAS and UETA standards with zero friction.' },
              { icon: Lock, title: 'Quantum Encryption', desc: 'Secure your assets with AES-256-GCM and HSM-backed key management systems.' },
              { icon: Zap, title: 'Gemini Detection', desc: 'Proprietary AI field parsing identifies placement logic for you automatically.' },
              { icon: Globe, title: 'Global Identity', desc: 'Verify signers in 150+ countries with integrated KYC and biometrics.' },
              { icon: Users, title: 'Team Workspaces', desc: 'Enterprise-grade permissioning and organizational branding for any scale.' },
              { icon: Code, title: 'Atomic API', desc: 'The world\'s most expressive signing API. Integrate once, scale forever.' }
            ].map((feature, i) => {
              const FeatureIcon = feature.icon;
              return (
                /* @ts-ignore - bypassing framer-motion type mismatch in this environment */
                <motion.div 
                  key={i}
                  variants={item}
                  className="p-12 rounded-[48px] bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-400 mb-10 group-hover:scale-110 transition-transform duration-500">
                    <FeatureIcon size={32} />
                  </div>
                  <h3 className="text-3xl font-extrabold mb-5 text-white tracking-tight">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed font-medium text-lg">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {['VentureOne', 'CloudSphere', 'AtomicData', 'SecureNode', 'LogicGate'].map(partner => (
              <span key={partner} className="text-2xl font-black tracking-tighter text-white">{partner}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[64px] p-24 text-white relative overflow-hidden shadow-[0_60px_120px_-20px_rgba(59,130,246,0.5)]">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px]"></div>
          <div className="grid md:grid-cols-4 gap-20 text-center relative z-10">
            {[
              { val: '25M+', label: 'Documents Parsed' },
              { val: '120k+', label: 'Teams Onboarded' },
              { val: '99.9%', label: 'Uptime SLA' },
              { val: '15+', label: 'Native SDKs' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-6xl font-black mb-4 tracking-tighter">{stat.val}</div>
                <div className="text-blue-100 text-sm font-bold uppercase tracking-[0.3em] opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-32 border-t border-white/5 text-center text-slate-500">
        <div className="flex items-center justify-center mb-10">
          <div className="h-80 w-auto flex items-center justify-center p-2 overflow-hidden transition-transform hover:scale-105 duration-500">
            <img src={LOGO_URL} alt="SignParse Logo" className="h-full w-auto object-contain" />
          </div>
        </div>
        <div className="flex justify-center gap-12 mb-10 text-sm font-bold text-slate-400">
          <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link to="/verify" className="hover:text-white transition-colors">Verification</Link>
          <Link to="/developer" className="hover:text-white transition-colors">Developer Portal</Link>
          <a href="#" className="hover:text-white transition-colors">Status</a>
        </div>
        <p className="font-bold text-sm text-slate-300 mb-2">Agree smarter.</p>
        <p className="font-medium text-xs">© 2025 SignParse Intelligence. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;