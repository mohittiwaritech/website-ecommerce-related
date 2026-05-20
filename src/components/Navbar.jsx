import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {

  const { cart } = useCart();

  // TOTAL PRICE
  const totalAmount = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  // TOTAL ITEMS
  const totalItems = cart.reduce(
    (acc, item) =>
      acc + item.quantity,
    0
  );

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
            Support
          </Link>

          <Link
            to="/contact"
            className="hover:text-blue-600"
          >
            Contact
          </Link>

        </div>

        {/* CART */}
        <div className="relative group">

          {/* CART BUTTON */}
          <button
            className="flex items-center gap-4 px-5 py-2 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-[#0088cc] transition-all duration-300"
          >

            {/* ICON */}
            <div className="relative">

              <div className="w-11 h-11 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-md text-lg">

                🛒

              </div>

              {/* COUNT */}
              {totalItems > 0 && (

                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[22px] h-[22px] flex items-center justify-center rounded-full border-2 border-white">

                  {totalItems}

                </span>

              )}

            </div>

            {/* TEXT */}
            <div className="flex flex-col leading-tight">

              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">

                Shopping Cart

              </span>

              <span className="text-sm font-bold text-gray-800">

                ₹
                {totalAmount.toLocaleString('en-IN')}

              </span>

            </div>

          </button>

          {/* DROPDOWN */}
          <div className="absolute right-0 top-16 mt-2 w-[400px] bg-white border border-gray-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">

            <div className="p-5">

              {/* TITLE */}
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">

                Added Products

              </h3>

              {/* EMPTY CART */}
              {cart.length === 0 ? (

                <p className="text-gray-500 text-sm text-center py-6">

                  No Products Added

                </p>

              ) : (

                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">

                  {cart.map((item) => (

                    <div
                      key={item.id}
                      className="flex items-start gap-4 border-b pb-4"
                    >

                      {/* IMAGE */}
                      <img
                        src={item.image || item.hoverImage}
                        alt={item.title || item.name}
                        className="w-16 h-16 object-contain border rounded-lg p-1 bg-white"
                      />

                      {/* DETAILS */}
                      <div className="flex-1">

                        {/* TITLE */}
                        <h4 className="text-[15px] font-semibold text-gray-800 leading-6 line-clamp-2">

                          {item.title || item.name}

                        </h4>

                        {/* QTY */}
                        <p className="text-sm text-gray-500 mt-1">

                          Qty:
                          {' '}
                          {item.quantity}

                        </p>

                        {/* PRICE */}
                        <p className="text-xl font-bold text-[#0088cc] mt-1">

                          ₹
                          {(item.price * item.quantity).toLocaleString('en-IN')}

                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              )}

              {/* FOOTER */}
              {cart.length > 0 && (

                <div className="pt-5">

                  <div className="flex justify-between items-center text-3xl font-bold mb-5">

                    <span>Total</span>

                    <span className="text-[#0088cc]">

                      ₹
                      {totalAmount.toLocaleString('en-IN')}

                    </span>

                  </div>

                  {/* VIEW CART BUTTON */}
                  <button
                    onClick={() => window.location.href='/cart'}
                    className="w-full bg-[#0088cc] hover:bg-[#006699] text-white py-4 rounded-2xl font-bold uppercase tracking-widest transition-all text-lg"
                  >
                    VIEW CART
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </nav>

  );
};

export default Navbar;