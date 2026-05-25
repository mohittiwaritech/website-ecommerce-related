import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const { totalItems, totalPrice, setIsDrawerOpen } = useCart();

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
            to="/support"
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

        {/* CART */}
        <div className="relative">
          {/* CART BUTTON */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-4 px-5 py-2 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-[#0088cc] hover:scale-102 active:scale-98 transition-all duration-300"
            aria-label="Open cart drawer"
          >
            {/* ICON */}
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-md text-lg">
                🛒
              </div>

              {/* COUNT */}
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[22px] h-[22px] flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                  {totalItems}
                </span>
              )}
            </div>

            {/* TEXT */}
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Shopping Cart
              </span>
              <span className="text-sm font-bold text-slate-800">
                ₹{totalPrice.toLocaleString('en-IN')}.00
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Slide-out Cart Drawer Component */}
      <CartDrawer />
    </nav>
  );
};

export default Navbar;