
import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Key, 
  Webhook, 
  BookOpen, 
  Copy, 
  Check, 
  Play, 
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  Code,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  Globe,
  Database,
  Users,
  Layers,
  Zap,
  FileText,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_URL = "https://i.ibb.co/5xCWL6pX/Sign-Parse-1.png";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: 'live' | 'test';
  createdAt: string;
}

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
}

interface SdkInfo {
  name: string;
  lang: string;
  icon: string;
  installCmd: string;
  code: string;
}

const SDKS: SdkInfo[] = [
  { 
    name: 'Node.js', 
    lang: 'JavaScript', 
    icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png',
    installCmd: 'npm install @signflow/sdk',
    code: `const { SignFlow } = require('@signflow/sdk');\n\nconst client = new SignFlow({\n  apiKey: 'sk_live_...'\n});`
  },
  { 
    name: 'Python', 
    lang: 'Python 3.x', 
    icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png',
    installCmd: 'pip install signflow-python',
    code: `import signflow\n\nclient = signflow.Client(\n    api_key="sk_live_..."\n)`
  },
  { 
    name: 'Go', 
    lang: 'Golang 1.18+', 
    icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968258.png',
    installCmd: 'go get github.com/signflow/signflow-go',
    code: `import "github.com/signflow/signflow-go"\n\nclient := signflow.NewClient("sk_live_...")`
  },
  { 
    name: 'Ruby', 
    lang: 'Ruby Gem', 
    icon: 'https://cdn-icons-png.flaticon.com/512/919/919842.png',
    installCmd: 'gem install signflow',
    code: `require 'signflow'\n\nsignflow.api_key = 'sk_live_...'`
  },
  { 
    name: 'PHP', 
    lang: 'Composer', 
    icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968332.png',
    installCmd: 'composer require signflow/signflow-php',
    code: `$signflow = new \\SignFlow\\SignFlowClient('sk_live_...');`
  },
  { 
    name: 'C#', 
    lang: '.NET Core', 
    icon: 'https://cdn-icons-png.flaticon.com/512/6132/6132221.png',
    installCmd: 'dotnet add package SignFlow.Sdk',
    code: `using SignFlow;\n\nvar client = new SignFlowClient("sk_live_...");`
  },
];

const DeveloperPortal: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: '1', name: 'Production Key', key: 'sk_live_51MzS0vSignFlowLive881', type: 'live', createdAt: '2023-10-15' },
    { id: '2', name: 'Staging Environment', key: 'sk_test_51MzS0vSignFlowTest229', type: 'test', createdAt: '2023-11-01' }
  ]);

  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isApiRefOpen, setIsApiRefOpen] = useState(false);
  const [activeRefTab, setActiveRefTab] = useState('Introduction');
  const [isSdkModalOpen, setIsSdkModalOpen] = useState(false);
  const [activeSdk, setActiveSdk] = useState<SdkInfo | null>(null);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState<'live' | 'test'>('test');
  
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['signature.completed']);
  const [isTestingWebhook, setIsTestingWebhook] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateKey = () => {
    if (!newKeyName) return;
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_${newKeyType}_${Math.random().toString(36).substr(2, 12)}${Math.random().toString(36).substr(2, 8)}`,
      type: newKeyType,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setApiKeys([...apiKeys, newKey]);
    setIsApiKeyModalOpen(false);
    setNewKeyName('');
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const handleAddWebhook = () => {
    if (!webhookUrl) return;
    const newWebhook: WebhookEndpoint = {
      id: Date.now().toString(),
      url: webhookUrl,
      events: selectedEvents,
      status: 'active'
    };
    setWebhooks([...webhooks, newWebhook]);
    setIsWebhookModalOpen(false);
    setWebhookUrl('');
  };

  const testWebhook = (id: string) => {
    setIsTestingWebhook(id);
    setTimeout(() => {
      setIsTestingWebhook(null);
      alert('Webhook ping successful! Status: 200 OK');
    }, 1500);
  };

  const codeSnippet = `const signflow = require('signflow-sdk');

const client = new signflow.Client({
  apiKey: '${apiKeys[0]?.key || 'YOUR_API_KEY_HERE'}'
});

const result = await client.documents.create({
  name: 'Contract.pdf',
  recipients: [{
    email: 'client@example.com',
    role: 'SIGNER'
  }]
});`;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">Developer Center</h1>
          <p className="text-slate-400 mt-2 text-lg font-medium">Build, integrate, and scale secure e-signature workflows.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsApiRefOpen(true)}
            className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all text-slate-300"
          >
            <BookOpen size={18} /> API Documentation
          </button>
          <button 
            onClick={() => setIsApiKeyModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            <Plus size={18} /> Create API Key
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* API Keys Card */}
          <section className="bg-slate-900/50 backdrop-blur-md rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
                  <Key size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white">Active API Keys</h3>
                  <p className="text-slate-400 text-sm font-medium">Authenticated keys for API access.</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {apiKeys.map(key => (
                <div key={key.id} className="p-6 rounded-3xl bg-slate-950/50 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-blue-500/30 transition-all">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-base font-bold text-white">{key.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-black tracking-widest ${key.type === 'live' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {key.type}
                      </span>
                    </div>
                    <code className="text-xs text-slate-500 font-mono break-all">{copiedKeyId === key.id ? key.key : key.key.replace(/(.{8}).+(.{4})/, '$1****************$2')}</code>
                    <p className="text-[10px] text-slate-600 font-bold mt-2 uppercase tracking-widest">Created on {key.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => copyToClipboard(key.key, key.id)}
                      className="p-3 bg-slate-900 hover:bg-blue-600/10 rounded-xl text-slate-400 hover:text-blue-500 transition-all"
                      title="Copy Key"
                    >
                      {copiedKeyId === key.id ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                    <button 
                      onClick={() => handleDeleteKey(key.id)}
                      className="p-3 bg-slate-900 hover:bg-rose-500/10 rounded-xl text-slate-400 hover:text-rose-500 transition-all"
                      title="Delete Key"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Code Playbook */}
          <section className="bg-slate-900/50 backdrop-blur-md rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Terminal size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white">Execution Playbook</h3>
                  <p className="text-slate-400 text-sm font-medium">Initialize the Node.js client.</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-slate-950 font-mono text-sm relative group overflow-hidden">
              <div className="absolute top-6 right-6 flex gap-2">
                <button onClick={() => copyToClipboard(codeSnippet, 'code')} className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-all">
                  {copiedKeyId === 'code' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
              </div>
              <pre className="text-emerald-400 overflow-x-auto p-2">
                {codeSnippet}
              </pre>
            </div>
          </section>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-10">
          <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl group">
             <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
             <div className="relative z-10">
               <div className="h-64 w-auto flex items-center justify-start p-2 mb-8 overflow-hidden">
                 <img src={LOGO_URL} alt="Sign-Parse Logo" className="h-full w-auto object-contain brightness-0 invert" />
               </div>
               <h3 className="text-2xl font-extrabold mb-4 tracking-tight">Multi-SDK Platform</h3>
               <p className="text-blue-100/80 text-sm mb-10 leading-relaxed font-medium">
                 Direct integrations for Node.js, Python, Ruby, PHP, and Go. High-performance gRPC supported.
               </p>
               <button 
                onClick={() => { setIsSdkModalOpen(true); setActiveSdk(null); }}
                className="w-full py-4 bg-white text-blue-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
               >
                 <Code size={18} /> Explore Our SDKs
               </button>
             </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md p-10 rounded-[40px] border border-white/5 shadow-2xl">
            <h3 className="text-xl font-extrabold mb-4 text-white">Webhook Pipeline</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">Receive real-time document events instantly.</p>
            
            <div className="space-y-4 mb-8">
              {webhooks.length === 0 ? (
                <div className="p-6 border border-dashed border-white/5 rounded-3xl text-center">
                  <Globe size={32} className="mx-auto text-slate-700 mb-3" />
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">No endpoints registered</p>
                </div>
              ) : (
                webhooks.map(hook => (
                  <div key={hook.id} className="p-4 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-between group">
                    <div className="truncate pr-4">
                      <p className="text-xs font-bold text-white truncate">{hook.url}</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{hook.events.length} events</p>
                    </div>
                    <button 
                      onClick={() => testWebhook(hook.id)}
                      disabled={isTestingWebhook === hook.id}
                      className="p-2 bg-white/5 hover:bg-emerald-500/20 rounded-lg text-slate-400 hover:text-emerald-500 transition-all"
                    >
                      {isTestingWebhook === hook.id ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                    </button>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => setIsWebhookModalOpen(true)}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Webhook size={16} /> Configure Webhook
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isApiKeyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            {/* @ts-ignore - bypassing framer-motion type mismatch in this environment */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/5 rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-white">Create New Key</h2>
                <button onClick={() => setIsApiKeyModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Key Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Marketing Website"
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Environment</label>
                   <div className="grid grid-cols-2 gap-4">
                     <button 
                      onClick={() => setNewKeyType('test')}
                      className={`py-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${newKeyType === 'test' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/10'}`}
                     >
                       <Terminal size={20} />
                       <span className="text-xs font-bold uppercase tracking-widest">Sandbox</span>
                     </button>
                     <button 
                      onClick={() => setNewKeyType('live')}
                      className={`py-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${newKeyType === 'live' ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/10'}`}
                     >
                       <RefreshCw size={20} />
                       <span className="text-xs font-bold uppercase tracking-widest">Production</span>
                     </button>
                   </div>
                </div>
                <button 
                  onClick={handleCreateKey}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] font-extrabold text-lg shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Generate Secret Key <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isSdkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            {/* @ts-ignore - bypassing framer-motion type mismatch in this environment */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-slate-900 border border-white/5 rounded-[40px] w-full max-w-4xl overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white">SDK Explorer</h2>
                  <p className="text-slate-400 font-medium">Choose your stack to begin integration.</p>
                </div>
                <button onClick={() => setIsSdkModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-10">
                <AnimatePresence mode="wait">
                  {!activeSdk ? (
                    /* @ts-ignore - bypassing framer-motion type mismatch in this environment */
                    <motion.div 
                      key="grid"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="grid md:grid-cols-3 gap-6"
                    >
                      {SDKS.map((sdk, i) => (
                        <div key={i} className="bg-slate-950 p-6 rounded-[32px] border border-white/5 hover:border-blue-500/40 transition-all group flex flex-col items-center text-center">
                          <img src={sdk.icon} className="w-12 h-12 mb-6 group-hover:scale-110 transition-transform" alt={sdk.name} />
                          <h4 className="text-white font-bold text-lg">{sdk.name}</h4>
                          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-1 mb-6">{sdk.lang}</p>
                          <button 
                            onClick={() => setActiveSdk(sdk)}
                            className="w-full py-3 bg-slate-900 group-hover:bg-blue-600 text-slate-300 group-hover:text-white rounded-xl text-xs font-bold transition-all"
                          >
                            View Installation
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    /* @ts-ignore - bypassing framer-motion type mismatch in this environment */
                    <motion.div 
                      key="detail"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <button 
                        onClick={() => setActiveSdk(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold"
                      >
                        <ChevronLeft size={18} /> Back to Explorer
                      </button>
                      
                      <div className="flex items-center gap-6">
                        <img src={activeSdk.icon} className="w-16 h-16" alt={activeSdk.name} />
                        <div>
                          <h3 className="text-2xl font-extrabold text-white">{activeSdk.name} Integration</h3>
                          <p className="text-slate-500 font-medium">Installation and sample usage for {activeSdk.lang}.</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <section className="space-y-3">
                          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">1. Installation</h4>
                          <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 font-mono text-sm flex items-center justify-between group">
                            <code className="text-emerald-400">{activeSdk.installCmd}</code>
                            <button 
                              onClick={() => copyToClipboard(activeSdk.installCmd, 'install')}
                              className="text-slate-500 hover:text-white transition-colors"
                            >
                              {copiedKeyId === 'install' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                            </button>
                          </div>
                        </section>

                        <section className="space-y-3">
                          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">2. Sample Usage</h4>
                          <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 font-mono text-sm relative">
                            <pre className="text-blue-400 overflow-x-auto">
                              {activeSdk.code}
                            </pre>
                            <button 
                              onClick={() => copyToClipboard(activeSdk.code, 'code-sample')}
                              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                            >
                              {copiedKeyId === 'code-sample' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                            </button>
                          </div>
                        </section>
                      </div>

                      <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20">
                        Read Full {activeSdk.name} Reference <ExternalLink size={18} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}

        {isWebhookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            {/* @ts-ignore - bypassing framer-motion type mismatch in this environment */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/5 rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-white">Configure Webhook</h2>
                <button onClick={() => setIsWebhookModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Payload URL</label>
                  <div className="relative">
                    <Globe size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input 
                      type="url" 
                      placeholder="https://api.yourdomain.com/webhooks"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Events to Listen</label>
                   <div className="grid grid-cols-1 gap-2">
                     {[
                       'document.created',
                       'signature.completed',
                       'signature.rejected',
                       'verification.failed'
                     ].map((evt) => (
                       <button 
                        key={evt}
                        onClick={() => {
                          if (selectedEvents.includes(evt)) {
                            setSelectedEvents(selectedEvents.filter(e => e !== evt));
                          } else {
                            setSelectedEvents([...selectedEvents, evt]);
                          }
                        }}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedEvents.includes(evt) ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-white/5 text-slate-500 hover:border-white/10'}`}
                       >
                         <span className="text-xs font-bold font-mono">{evt}</span>
                         {selectedEvents.includes(evt) && <CheckCircle2 size={16} />}
                       </button>
                     ))}
                   </div>
                </div>
                <button 
                  onClick={handleAddWebhook}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] font-extrabold text-lg shadow-2xl shadow-blue-500/30 transition-all"
                >
                  Enable Webhook Delivery
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isApiRefOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            {/* @ts-ignore - bypassing framer-motion type mismatch in this environment */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="bg-slate-950 h-full w-full max-w-5xl rounded-[40px] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-10 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-2xl">
                    <BookOpen size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">API Reference v2.0</h2>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1">REST API & SDK Documentation</p>
                  </div>
                </div>
                <button onClick={() => setIsApiRefOpen(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                <nav className="w-64 border-r border-white/10 p-10 space-y-8 bg-slate-900/20 shrink-0 hidden md:block overflow-y-auto">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Core Endpoints</p>
                    {[
                      { id: 'Introduction', icon: BookOpen },
                      { id: 'Authentication', icon: Key },
                      { id: 'Pagination', icon: Zap }
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveRefTab(tab.id)}
                        className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeRefTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        <tab.icon size={14} /> {tab.id}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Resources</p>
                    {[
                      { id: 'Documents', icon: FileText },
                      { id: 'Signers', icon: Users },
                      { id: 'Workspaces', icon: Layers }
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveRefTab(tab.id)}
                        className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeRefTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        <tab.icon size={14} /> {tab.id}
                      </button>
                    ))}
                  </div>
                </nav>
                
                <div className="flex-1 overflow-y-auto p-12 space-y-12">
                  <section className="prose prose-invert max-w-none">
                    {activeRefTab === 'Introduction' && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-6">Introduction</h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                          The SignFlow API is organized around REST. Our API has predictable resource-oriented URLs, 
                          accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP 
                          response codes, authentication, and verbs.
                        </p>
                        <div className="bg-slate-900 border border-white/5 rounded-[32px] p-8 mt-12">
                          <div className="flex items-center gap-3 text-emerald-400 mb-4">
                            <AlertCircle size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Base Endpoint</span>
                          </div>
                          <code className="text-xl font-mono text-white">https://api.signflow.com/v2</code>
                        </div>
                      </div>
                    )}

                    {activeRefTab === 'Authentication' && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-6">Authentication</h1>
                        <p className="text-slate-400 leading-relaxed mb-6">
                          Authenticating with the SignFlow API is done via API Keys. You must provide your secret key in the `Authorization` header as a Bearer token.
                        </p>
                        <div className="bg-slate-950 border border-white/5 rounded-[32px] overflow-hidden">
                           <div className="bg-slate-900 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">cURL Example</span>
                             <button className="text-slate-500 hover:text-blue-400 transition-colors"><Copy size={14} /></button>
                           </div>
                           <pre className="p-8 text-blue-400 text-sm font-mono overflow-x-auto">
                            {`curl https://api.signflow.com/v2/documents \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json"`}
                           </pre>
                        </div>
                      </div>
                    )}

                    {activeRefTab === 'Pagination' && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-6">Pagination</h1>
                        <p className="text-slate-400 leading-relaxed mb-6">
                          All top-level API resources support bulk fetches via "list" API methods. These list API methods share a common structure, taking at least these two parameters: `limit` and `starting_after`.
                        </p>
                        <div className="bg-slate-950 border border-white/5 rounded-[32px] overflow-hidden">
                          <pre className="p-8 text-emerald-400 text-sm font-mono overflow-x-auto">
                            {`{
  "object": "list",
  "url": "/v2/documents",
  "has_more": false,
  "data": [...]
}`}
                          </pre>
                        </div>
                      </div>
                    )}

                    {activeRefTab === 'Documents' && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-6">Documents</h1>
                        <p className="text-slate-400 leading-relaxed mb-6">Manage document assets, upload files, and retrieve signing status.</p>
                        <div className="space-y-4">
                          <div className="p-4 bg-slate-900 rounded-2xl flex items-center gap-4">
                            <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-xs font-black">GET</span>
                            <code className="text-white text-sm font-mono">/v2/documents</code>
                          </div>
                          <div className="p-4 bg-slate-900 rounded-2xl flex items-center gap-4">
                            <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-lg text-xs font-black">POST</span>
                            <code className="text-white text-sm font-mono">/v2/documents</code>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeRefTab === 'Signers' && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-6">Signers</h1>
                        <p className="text-slate-400 leading-relaxed mb-6">Create and manage signers for specific document instances.</p>
                        <div className="p-4 bg-slate-900 rounded-2xl flex items-center gap-4 mb-4">
                          <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-lg text-xs font-black">POST</span>
                          <code className="text-white text-sm font-mono">/v2/documents/:id/signers</code>
                        </div>
                      </div>
                    )}

                    {activeRefTab === 'Workspaces' && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-6">Workspaces</h1>
                        <p className="text-slate-400 leading-relaxed mb-6">Retrieve workspace settings and manage team organization.</p>
                        <div className="p-4 bg-slate-900 rounded-2xl flex items-center gap-4">
                          <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-xs font-black">GET</span>
                          <code className="text-white text-sm font-mono">/v2/workspaces</code>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeveloperPortal;
