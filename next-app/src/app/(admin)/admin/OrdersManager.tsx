"use client";
import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/services/dbService';
import { toast } from 'react-toastify';
import { 
  Search, 
  Eye, 
  Check, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  CreditCard,
  FolderOpen
} from 'lucide-react';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Selected Order for Detail Modal
  const [activeOrder, setActiveOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders();
      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = orders.filter(o => {
    const customerName = `${o.customerDetails?.firstName} ${o.customerDetails?.lastName}`.toLowerCase();
    const matchesSearch = customerName.includes(search.toLowerCase()) || o.id?.toLowerCase().includes(search.toLowerCase()) || o.customerDetails?.phone?.includes(search);
    const matchesStatus = selectedStatus ? o.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* SEARCH */}
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 inset-y-0 my-auto text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ID, Customer Name, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2 text-xs w-full sm:w-80 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* STATUS FILTER */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2 text-xs focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ORDERS LIST */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
          {/* Header Skeleton */}
          <div className="bg-slate-950/60 border-b border-slate-800 p-4 flex gap-6">
            <div className="h-3 bg-slate-800 rounded w-24"></div>
            <div className="h-3 bg-slate-800 rounded flex-1"></div>
            <div className="h-3 bg-slate-800 rounded w-20"></div>
            <div className="h-3 bg-slate-800 rounded w-24"></div>
            <div className="h-3 bg-slate-800 rounded w-24"></div>
            <div className="h-3 bg-slate-800 rounded w-24"></div>
          </div>
          {/* Rows Skeleton */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b border-slate-800/50 p-4 flex gap-6 items-center">
              <div className="space-y-2 w-24">
                <div className="h-3 bg-slate-800 rounded w-full"></div>
                <div className="h-2 bg-slate-800 rounded w-2/3"></div>
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                <div className="h-2 bg-slate-800 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-slate-800 rounded w-20"></div>
              <div className="h-3 bg-slate-800 rounded w-24"></div>
              <div className="h-4 bg-slate-800 rounded w-24 font-black"></div>
              <div className="h-6 w-24 bg-slate-800 rounded-full text-center"></div>
              <div className="h-8 w-10 bg-slate-800 rounded-lg ml-auto"></div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded-2xl text-slate-500">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          No orders found matching filters.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden font-sans">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Order ID / Date</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Items count</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4 w-28 text-center">Status</th>
                  <th className="p-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/20 text-slate-300">
                    <td className="p-4">
                      <div className="font-bold text-white font-mono text-[10px] truncate w-24">{o.id}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">
                        {o.customerDetails?.firstName} {o.customerDetails?.lastName}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {o.customerDetails?.phone}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-400">
                      {o.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items
                    </td>
                    <td className="p-4 text-slate-300">
                      {o.paymentMethod || 'Online'}
                    </td>
                    <td className="p-4 font-black text-white text-sm">
                      ₹{o.total?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border inline-block w-24 text-center ${
                        o.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        o.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        o.status === 'Shipped' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-red-550/10 text-red-400 border-red-500/20'
                      }`}>
                        {o.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setActiveOrder(o)}
                        className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
            
            {/* MODAL HEADER */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div>
                <h3 className="text-md font-bold text-white font-mono">Order Details: #{activeOrder.id}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Placing Time: {activeOrder.createdAt ? new Date(activeOrder.createdAt).toLocaleString('en-IN') : 'N/A'}
                </div>
              </div>
              <button 
                onClick={() => setActiveOrder(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              {/* STATUS ACTION CONTROLS */}
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Update Order Status Workflow:</span>
                <div className="flex flex-wrap gap-2">
                  {['Pending', 'Processing', 'Shipped', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(activeOrder.id, status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        activeOrder.status === status
                          ? 'bg-blue-600 border-blue-500 text-white shadow'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* TWO COLUMN INFO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* CUSTOMER DETAILS */}
                <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2">Customer Details</h4>
                  
                  <div className="space-y-3 text-xs">
                    <p className="text-sm font-semibold text-white">
                      {activeOrder.customerDetails?.firstName} {activeOrder.customerDetails?.lastName}
                    </p>
                    <p className="text-slate-300 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      {activeOrder.customerDetails?.phone}
                    </p>
                    <p className="text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      {activeOrder.customerDetails?.email}
                    </p>
                    <p className="text-slate-300 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                      <span>
                        {activeOrder.customerDetails?.address}, {activeOrder.customerDetails?.city}, {activeOrder.customerDetails?.state} - {activeOrder.customerDetails?.zip}
                      </span>
                    </p>
                  </div>
                </div>

                {/* PAYMENT SUMMARY */}
                <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-2">Payment Summary</h4>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Payment Method</span>
                      <span className="font-bold text-slate-200 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                        {activeOrder.paymentMethod || 'Online'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-200">₹{activeOrder.subtotal?.toLocaleString('en-IN') || 0}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>GST (18% Included)</span>
                      <span className="font-bold text-slate-200">₹{activeOrder.gst?.toFixed(2) || 0}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-850">
                      <span>Total Amount Paid</span>
                      <span className="text-blue-400">₹{activeOrder.total?.toLocaleString('en-IN') || 0}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* PRODUCTS LIST TABLE */}
              <div className="border border-slate-850 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase border-b border-slate-855">
                    <tr>
                      <th className="p-3 w-16">Preview</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3 w-20 text-center">Qty</th>
                      <th className="p-3 w-28 text-right">Price</th>
                      <th className="p-3 w-28 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-slate-300">
                    {activeOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3">
                          <div className="w-10 h-10 bg-white p-1 rounded border border-slate-700 flex items-center justify-center">
                            <img src={item.image} alt="" className="max-h-full max-w-full object-contain mx-auto" />
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-white">{item.title}</td>
                        <td className="p-3 text-center font-bold text-slate-400">{item.quantity}</td>
                        <td className="p-3 text-right">₹{item.price?.toLocaleString('en-IN') || 0}</td>
                        <td className="p-3 text-right font-bold text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="p-6 border-t border-slate-800 flex items-center justify-end bg-slate-955 bg-slate-950/40">
              <button
                onClick={() => setActiveOrder(null)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Close Order view
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default OrdersManager;
