"use client";
import React, { useState, useEffect } from 'react';
import { 
  getProducts, 
  getOrders, 
  getContactMessages, 
  seedInitialDatabase 
} from '@/services/dbService';
import { productsData } from '@/data/productsData';
import { toast } from 'react-toastify';
import { 
  DollarSign, 
  FileText, 
  Inbox, 
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingUp,
  Package,
  Layers,
  Download
} from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    inquiriesCount: 0,
    lowStockCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [products, orders, messages] = await Promise.all([
        getProducts(),
        getOrders(),
        getContactMessages()
      ]);

      // Calculate Revenue (orders that are placed/completed, not cancelled)
      const validOrders = orders.filter(o => o.status !== 'Cancelled');
      const totalRevenue = validOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

      // Low Stock Alerts (products marked inStock: false)
      const outOfStock = products.filter(p => p.inStock === false);

      setStats({
        revenue: totalRevenue,
        ordersCount: orders.length,
        inquiriesCount: messages.length,
        lowStockCount: outOfStock.length
      });

      setRecentOrders(orders.slice(0, 5));
      setRecentMessages(messages.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSeed = async () => {
    const confirmSeed = window.confirm("Are you sure you want to seed the database? This will populate Firestore with the initial products, categories, and drivers.");
    if (!confirmSeed) return;

    setSeeding(true);
    try {
      // Hardcoded categories
      const initialCategories = [
        { id: 1, name: 'Receipt Printer', image: '/assets/Thermal.jpg' },
        { id: 2, name: 'Label Printer', image: '/assets/barcode.webp' },
        { id: 3, name: 'Barcode Scanner', image: '/assets/scanner.jpg' },
        { id: 4, name: 'Mobile Printer', image: '/assets/Receipt Printer.jpg' },
        { id: 5, name: 'Receipt Paper Roll', image: '/assets/receipt-paper.jpg' },
        { id: 6, name: 'POS System', image: '/assets/POS SYSTEM.avif' },
        { id: 7, name: 'Cash Box ', image: '/assets/cashbox.jpg' },
        { id: 8, name: 'Billing Software', image: '/assets/soft111.jpg' }
      ];

      // Hardcoded drivers
      const initialDrivers = [
        { id: 1, name: "H58 Receipt Printer", image: "/assets/51JGHxjz28L._SL1200_.jpg", desc: "Windows Driver, Linux Driver and SDK Kit", links: [
          { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2023/03/Atpos-H58-Driver-IE-Tool-for-CSP.zip" },
          { label: "Tools & SDK Kit", url: "https://www.atpos.in/wp-content/uploads/2021/04/Linux-SDK-ToolsManuals.zip" }
        ]},
        { id: 2, name: "MD80 Label | HL450 Receipt Printer", image: "/assets/HL450.jpg", desc: "Windows Driver, Linux Driver and SDK Kit", links: [
          { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2025/03/Atpos-MD80-Drivers.zip" },
          { label: "Tools & SDK Kit", url: "https://www.atpos.in/wp-content/uploads/2021/04/Linux-SDK-ToolsManuals.zip" }
        ]},
        { id: 3, name: "M80 Receipt Printer", image: "/assets/m80.jpg", desc: "Windows Driver, Linux Driver and SDK Kit", links: [
          { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2024/11/ATPOS-PrintDriver-AT345-Series.zip" },
          { label: "Tools & SDK Kit", url: "https://www.atpos.in/wp-content/uploads/2024/11/Atpos-AT345-series-ReceiptPrinterFiles.zip" }
        ]},
        { id: 4, name: "HL300 / HL58 Receipt Printer", image: "/assets/Atpos-HL300s.jpg", desc: "Windows Driver, Linux Driver and SDK Kit", links: [
          { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2021/01/AtPOS-80-Series.zip" },
          { label: "Tools & SDK Kit", url: "https://www.atpos.in/wp-content/uploads/2021/04/Linux-SDK-ToolsManuals.zip" }
        ]},
        { id: 6, name: "HQ450L Label Printer", image: "/assets/450.webp", desc: "Windows Driver, Windows Diabel Software", links: [
          { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2024/12/Atpos-Label-Printer-E58-HQ450L-Driver-Setup.zip" },
          { label: "Software", url: "https://apps.microsoft.com/detail/9pmtsg6f98jc?hl=en-US&gl=US" }
        ]},
        { id: 7, name: "AT-301/302/402 Receipt Printer", image: "/assets/302.jpg", desc: "Windows Driver, MAC OS, Linux Driver and Tool Kit", links: [
          { label: "Windows Driver", url: "https://firebasestorage.googleapis.com/v0/b/volcora-products.appspot.com/o/V-WRP-A1%20%7C%20V-WLRP-A1%20Series%20Printer%2FDrivers%2FWindows%20Driver.zip?alt=media&token=f7726e70-9537-4d68-ae9e-039625acb2b8" },
          { label: "SDK, Tools & MAC OS", url: "https://www.atpos.in/wp-content/uploads/2024/11/Atpos-AT345-series-ReceiptPrinterFiles.zip" }
        ]},
        { id: 10, name: "E58 Label Printer", image: "/assets/e58bt.webp", desc: "Windows Driver & EM Label Software", links: [
          { label: "Windows Driver & Software", url: "https://www.atpos.in/wp-content/uploads/2024/12/Atpos-Label-Printer-E58-HQ450L-Driver-Setup.zip" },
          { label: "Android App", url: "https://drive.google.com/file/d/1iFn-nXUETwI_poZsiAQQ75w98ywE3fFZ/view?usp=sharing" }
        ]},
        { id: 11, name: "AT-602 Label Printer", image: "/assets/500sm-min.png", desc: "Windows Driver & EM Label Software", links: [
          { label: "Windows Driver & Software", url: "https://www.atpos.in/wp-content/uploads/2024/02/Atpos-AT-602-Windows-Driver-for-Label-and-Receipt-Printing-2023.zip" }
        ]}
      ];

      await seedInitialDatabase(productsData, initialCategories, initialDrivers);
      toast.success("Database seeded successfully!");
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to seed database.");
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Total Orders', value: stats.ordersCount, icon: FileText, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { label: 'Total Inquiries', value: stats.inquiriesCount, icon: Inbox, color: 'text-violet-500 bg-violet-500/10 border-violet-500/20' },
    { label: 'Low Stock Items', value: stats.lowStockCount, icon: AlertTriangle, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          <div className="h-96 bg-slate-900 border border-slate-800 rounded-2xl"></div>
          <div className="h-96 bg-slate-900 border border-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* QUICK SEED CALLOUT */}
      {stats.ordersCount === 0 && stats.lowStockCount === 0 && (
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-md">First-Time Setup Required</h3>
            <p className="text-slate-400 text-sm">
              Your Firestore database is currently empty. Click the button to automatically import your existing 20 products, categories, and support drivers.
            </p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all whitespace-nowrap disabled:opacity-50"
          >
            {seeding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Seeding Database...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Seed Initial Database</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{card.label}</span>
                <p className="text-2xl font-black text-white">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS / RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* RECENT ORDERS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Recent Orders
            </h3>
            <button 
              onClick={() => setActiveTab('orders')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 uppercase tracking-wider"
            >
              All Orders
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-grow overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
                No orders placed yet.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 font-medium border-b border-slate-800">
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-slate-200">
                      <td className="py-3 font-semibold">
                        {order.customerDetails?.firstName} {order.customerDetails?.lastName}
                      </td>
                      <td className="py-3 font-bold">
                        ₹{order.total?.toLocaleString('en-IN') || 0}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          order.status === 'Shipped' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RECENT INQUIRIES */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-violet-500" />
              Recent Inquiries
            </h3>
            <button 
              onClick={() => setActiveTab('messages')}
              className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 uppercase tracking-wider"
            >
              All Messages
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-grow space-y-4">
            {recentMessages.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
                No contact messages yet.
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{msg.name}</span>
                    <span className="text-slate-500">{msg.email}</span>
                  </div>
                  <p className="text-slate-300 text-xs line-clamp-2">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* QUICK ACCESS ACTION TILES */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-md font-bold text-white mb-6">Quick Tools Seeding & Maintenance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button 
            onClick={() => setActiveTab('products')}
            className="p-5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center gap-4 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Products</p>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Manage Catalogue</p>
            </div>
          </button>

          <button 
            onClick={handleSeed}
            className="p-5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center gap-4 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Database</p>
              <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Force Seeding</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('drivers')}
            className="p-5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center gap-4 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Downloads</p>
              <p className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">Manage Drivers</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
