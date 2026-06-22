import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { getProductUrl } from '../utils/slugify';


const CartDrawer = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    totalPrice,
    totalItems,
    isDrawerOpen,
    setIsDrawerOpen,
    loadingItemIds
  } = useCart();

  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Close drawer on pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling when drawer is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen, setIsDrawerOpen]);

  // Click outside to close
  const handleBackdropClick = (e) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target)) {
      setIsDrawerOpen(false);
    }
  };

  const handleNavigate = (path) => {
    setIsDrawerOpen(false);
    navigate(path);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] transition-all duration-500 ease-in-out ${
        isDrawerOpen ? 'visible' : 'invisible pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop with elegant blur */}
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] transition-opacity duration-500 ease-in-out ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleBackdropClick}
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-out border-l border-slate-100 ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0088cc]" />
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">
              Shopping Basket ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-slate-200/80 transition-all text-slate-400 hover:text-slate-800"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-700 text-lg">Your basket is empty</h3>
                <p className="text-slate-400 text-sm mt-1">Add items to get started!</p>
              </div>
              <button
                onClick={() => handleNavigate('/products')}
                className="bg-[#0088cc] hover:bg-[#006699] text-white px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md hover:shadow-lg"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const isItemLoading = loadingItemIds.includes(String(item.id));
              return (
                <div
                  key={item.id}
                  className={`flex gap-4 border border-slate-100 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group ${
                    isItemLoading ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  {/* Subtle Loading Shimmer Overlay for specific item */}
                  {isItemLoading && (
                    <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10">
                      <div className="w-5 h-5 border-2 border-[#0088cc] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="w-20 h-20 bg-slate-50 rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        {item.tag || item.category}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2 mt-0.5 hover:text-[#0088cc] cursor-pointer" onClick={() => handleNavigate(getProductUrl(item))}>
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1 || isItemLoading}
                          className="px-2.5 py-1 text-slate-500 hover:bg-slate-200/80 transition-colors disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={isItemLoading}
                          className="px-2.5 py-1 text-slate-500 hover:bg-slate-200/80 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Pricing */}
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium">
                          ₹{item.price.toLocaleString('en-IN')}.00 each
                        </p>
                        <p className="text-sm font-bold text-[#0088cc]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}.00
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    disabled={isItemLoading}
                    className="absolute top-2 right-2 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 hover:opacity-100 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Area */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 backdrop-blur-md space-y-4">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>Subtotal (Excl. Tax)</span>
                <span className="text-slate-800 font-semibold">
                  ₹{(totalPrice / 1.18).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>GST (18%)</span>
                <span className="text-slate-800 font-semibold">
                  ₹{(totalPrice - (totalPrice / 1.18)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>Shipping</span>
                <span className="text-green-600 font-bold uppercase text-xs">FREE</span>
              </div>
              <div className="flex justify-between text-slate-800 border-t border-slate-100 pt-2">
                <span className="font-semibold">Total (Incl. Tax)</span>
                <span className="text-xl font-black text-[#0088cc]">
                  ₹{totalPrice.toLocaleString('en-IN')}.00
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleNavigate('/cart')}
                className="w-full py-3.5 rounded-xl border-2 border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-900 font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                View Basket
              </button>
              <button
                onClick={() => handleNavigate('/checkout')}
                className="w-full bg-[#0088cc] hover:bg-[#006699] text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
              >
                Checkout <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
