import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Download, 
  FileText, 
  Inbox, 
  LogOut, 
  Globe, 
  User,
  Menu,
  X
} from 'lucide-react';

// Subcomponents
import Dashboard from './Dashboard';
import ProductsManager from './ProductsManager';
import DriversManager from './DriversManager';
import OrdersManager from './OrdersManager';
import MessagesManager from './MessagesManager';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/admin/login');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate('/admin/login');
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to log out");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-semibold tracking-wider uppercase text-xs animate-pulse">
          Checking Security Access...
        </p>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'products':
        return <ProductsManager />;
      case 'drivers':
        return <DriversManager />;
      case 'orders':
        return <OrdersManager />;
      case 'messages':
        return <MessagesManager />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'drivers', label: 'Printer Drivers', icon: Download },
    { id: 'orders', label: 'Orders List', icon: FileText },
    { id: 'messages', label: 'Inquiries', icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800">
        {/* LOGO */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900">
          <span className="text-xl font-black italic tracking-wide text-white">
            Billing<span className="text-blue-500">Zone</span> <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded ml-1 font-normal tracking-normal uppercase not-italic">Admin</span>
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-grow p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* FOOTER USER / LOGOUT */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-slate-200">Admin Account</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="w-64 bg-slate-900 h-full flex flex-col border-r border-slate-800 animate-slide-in">
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
              <span className="text-lg font-black italic tracking-wide text-white">
                Billing<span className="text-blue-500">Zone</span>
              </span>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-grow p-4 space-y-2 mt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-3">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600/15 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header className="h-20 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider hidden sm:block">
              {navItems.find(item => item.id === activeTab)?.label} Control
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              View Store
            </button>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <main className="flex-grow p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
