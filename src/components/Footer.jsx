import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full font-sans">
      {/* Upper Footer: Modern Grid */}
      <div className="bg-[#2C2C2C] text-gray-300 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Company Info */}
          <div className="space-y-6">
            <h4 className="text-white text-sm font-bold uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">
              Billing Zone
            </h4>
            <div className="text-[13px] leading-relaxed space-y-4">
              <p className="flex items-start gap-3">
                <span className="text-blue-500">📍</span>
                C-56/22 Sector 62, Noida, Uttar Pradesh, 201309
              </p>
              <p className="flex items-center gap-3">
                <span className="text-blue-500">📞</span>
                +91 9289024863
              </p>
              <p className="flex items-center gap-3">
                <span className="text-blue-500">✉️</span>
                sales@slantco.com
              </p>
              <p className="pt-2 text-gray-400">Mon - Sat : 10:00 AM - 07:00 PM</p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white text-sm font-bold uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">
              Services
            </h4>
            <ul className="text-[13px] space-y-3">
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">SOFTWARE</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">HARDWARE</a></li>
            </ul>
          </div>

          {/* Column 3: Help & Support */}
          <div className="space-y-6">
            <h4 className="text-white text-sm font-bold uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">
              Support
            </h4>
            <ul className="text-[13px] space-y-3">
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Printer Drivers & Manuals</a></li>
            </ul>
          </div>

          {/* Column 4: Social & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-white text-sm font-bold uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">
              Stay Connected
            </h4>
            <div className="flex gap-4">
              {/* YouTube Icon */}
              <a href="#" className="w-9 h-9 bg-gray-700 flex items-center justify-center rounded-full hover:bg-red-600 transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              {/* Instagram Icon */}
              <a href="#" className="w-9 h-9 bg-gray-700 flex items-center justify-center rounded-full hover:bg-pink-600 transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
            <p className="text-[12px] text-gray-400">Subscribe for product updates and exclusive offers.</p>
          </div>

        </div>
      </div>

      {/* Bottom Footer: Dark Branding Strip */}
      <div className="bg-[#121212] py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyright Text */}
          <div className="text-center md:text-left">
            <p className="text-[#666] text-[11px] font-medium uppercase tracking-[0.15em]">
              © 2017 - 2026 <span className="text-white">BillingZone.in</span> | All Rights Reserved.
            </p>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold text-gray-500 uppercase mr-2 tracking-tighter">Secure Payments:</span>
            <div className="flex gap-2">
              <div className="bg-gray-800/50 border border-gray-700 px-3 py-1 rounded-sm text-[10px] text-gray-400 font-bold">UPI</div>
              <div className="bg-gray-800/50 border border-gray-700 px-3 py-1 rounded-sm text-[10px] text-gray-400 font-bold">VISA</div>
              <div className="bg-gray-800/50 border border-gray-700 px-3 py-1 rounded-sm text-[10px] text-gray-400 font-bold">MASTERCARD</div>
              <div className="bg-gray-800/50 border border-gray-700 px-3 py-1 rounded-sm text-[10px] text-gray-400 font-bold">COD</div>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;