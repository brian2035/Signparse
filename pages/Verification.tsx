
import React, { useState } from 'react';
import { ShieldCheck, Search, Loader2, CheckCircle2, ShieldAlert, FileText, Calendar, User } from 'lucide-react';

const Verification: React.FC = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'searching' | 'found' | 'not-found'>('idle');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setStatus('searching');
    setTimeout(() => {
      setStatus(query.length > 5 ? 'found' : 'not-found');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600/10 rounded-[2rem] text-blue-500 mb-4 ring-1 ring-blue-500/20">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Digital Verification</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Confirm the authenticity of any document signed via SignFlow using its unique ID or digital fingerprint.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <form onSubmit={handleVerify} className="relative z-10 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Enter Document ID (e.g., SF-99X-21Z)" 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={status === 'searching'}
            className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-bold hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {status === 'searching' && <Loader2 size={20} className="animate-spin" />}
            Verify Authenticity
          </button>
        </form>

        {status === 'found' && (
          <div className="mt-12 animate-in zoom-in-95 duration-500 p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-100">Verified Document</h3>
                <p className="text-xs text-emerald-500 font-medium uppercase tracking-widest mt-0.5">SHA-256 Verified Signature</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { label: 'Document Name', value: 'Service_Agreement_V2.pdf', icon: FileText },
                { label: 'Signed Date', value: 'Oct 24, 2023, 14:22 PM', icon: Calendar },
                { label: 'Signer Identity', value: 'John Doe (jd@example.com)', icon: User },
                { label: 'Platform ID', value: `SF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, icon: ShieldCheck }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                  <div className="text-slate-500 mt-1"><item.icon size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === 'not-found' && (
          <div className="mt-12 animate-in slide-in-from-top-4 duration-500 p-8 rounded-[2rem] bg-rose-500/5 border border-rose-500/20 flex items-center gap-6">
            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shrink-0">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-100">Verification Failed</h3>
              <p className="text-sm text-rose-400 leading-relaxed">
                The document ID provided could not be found in our secure registry. Please ensure the ID is correct or contact support if you suspect fraud.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-500 uppercase font-bold tracking-[0.3em]">SignFlow Trusted Infrastructure</p>
      </div>
    </div>
  );
};

export default Verification;
