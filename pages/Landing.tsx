
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, Globe, Users, Code, ArrowRight, PlayCircle, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const LOGO_URL = "https://i.ibb.co/7dZM5KXh/2.png";

const Landing: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-40 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-blue-400 text-sm font-bold tracking-tight mb-10 backdrop-blur-xl"
          >
            The Developer-First Choice
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent leading-[0.9]"
          >
            Signing documents <br /> redefined by AI.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            SignFlow merges enterprise-grade security with deep document intelligence. Auto-detect fields, verify identities, and sign securely in seconds.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link to="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[20px] font-bold text-lg shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 active:scale-95">
              Start Building Free <ArrowRight size={20} />
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-[20px] font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-white backdrop-blur-md">
              <PlayCircle size={20} /> Explore Intelligence Demo
            </button>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', damping: 25 }}
          className="max-w-7xl mx-auto mt-24 relative px-6"
        >
          <div className="relative glass p-3 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" alt="Dashboard" className="rounded-[30px] w-full shadow-inner opacity-90 border border-white/5" />
          </div>
          
          {/* Floating Badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-12 -right-4 bg-emerald-500 text-white p-6 rounded-3xl shadow-2xl z-20 hidden lg:block"
          >
            <FileCheck size={32} />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-slate-950/50 relative px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-white">The standard for <br /> intelligent workflows.</h2>
              <p className="text-xl text-slate-400 font-medium">Industry-leading features built for high-scale document orchestration.</p>
            </div>
          </div>

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
                <motion.div 
                  key={i}
                  variants={item}
                  className="p-10 rounded-[40px] bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform duration-500">
                    <FeatureIcon size={28} />
                  </div>
                  <h3 className="text-2xl font-extrabold mb-4 text-white tracking-tight">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[50px] p-20 text-white relative overflow-hidden shadow-[0_40px_100px_-15px_rgba(59,130,246,0.4)]">
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px]"></div>
          <div className="grid md:grid-cols-4 gap-16 text-center relative z-10">
            {[
              { val: '25M+', label: 'Documents Parsed' },
              { val: '120k+', label: 'Teams Onboarded' },
              { val: '99.9%', label: 'Uptime SLA' },
              { val: '15+', label: 'Native SDKs' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-5xl font-black mb-3 tracking-tighter">{stat.val}</div>
                <div className="text-blue-100 text-sm font-bold uppercase tracking-widest opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center text-slate-500">
        <div className="flex items-center justify-center mb-6">
          <div className="h-28 w-auto flex items-center justify-center p-2 overflow-hidden transition-transform hover:scale-105 duration-500">
            <img src={LOGO_URL} alt="SignFlow Logo" className="h-full w-auto object-contain" />
          </div>
        </div>
        <p className="font-medium text-xs">© 2025 SignFlow Intelligence. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
