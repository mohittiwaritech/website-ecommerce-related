import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const { cart, totalItems, totalPrice, setIsDrawerOpen, removeFromCart } = useCart();
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold italic text-blue-900"
        >
          Billing
          <span className="text-green-500">
            Zone
          </span>
        </Link>

        {/* MENU */}
        <div className="hidden md:flex space-x-8 font-semibold text-gray-700 uppercase text-sm">
          <Link
            to="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="hover:text-blue-600"
          >
            Products
          </Link>

          <Link
            to="/drivers"
            className="hover:text-blue-600"
          >
            Drivers
          </Link>

          <Link
            to="/contact"
            className="hover:text-blue-600"
          >
            Contact
          </Link>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          
          {/* USER ACCOUNT */}
          {currentUser ? (
            <div className="relative group">
              <Link to="/my-orders" className="text-gray-600 hover:text-blue-600 font-semibold text-sm mr-4">
                My Orders
              </Link>
              <button 
                onClick={logout}
                className="text-gray-600 hover:text-red-600 font-semibold text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-semibold text-sm">
              Login / Register
            </Link>
          )}

          {/* CART */}
          <div className="relative group h-20 flex items-center">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-3 font-bold text-gray-700 uppercase text-[13px] hover:text-[#006699] transition-colors"
              aria-label="Open cart drawer"
            >
              <span className="hidden sm:inline">BASKET / ₹{totalPrice.toLocaleString('en-IN')}.00</span>
              
              {/* BAG ICON */}
              <div className="relative">
                <div className="w-8 h-8 bg-[#006699] flex items-center justify-center rounded-sm shadow-sm">
                  <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
                {/* BADGE */}
                {totalItems > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#006699] text-white border-2 border-white text-[10px] font-bold w-[22px] h-[22px] flex items-center justify-center rounded-full shadow-sm">
                    {totalItems}
                  </span>
                )}
              </div>
            </button>

            {/* HOVER DROPDOWN (DESKTOP) */}
            <div className="absolute right-0 top-[70px] w-[320px] bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-5 rounded-sm flex flex-col">
              {/* Tooltip Arrow */}
              <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45"></div>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-6 text-sm">No products in the basket.</p>
              ) : (
                <>
                  <div className="max-h-80 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center border-b border-gray-50 pb-4 relative group/item">
                        <div className="w-16 h-16 bg-white border border-gray-100 p-1 flex items-center justify-center flex-shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 pr-4">
                          <Link to={`/product/${item.id}`} className="text-[13px] font-semibold text-[#006699] hover:underline leading-snug line-clamp-2">
                            {item.title}
                          </Link>
                          <p className="text-[13px] text-gray-500 mt-1">{item.quantity} × ₹{item.price.toLocaleString('en-IN')}.00</p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }} 
                          className="absolute top-1 right-0 text-gray-300 hover:text-red-500 transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center py-4 font-bold text-sm text-gray-800">
                    <span>Subtotal:</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}.00</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link to="/cart" className="w-full bg-[#006699] hover:bg-[#004d73] text-white text-center py-3 text-[13px] font-bold transition">
                      VIEW BASKET
                    </Link>
                    <Link to="/checkout" className="w-full bg-[#006699] hover:bg-[#004d73] text-white text-center py-3 text-[13px] font-bold transition">
                      CHECKOUT
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Cart Drawer Component */}
      <CartDrawer />
    </nav>
  );
};

export default Navbar;