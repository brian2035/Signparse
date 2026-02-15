
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
  AlertCircle,
  Plus,
  HelpCircle,
  Menu as Hamburger
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const LOGO_URL = "https://i.ibb.co/5xCWL6pX/Sign-Parse-1.png";

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Document Signed', message: 'Sarah Chen signed "NDA_Venture_Capital.pdf"', time: '2 mins ago', type: 'success', icon: CheckCircle2 },
  { id: 2, title: 'Signature Requested', message: 'HR Dept requested your signature on "Payroll_Update.pdf"', time: '1 hour ago', type: 'info', icon: Clock },
  { id: 3, title: 'Payment Successful', message: 'Your Professional subscription has been renewed.', time: '5 hours ago', type: 'success', icon: CreditCard },
  { id: 4, title: 'Security Alert', message: 'New login detected from San Francisco, CA.', time: 'Yesterday', type: 'warning', icon: AlertCircle },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, organization, isAuthenticated, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isPublicMobileMenuOpen, setIsPublicMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Templates', path: '/templates', icon: Layers },
  ];

  const toolsNavItems = [
    { name: 'Developer', path: '/developer', icon: Code2 },
    { name: 'Verification', path: '/verify', icon: ShieldCheck },
  ];

  const systemNavItems = [
    { name: 'Pricing', path: '/pricing', icon: CreditCard },
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

  // Close mobile menus on navigation
  useEffect(() => {
    setIsMobileSidebarOpen(false);
    setIsPublicMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated && !isPublicPage) {
    navigate('/auth');
    return null;
  }

  // Public Navigation Bar
  if (isPublicPage && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-32 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group z-50">
              <div className="h-24 w-auto min-w-[280px] flex items-center justify-start group-hover:opacity-80 transition-all duration-300">
                <img src={LOGO_URL} alt="Sign-Parse Logo" className="h-full w-auto object-contain" />
              </div>
            </Link>
            
            {/* Desktop Nav - Centered */}
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-semibold text-slate-400">
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link>
              <Link to="/verify" className="hover:text-blue-400 transition-colors">Verification</Link>
              <Link to="/developer" className="hover:text-blue-400 transition-colors">API</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4 z-50">
              <Link to="/auth" className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden sm:block">Log In</Link>
              <Link to="/auth" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95 hidden sm:block">
                Get Started
              </Link>
              <button 
                onClick={() => setIsPublicMobileMenuOpen(!isPublicMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
              >
                {isPublicMobileMenuOpen ? <X size={24} /> : <Hamburger size={24} />}
              </button>
            </div>
          </div>

          {/* Public Mobile Menu */}
          <AnimatePresence>
            {isPublicMobileMenuOpen && (
              /* @ts-ignore - bypassing framer-motion type mismatch in this environment */
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-slate-900 border-b border-white/5 overflow-hidden"
              >
                <div className="p-6 flex flex-col gap-4">
                  <Link to="/" className="text-lg font-bold text-white py-2">Home</Link>
                  <Link to="/pricing" className="text-lg font-bold text-white py-2">Pricing</Link>
                  <Link to="/verify" className="text-lg font-bold text-white py-2">Verification</Link>
                  <Link to="/developer" className="text-lg font-bold text-white py-2">API</Link>
                  <div className="h-px bg-white/5 my-2"></div>
                  <Link to="/auth" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-center">
                    Get Started Free
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // Authenticated Navigation Layout
  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <>
      <div className="h-40 flex items-center px-6 shrink-0 justify-between">
        <Link to="/" className="flex items-center group overflow-hidden">
          <img src={organization?.logo || LOGO_URL} className="h-24 w-auto object-contain" alt="Logo" />
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="px-4 mb-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className={`
            w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95
            ${!isSidebarOpen && !onClose ? 'px-0' : ''}
          `}
        >
          <Plus size={18} />
          {(isSidebarOpen || onClose) && <span>New Request</span>}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          {(isSidebarOpen || onClose) && <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Main</p>}
          <div className="space-y-1">
            {mainNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group
                  ${location.pathname === item.path 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-bold' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium'}
                `}
              >
                <item.icon size={18} className={`${location.pathname === item.path ? 'text-white' : 'group-hover:scale-110 transition-transform group-hover:text-blue-400'}`} />
                {(isSidebarOpen || onClose) && <span className="text-sm tracking-tight">{item.name}</span>}
              </Link>
            ))}
          </div>
        </div>

        <div>
          {(isSidebarOpen || onClose) && <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Workspace Tools</p>}
          <div className="space-y-1">
            {toolsNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group
                  ${location.pathname === item.path 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-bold' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium'}
                `}
              >
                <item.icon size={18} className={`${location.pathname === item.path ? 'text-white' : 'group-hover:scale-110 transition-transform group-hover:text-blue-400'}`} />
                {(isSidebarOpen || onClose) && <span className="text-sm tracking-tight">{item.name}</span>}
              </Link>
            ))}
          </div>
        </div>

        <div>
          {(isSidebarOpen || onClose) && <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">System</p>}
          <div className="space-y-1">
            {systemNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group
                  ${location.pathname === item.path 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-bold' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium'}
                `}
              >
                <item.icon size={18} className={`${location.pathname === item.path ? 'text-white' : 'group-hover:scale-110 transition-transform group-hover:text-blue-400'}`} />
                {(isSidebarOpen || onClose) && <span className="text-sm tracking-tight">{item.name}</span>}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 mt-auto border-t border-white/5 space-y-1">
        <button 
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <HelpCircle size={18} />
          {(isSidebarOpen || onClose) && <span className="text-sm font-medium">Support Center</span>}
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
        >
          <LogOut size={18} />
          {(isSidebarOpen || onClose) && <span className="text-sm font-medium">Log out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-slate-900/90 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 fixed h-full z-40 hidden md:flex flex-col
      `}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            {/* @ts-ignore - bypassing framer-motion type mismatch in this environment */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            {/* @ts-ignore - bypassing framer-motion type mismatch in this environment */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 flex flex-col border-r border-white/5"
            >
              <SidebarContent onClose={() => setIsMobileSidebarOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Top Header Navigation */}
        <header className="h-16 glass border-b border-white/5 sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileSidebarOpen(true);
                } else {
                  setIsSidebarOpen(!isSidebarOpen);
                }
              }} 
              className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-400 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-950/50 border border-white/5 rounded-xl w-96 text-slate-500 focus-within:border-blue-500/50 focus-within:text-slate-300 transition-all">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search documents, people, or templates..." 
                className="bg-transparent border-none outline-none text-xs font-medium w-full placeholder:text-slate-600" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Center */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl transition-all ${showNotifications ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  /* @ts-ignore - bypassing framer-motion type mismatch in this environment */
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-14 right-0 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Notifications</h3>
                      <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-white">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
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
                              <p className="text-xs font-bold text-white leading-tight">{notif.title}</p>
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{notif.message}</p>
                              <p className="text-[10px] text-slate-600 font-bold mt-2 uppercase tracking-widest">{notif.time}</p>
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
            </div>

            <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>
            
            {/* User Profile Hook */}
            <Link to="/settings" className="flex items-center gap-3 pl-2 group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 font-medium tracking-tight">
                  {user?.role === 'company_admin' ? 'Enterprise Admin' : 'Pro Member'}
                </p>
              </div>
              <div className="p-0.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-400 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-[10px] object-cover bg-slate-800 border border-slate-900" 
                />
              </div>
            </Link>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
