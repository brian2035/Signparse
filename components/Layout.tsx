
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Bell, 
  Code2, 
  Layers,
  Menu,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  User as UserIcon,
  Search,
  X,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const LOGO_URL = "https://i.ibb.co/7dZM5KXh/2.png";

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Document Signed', message: 'Sarah Chen signed "NDA_Venture_Capital.pdf"', time: '2 mins ago', type: 'success', icon: CheckCircle2 },
  { id: 2, title: 'Signature Requested', message: 'HR Dept requested your signature on "Payroll_Update.pdf"', time: '1 hour ago', type: 'info', icon: Clock },
  { id: 3, title: 'Payment Successful', message: 'Your Professional subscription has been renewed.', time: '5 hours ago', type: 'success', icon: CreditCard },
  { id: 4, title: 'Security Alert', message: 'New login detected from San Francisco, CA.', time: 'Yesterday', type: 'warning', icon: AlertCircle },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, organization, isAuthenticated, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Templates', path: '/templates', icon: Layers },
    { name: 'Developer', path: '/developer', icon: Code2 },
    { name: 'Pricing', path: '/pricing', icon: CreditCard },
    { name: 'Verification', path: '/verify', icon: ShieldCheck },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isPublicPage = ['/', '/pricing', '/verify', '/auth'].includes(location.pathname);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated && !isPublicPage) {
    navigate('/auth');
    return null;
  }

  if (isPublicPage && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <Link to="/" className="flex items-center group h-full">
              <div className="h-20 w-auto min-w-[220px] flex items-center justify-start group-hover:scale-105 transition-all duration-500">
                <img src={LOGO_URL} alt="SignFlow Logo" className="h-full w-auto object-contain" />
              </div>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-10 text-sm font-semibold tracking-wide">
              <Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Home</Link>
              <Link to="/pricing" className="text-slate-400 hover:text-blue-400 transition-colors">Pricing</Link>
              <Link to="/verify" className="text-slate-400 hover:text-blue-400 transition-colors">Verify</Link>
              <Link to="/developer" className="text-slate-400 hover:text-blue-400 transition-colors">API</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/auth" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                Get Started
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className={`
        ${isSidebarOpen ? 'w-72' : 'w-24'} 
        bg-slate-900/80 backdrop-blur-xl border-r border-white/5 transition-all duration-500 fixed h-full z-40 hidden md:flex flex-col
      `}>
        <div className="h-32 flex items-center px-6 shrink-0">
          <Link to="/" className="flex items-center overflow-hidden w-full group">
            <div className="w-full h-24 flex items-center justify-start group-hover:scale-105 transition-all duration-500">
              <img src={organization?.logo || LOGO_URL} className="h-full w-auto max-w-full object-contain" alt="Logo" />
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                `}
              >
                <Icon size={22} className={`${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                {isSidebarOpen && <span className="font-bold tracking-tight">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <button 
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all
              ${isSidebarOpen ? 'bg-slate-800/50 hover:bg-rose-600/10' : ''}
              text-slate-400 hover:text-rose-400
            `}
          >
            <LogOut size={22} />
            {isSidebarOpen && <span className="font-bold tracking-tight">Logout</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-24'}`}>
        <header className="h-16 glass border-b border-white/5 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-slate-300">
              <Menu size={18} />
            </button>
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-2xl w-80 text-slate-400">
              <Search size={14} />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs font-semibold w-full" />
            </div>
          </div>

          <div className="flex items-center gap-6 relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2.5 rounded-xl transition-all text-slate-300 ${showNotifications ? 'bg-white/10 text-white' : 'bg-white/5 hover:bg-white/10'}`}
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-14 right-0 w-80 bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-5 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-white transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {MOCK_NOTIFICATIONS.map((notif) => (
                      <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex gap-4">
                          <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                            notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                            notif.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            <notif.icon size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{notif.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                            <p className="text-[9px] text-slate-600 font-bold mt-2 uppercase tracking-widest">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:bg-blue-500/5 transition-colors">
                    Mark all as read
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <Link to="/settings" className="flex items-center gap-4 group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-extrabold tracking-tight text-white">{user?.name || 'User'}</p>
                <p className="text-[9px] text-blue-400 mt-0.5 uppercase tracking-widest font-black">
                  {user?.role === 'company_admin' ? 'Enterprise' : 'Personal'}
                </p>
              </div>
              <div className="p-0.5 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-[10px] object-cover bg-slate-800 border border-slate-900" 
                />
              </div>
            </Link>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
