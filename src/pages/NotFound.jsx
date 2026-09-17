import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <SEO
        title="Page not found"
        description="This page does not exist on BillingZone."
        noindex
      />
      <p className="text-sm font-semibold tracking-widest text-[#0088cc] uppercase">404</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
        The link may be old, or the product was removed. You can go back to the shop or reach us on WhatsApp.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/products"
          className="bg-[#006699] hover:bg-[#004d73] text-white px-6 py-3 text-sm font-semibold"
        >
          Browse products
        </Link>
        <Link
          to="/contact"
          className="border border-gray-300 hover:border-gray-500 px-6 py-3 text-sm font-semibold text-gray-700"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
