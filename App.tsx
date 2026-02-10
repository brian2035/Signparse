
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import DeveloperPortal from './pages/DeveloperPortal';
import Documents from './pages/Documents';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import Verification from './pages/Verification';
import Auth from './pages/Auth';
import { PRICING_PLANS } from './constants';
import { Check } from 'lucide-react';

// Pricing Page Sub-component
const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSelectPlan = (planName: string) => {
    // Navigate to settings with Billing tab active to connect payment
    navigate('/settings?tab=Billing&plan=' + encodeURIComponent(planName));
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tighter text-white">Standard of Trust Pricing</h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg font-medium">Legally binding signatures that scale with your document intelligence needs.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {PRICING_PLANS.map((plan, i) => (
          <div key={i} className={`
            relative p-12 rounded-[4rem] border transition-all hover:scale-[1.02] duration-500 group
            ${plan.popular ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/30 border-blue-600' : 'bg-slate-900/50 backdrop-blur-md border-white/5 shadow-sm'}
          `}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest border border-white/10">Industry Standard</div>
            )}
            <h3 className="text-3xl font-black mb-2 tracking-tight">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-10">
              <span className="text-6xl font-black">{plan.price}</span>
              {plan.price !== 'Custom' && <span className="text-sm opacity-60 font-bold">/mo</span>}
            </div>
            <ul className="space-y-5 mb-14">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-4 text-sm font-medium">
                  <div className={`p-1 rounded-full ${plan.popular ? 'bg-blue-400/20 text-white' : 'bg-blue-600/10 text-blue-500'}`}>
                    <Check size={16} />
                  </div>
                  <span className={plan.popular ? 'text-blue-50' : 'text-slate-400'}>{f}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSelectPlan(plan.name)}
              className={`
                w-full py-5 rounded-[2rem] font-black transition-all text-xs uppercase tracking-[0.2em]
                ${plan.popular ? 'bg-white text-blue-600 hover:bg-slate-50' : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'}
              `}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/developer" element={<DeveloperPortal />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;
