"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Fetch orders where userId matches OR email matches (for previous guest orders)
        const ordersRef = collection(db, 'orders');
        
        // We do two queries because Firestore doesn't support OR on different fields directly in standard simple queries easily without composite indexes,
        // so we'll fetch by userId first. If email matching is needed, we can do it, but let's stick to userId for now for security.
        const q = query(
          ordersRef,
          where("userId", "==", currentUser.uid)
          // orderBy requires index if combined with where, let's sort in memory for simplicity if no index exists
        );

        const querySnapshot = await getDocs(q);
        let userOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fallback: Also try fetching by email to catch guest orders made with this email
        if (currentUser.email) {
          const emailQuery = query(
            ordersRef,
            where("customerDetails.email", "==", currentUser.email)
          );
          const emailSnapshot = await getDocs(emailQuery);
          
          emailSnapshot.docs.forEach(doc => {
            if (!userOrders.find(o => o.id === doc.id)) {
              userOrders.push({ id: doc.id, ...doc.data() });
            }
          });
        }

        // Sort by date descending
        userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit";
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
      case 'delivered':
        return <span className={`${baseClasses} bg-green-50 text-green-700 border border-green-200`}>{getStatusIcon(status)} {status}</span>;
      case 'processing':
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-200`}>{getStatusIcon(status)} {status}</span>;
      case 'shipped':
        return <span className={`${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`}>{getStatusIcon(status)} {status}</span>;
      case 'cancelled':
      case 'failed':
        return <span className={`${baseClasses} bg-red-50 text-red-700 border border-red-200`}>{getStatusIcon(status)} {status}</span>;
      default:
        return <span className={`${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`}>{getStatusIcon(status)} {status || 'UNKNOWN'}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#006699] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 font-sans min-h-[70vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <Package className="w-8 h-8 text-[#006699]" />
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Looks like you haven't placed any orders yet, or your past orders were made without an account.
          </p>
          <button
            onClick={() => router.push('/products')}
            className="bg-[#006699] hover:bg-[#004d73] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#006699]/20 active:scale-95"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              
              {/* ORDER HEADER */}
              <div className="bg-gray-50/50 border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-0.5">Order Placed</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-0.5">Total Amount</p>
                    <p className="font-semibold text-gray-900">₹{(order.total || 0).toLocaleString('en-IN')}.00</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-0.5">Order ID</p>
                    <p className="font-medium text-gray-700 font-mono text-xs">{order.id}</p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* ORDER ITEMS */}
              <div className="p-6">
                <div className="space-y-4 divide-y divide-gray-100">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className={`flex gap-4 ${idx > 0 ? 'pt-4' : ''}`}>
                      <div className="w-20 h-20 bg-white border border-gray-100 rounded-xl p-2 flex-shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <Package className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-grow flex flex-col justify-center">
                        <h4 className="font-bold text-gray-900 text-sm md:text-base leading-snug line-clamp-2 mb-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="font-medium">Qty: {item.quantity}</span>
                          <span className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}.00</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ADDRESS DETAILS */}
                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h5>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {order.customerDetails?.firstName} {order.customerDetails?.lastName}<br />
                      {order.customerDetails?.address}<br />
                      {order.customerDetails?.city}, {order.customerDetails?.state} {order.customerDetails?.zip}<br />
                      Phone: {order.customerDetails?.phone}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Payment Method</h5>
                    <p className="text-sm text-gray-800 font-medium">
                      {order.paymentMethod || 'Online Payment'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
