
import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  ArrowRight, 
  FileCheck, 
  Briefcase, 
  ShieldAlert, 
  Users,
  Star,
  Check,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TEMPLATE_CATEGORIES = ['All', 'Legal', 'HR', 'Sales', 'Finance'];

const TEMPLATES = [
  { id: 't1', name: 'Mutual NDA', category: 'Legal', desc: 'Standard non-disclosure agreement for business meetings and partnerships.', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 't2', name: 'Offer Letter', category: 'HR', desc: 'Employment offer for new full-time hires with standard terms.', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 't3', name: 'Service Agreement', category: 'Sales', desc: 'Client services contract with scope of work and payment terms.', icon: FileCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 't4', name: 'Contractor Agreement', category: 'HR', desc: 'Agreement for independent contractors and freelancers.', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 't5', name: 'Board Resolution', category: 'Legal', desc: 'Internal document for corporate board approvals and records.', icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 't6', name: 'Invoice Template', category: 'Finance', desc: 'Standard business invoice for professional billing.', icon: Layers, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
];

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = TEMPLATES.filter(tmpl => {
    const matchesCategory = activeCategory === 'All' || tmpl.category === activeCategory;
    const matchesSearch = tmpl.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter flex items-center gap-3">
            <Layers className="text-blue-500" /> Template Library
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Verified industry-standard assets for your document workflows.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          <Plus size={20} /> Create New Template
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <aside className="space-y-8">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          
          <div className="bg-slate-900/50 rounded-[2.5rem] border border-white/5 p-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Asset Categories</h3>
            <div className="space-y-2">
              {TEMPLATE_CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {cat}
                  {activeCategory === cat && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="md:col-span-3 grid sm:grid-cols-2 gap-8">
          {filteredTemplates.length > 0 ? filteredTemplates.map((tmpl) => (
            <div 
              key={tmpl.id} 
              className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-8 rounded-[3rem] hover:border-blue-500/30 transition-all group flex flex-col cursor-pointer shadow-2xl"
              onClick={() => navigate(`/editor?name=${encodeURIComponent(tmpl.name)}.pdf`)}
            >
              <div className={`w-14 h-14 rounded-2xl ${tmpl.bg} ${tmpl.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <tmpl.icon size={28} />
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">{tmpl.name}</h3>
              <p className="text-sm text-slate-400 mb-8 flex-1 leading-relaxed font-medium">{tmpl.desc}</p>
              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-3 py-1 bg-white/5 rounded-full">{tmpl.category}</span>
                <div className="flex items-center gap-2 text-blue-500 font-black text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                  Adopt Template <ChevronRight size={16} />
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-2 py-20 text-center space-y-4 opacity-40">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">No templates matched</h3>
              <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Templates;
