
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  Building2, 
  Lock, 
  Bell, 
  Globe, 
  Save, 
  Camera, 
  ShieldCheck,
  CreditCard,
  Cloud,
  CheckCircle2,
  Trash2,
  Loader2,
  AlertCircle,
  ExternalLink,
  X,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings: React.FC = () => {
  const { user, organization, updateUser, updateOrganization } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isManageSubModalOpen, setIsManageSubModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    jobTitle: user?.jobTitle || '',
    organization: user?.organization || ''
  });

  const [orgForm, setOrgForm] = useState({
    name: organization?.name || '',
    primaryColor: organization?.primaryColor || '#3b82f6',
    accentColor: organization?.accentColor || '#10b981'
  });

  const [is2faLoading, setIs2faLoading] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (activeTab === 'Profile') {
        updateUser(profileForm);
      } else if (activeTab === 'Branding') {
        updateOrganization(orgForm);
      }
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateOrganization({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggle2FA = () => {
    setIs2faLoading(true);
    setTimeout(() => {
      updateUser({ twoFactorEnabled: !user?.twoFactorEnabled });
      setIs2faLoading(false);
    }, 1500);
  };

  const TABS = [
    { id: 'Profile', icon: UserIcon },
    { id: 'Branding', icon: Building2 },
    { id: 'Security', icon: Lock },
    { id: 'Billing', icon: CreditCard },
    { id: 'Integrations', icon: Cloud }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-xl shadow-blue-500/20"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'}
              `}
            >
              <tab.icon size={18} />
              {tab.id}
            </button>
          ))}
        </aside>

        <main className="flex-1 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-10 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'Profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <img src={user?.avatar || "https://picsum.photos/120/120?random=1"} className="w-32 h-32 rounded-3xl object-cover ring-4 ring-slate-800" alt="Avatar" />
                    <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-slate-950/60 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-white" size={24} /></button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">{user?.name || 'John Doe'}</h3>
                    <p className="text-slate-500 text-sm italic">Member since Oct 2023</p>
                    <button onClick={() => updateUser({ avatar: undefined })} className="text-xs font-bold text-rose-500 hover:underline mt-4 uppercase tracking-widest">Remove Photo</button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[{ label: 'Full Name', key: 'name', type: 'text' }, { label: 'Email Address', key: 'email', type: 'email' }, { label: 'Job Title', key: 'jobTitle', type: 'text' }, { label: 'Organization', key: 'organization', type: 'text' }].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{field.label}</label>
                      <input type={field.type} value={(profileForm as any)[field.key]} onChange={(e) => setProfileForm({ ...profileForm, [field.key]: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'Branding' && (
              <motion.div key="branding" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                {user?.role === 'individual' ? (
                  <div className="p-8 text-center bg-slate-950 rounded-[2.5rem] border border-slate-800">
                    <AlertCircle size={40} className="mx-auto text-amber-500 mb-4" />
                    <h4 className="text-white font-bold mb-2">Upgrade for Branding</h4>
                    <p className="text-sm text-slate-500 mb-6">Custom branding is only available for Company and Professional accounts.</p>
                    <button onClick={() => navigate('/pricing')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all">Upgrade Now</button>
                  </div>
                ) : (
                  <>
                    <div className="p-8 border-2 border-dashed border-slate-800 rounded-[2rem] text-center relative group">
                      {organization?.logo ? (
                        <div className="relative inline-block">
                          <img src={organization.logo} className="mx-auto h-24 max-w-full object-contain mb-4 rounded-xl" alt="Logo" />
                          <button onClick={() => updateOrganization({ logo: undefined })} className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform"><Trash2 size={14} /></button>
                        </div>
                      ) : (
                        <Building2 size={40} className="mx-auto text-slate-700 mb-4" />
                      )}
                      <h4 className="text-sm font-bold text-white mb-2">Company Logo</h4>
                      <button onClick={() => logoInputRef.current?.click()} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all">Upload Logo</button>
                      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Company Name</label>
                      <input type="text" value={orgForm.name} onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase">Primary Color</label><div className="flex gap-4 items-center"><input type="color" value={orgForm.primaryColor} onChange={(e) => setOrgForm({ ...orgForm, primaryColor: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none" /><span className="text-xs font-mono text-slate-500">{orgForm.primaryColor.toUpperCase()}</span></div></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase">Accent Color</label><div className="flex gap-4 items-center"><input type="color" value={orgForm.accentColor} onChange={(e) => setOrgForm({ ...orgForm, accentColor: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none" /><span className="text-xs font-mono text-slate-500">{orgForm.accentColor.toUpperCase()}</span></div></div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'Security' && (
              <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <section className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><ShieldCheck size={20} className="text-emerald-500" /> Authentication</h3>
                  <div className="p-6 bg-slate-950 rounded-[2rem] border border-slate-800 flex items-center justify-between">
                    <div><h4 className="text-sm font-bold text-white flex items-center gap-2">Two-Factor Authentication (2FA) {user?.twoFactorEnabled && <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full uppercase">Active</span>}</h4><p className="text-xs text-slate-500 mt-1">Add an extra layer of security using SMS or Authenticator App.</p></div>
                    <button onClick={toggle2FA} disabled={is2faLoading} className={`px-5 py-2 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${user?.twoFactorEnabled ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>{is2faLoading ? <Loader2 size={14} className="animate-spin" /> : (user?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA')}</button>
                  </div>
                </section>
                <section className="space-y-6"><h3 className="text-lg font-bold text-white flex items-center gap-2"><Lock size={20} className="text-blue-500" /> Password Management</h3><button className="w-full text-left p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all flex items-center justify-between group"><div><h4 className="text-sm font-bold text-white">Change Password</h4><p className="text-xs text-slate-500 mt-1">Update your password to stay secure.</p></div><ExternalLink size={16} className="text-slate-500 group-hover:text-blue-500" /></button></section>
              </motion.div>
            )}

            {activeTab === 'Billing' && (
              <motion.div key="billing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                   <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div><span className="text-[10px] font-black uppercase tracking-widest opacity-60">Current Plan</span><h3 className="text-3xl font-bold mt-1">{user?.role === 'company_admin' ? 'Enterprise' : 'Professional'}</h3><p className="text-blue-100 mt-2 text-sm">Billed monthly • Next invoice on Nov 24, 2023</p></div>
                     <button onClick={() => setIsManageSubModalOpen(true)} className="px-6 py-3 bg-white text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all">Manage Subscription</button>
                   </div>
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </div>
                <section className="space-y-6"><h3 className="text-lg font-bold text-white flex items-center gap-2"><CreditCard size={20} className="text-slate-400" /> Payment Methods</h3><div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center font-bold text-[10px]">VISA</div><div><p className="text-sm font-bold text-white">•••• •••• •••• 4242</p><p className="text-xs text-slate-500">Expires 12/26</p></div></div><button onClick={() => setIsAddPaymentModalOpen(true)} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest">Update</button></div><button onClick={() => setIsAddPaymentModalOpen(true)} className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-xs font-bold text-slate-500 hover:text-blue-500 hover:border-blue-500/50 transition-all">+ Add New Payment Method</button></section>
              </motion.div>
            )}

            {activeTab === 'Integrations' && (
              <motion.div key="integrations" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                {[{ name: 'Google Workspace', desc: 'Sync documents directly from Drive and Gmail.', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', connected: true }, { name: 'Slack', desc: 'Get signature status notifications in your channels.', icon: 'https://cdn-icons-png.flaticon.com/512/3800/3800024.png', connected: false }, { name: 'Salesforce', desc: 'Automate contracts for your CRM deals.', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968914.png', connected: false }, { name: 'Microsoft 365', desc: 'Sign documents directly in Word and Outlook.', icon: 'https://cdn-icons-png.flaticon.com/512/732/732221.png', connected: true }].map((item, i) => (
                  <div key={i} className="p-6 bg-slate-950 rounded-[2rem] border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-all"><div className="flex items-center gap-4"><img src={item.icon} className="w-10 h-10 object-contain" alt={item.name} /><div><h4 className="text-sm font-bold text-white">{item.name}</h4><p className="text-xs text-slate-500 mt-0.5">{item.desc}</p></div></div><button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${item.connected ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>{item.connected ? 'Connected' : 'Connect'}</button></div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Manage Subscription Modal */}
      <AnimatePresence>
        {isManageSubModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-white/5 rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl p-10 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-white">Subscription Management</h2>
                <button onClick={() => setIsManageSubModalOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-950 rounded-3xl border border-white/5"><p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Current Tier</p><p className="text-xl font-bold text-white">Professional Plan</p><p className="text-xs text-blue-500 mt-1 font-bold">Active since Oct 2023</p></div>
                <div className="p-6 bg-slate-950 rounded-3xl border border-white/5"><p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Monthly Cost</p><p className="text-xl font-bold text-white">$29.00 / mo</p><p className="text-xs text-slate-500 mt-1">Next bill on Nov 24, 2023</p></div>
              </div>
              <div className="space-y-3">
                <button onClick={() => { setIsManageSubModalOpen(false); navigate('/pricing'); }} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition-all">Change Subscription Tier</button>
                <button onClick={() => setIsManageSubModalOpen(false)} className="w-full py-4 bg-slate-800 hover:bg-rose-900/20 text-slate-300 hover:text-rose-500 rounded-2xl font-bold text-sm transition-all">Cancel Subscription</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Payment Method Modal */}
        {isAddPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-white/5 rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl p-10 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-white">Payment Method</h2>
                <button onClick={() => setIsAddPaymentModalOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Card Number</label><input type="text" placeholder="xxxx xxxx xxxx 4242" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expiry</label><input type="text" placeholder="MM / YY" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CVC</label><input type="text" placeholder="***" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono" /></div>
                </div>
                <button onClick={() => setIsAddPaymentModalOpen(false)} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[24px] font-extrabold text-lg shadow-2xl shadow-emerald-500/30 transition-all">Link Payment Method</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl shadow-emerald-500/20 font-bold text-sm">
            <CheckCircle2 size={20} /> Settings saved successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
