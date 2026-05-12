import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="w-full bg-white shadow-sm font-sans border-b">
      {/* Top Blue Bar */}
      <div className="bg-[#0073B7] text-white text-[10px] md:text-xs text-center py-1.5 uppercase font-medium tracking-wide">
        PREPAID AND COD ACCEPTED | FREE SHIPPING
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center py-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center cursor-pointer">
          {/* PATH FIXED: 'src/assets/logoo.png' ko badal kar '/assets/logoo.png' kiya gaya hai */}
          <img 
            src="/assets/logoo.png" 
            alt="Logo" 
            className="h-6 md:h-12 w-auto object-contain" 
            onError={(e) => { e.target.src = "https://via.placeholder.com/150x50?text=Logo"; }}
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-700">
          <Link to="/" className="hover:text-blue-600 transition-colors">HOME</Link>
          <Link to="/products" className="hover:text-blue-600 transition-colors">PRODUCTS ▾</Link>
          <Link to="/support" className="hover:text-blue-600 transition-colors">SUPPORT</Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors">CONTACT US</Link>
        </nav>

        {/* Login & Basket */}
        <div className="flex items-center gap-6 text-sm font-semibold text-gray-700">
          <Link to="/login" className="hover:text-blue-600">LOG IN</Link>
          <Link to="/cart" className="flex items-center gap-2 cursor-pointer group">
            <span className="group-hover:text-blue-600">BASKET / ₹0.00</span>
            <div className="relative border border-blue-600 p-1.5 rounded-sm">
               <span className="text-blue-600 text-[10px] font-bold px-1">0</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;