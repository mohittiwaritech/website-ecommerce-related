import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {

  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadingItemIds
  } = useCart();

  // TOTAL
  const subtotal = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  const gst = subtotal * 0.18;

  // ALL INDIAN STATES
  const indianStates = [

    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi"

  ];

  // ADDRESS FORM SHOW/HIDE
  const [showAddressForm, setShowAddressForm] =
    useState(false);

  // SHIPPING ADDRESS
  const [shippingAddress, setShippingAddress] =
    useState({

      country: 'India',

      state: 'Uttar Pradesh',

      city: 'NOIDA',

      pincode: '201301'

    });

  // EMPTY CART
  if (cart.length === 0) {

    return (

      <div className="flex flex-col items-center justify-center py-20">

        <h2 className="text-2xl font-bold mb-4">

          Cart is empty

        </h2>

        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >

          Start Shopping

        </Link>

      </div>
    );
  }

  return (

    <div className="max-w-7xl mx-auto p-6 font-sans">

      {/* HEADING */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">

        <h1 className="text-3xl font-light">

          SHOPPING CART

        </h1>

        {/* REMOVE ALL */}
        {(() => {
          const isClearing = loadingItemIds.includes('clear');
          return (
            <button
              onClick={clearCart}
              disabled={isClearing}
              className={`bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded font-bold text-sm flex items-center gap-1.5 transition-all ${
                isClearing ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {isClearing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>CLEARING...</span>
                </>
              ) : (
                'REMOVE ALL'
              )}
            </button>
          );
        })()}

      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* LEFT SIDE */}
        <div className="flex-[2] overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="border-b text-gray-500 text-sm">

                <th className="py-3">

                  PRODUCT

                </th>

                <th className="py-3">

                  PRICE

                </th>

                <th className="py-3 text-center">

                  QUANTITY

                </th>

                <th className="py-3 text-right">

                  SUBTOTAL

                </th>

              </tr>

            </thead>

            <tbody>

              {cart.map((item) => {
                const isItemLoading = loadingItemIds.includes(String(item.id));
                return (
                  <tr
                    key={item.id}
                    className={`border-b align-middle transition-opacity duration-300 ${
                      isItemLoading ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    {/* PRODUCT */}
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        {/* REMOVE */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={isItemLoading}
                          className="text-gray-400 hover:text-red-500 text-2xl disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          ×
                        </button>

                        {/* IMAGE */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-contain border rounded-md p-1 bg-white"
                        />

                        {/* TITLE */}
                        <div>
                          <p className="text-blue-600 text-sm leading-6 max-w-[250px]">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="py-4 font-semibold text-gray-700">
                      ₹{item.price.toLocaleString('en-IN')}.00
                    </td>

                    {/* QUANTITY */}
                    <td className="py-4">
                      <div className="flex items-center justify-center border w-24 mx-auto rounded bg-slate-50 overflow-hidden">
                        {/* MINUS */}
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={isItemLoading || item.quantity <= 1}
                          className="px-3 py-1 hover:bg-gray-200 text-slate-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          -
                        </button>

                        {/* COUNT */}
                        <span className="px-3 select-none font-bold text-slate-800 text-sm">
                          {item.quantity}
                        </span>

                        {/* PLUS */}
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={isItemLoading}
                          className="px-3 py-1 hover:bg-gray-200 text-slate-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* SUBTOTAL */}
                    <td className="py-4 text-right font-bold text-gray-800">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}.00
                    </td>
                  </tr>
                );
              })}

            </tbody>

          </table>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4 mt-8">

            <Link
              to="/products"
              className="border-2 border-blue-400 text-blue-500 px-6 py-2 font-bold hover:bg-blue-50"
            >

              ← CONTINUE SHOPPING

            </Link>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 bg-white border border-gray-200 p-6 h-fit shadow-sm">

          <h2 className="text-xl font-bold border-b pb-2 mb-4">

            BASKET TOTALS

          </h2>

          {/* SUBTOTAL */}
          <div className="flex justify-between py-2 text-gray-600">

            <span>

              Subtotal

            </span>

            <span className="font-bold">

              ₹
              {subtotal.toLocaleString(
                'en-IN'
              )}

            </span>

          </div>

          {/* SHIPPING */}
          <div className="border-t mt-4 pt-4">

            <div className="flex justify-between items-start">

              <span className="text-gray-700 font-medium">

                Shipment

              </span>

              <div className="text-right text-sm">

                <p className="text-gray-600">

                  Free shipping

                </p>

                <p className="font-medium mt-1">

                  Shipping to
                  {' '}
                  {shippingAddress.city}
                  {' '}
                  {shippingAddress.pincode},
                  {' '}
                  {shippingAddress.state}

                </p>

                {/* CHANGE ADDRESS BUTTON */}
                <button
                  onClick={() =>
                    setShowAddressForm(
                      (prev) => !prev
                    )
                  }
                  className="text-blue-500 underline mt-1 hover:text-blue-700 font-medium transition-all"
                >

                  {showAddressForm
                    ? 'Close address form'
                    : 'Change address'}

                </button>

              </div>

            </div>

            {/* ADDRESS FORM */}
            {showAddressForm && (

              <div className="bg-gray-50 p-4 rounded-lg mt-4 space-y-4">

                {/* COUNTRY */}
                <div>

                  <label className="text-sm text-gray-600 block mb-1">

                    Country / Region

                  </label>

                  <select
                    value={shippingAddress.country}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        country: e.target.value
                      })
                    }
                    className="w-full border px-3 py-2 rounded"
                  >

                    <option>

                      India

                    </option>

                  </select>

                </div>

                {/* STATE */}
                <div>

                  <label className="text-sm text-gray-600 block mb-1">

                    State / County

                  </label>

                  <select
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        state: e.target.value
                      })
                    }
                    className="w-full border px-3 py-2 rounded"
                  >

                    {indianStates.map((state) => (

                      <option
                        key={state}
                        value={state}
                      >

                        {state}

                      </option>

                    ))}

                  </select>

                </div>

                {/* CITY */}
                <div>

                  <label className="text-sm text-gray-600 block mb-1">

                    City

                  </label>

                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value
                      })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />

                </div>

                {/* PINCODE */}
                <div>

                  <label className="text-sm text-gray-600 block mb-1">

                    Postcode / ZIP

                  </label>

                  <input
                    type="text"
                    value={shippingAddress.pincode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        pincode: e.target.value
                      })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />

                </div>

                {/* UPDATE BUTTON */}
                <button
                  onClick={() => {

                    toast.success(
                      'Address Updated Successfully'
                    );

                    setShowAddressForm(false);

                  }}
                  className="w-full bg-[#006699] hover:bg-[#004d73] text-white py-3 font-bold rounded transition-all"
                >

                  UPDATE ADDRESS

                </button>

              </div>

            )}

          </div>

          {/* TOTAL */}
          <div className="flex justify-between py-4 text-xl font-bold border-t mt-4 border-b">

            <span>

              Total

            </span>

            <div className="text-right">

              <p>

                ₹
                {subtotal.toLocaleString(
                  'en-IN'
                )}

              </p>

              <p className="text-[10px] text-gray-400 font-normal">

                (includes ₹
                {gst.toFixed(2)} GST)

              </p>

            </div>

          </div>

          {/* CHECKOUT */}
          <button
            onClick={() =>
              window.location.href='/checkout'
            }
            className="w-full bg-[#006699] text-white py-3 mt-6 font-bold hover:bg-[#004d73] tracking-wider transition-all"
          >

            PROCEED TO CHECKOUT

          </button>

        </div>

      </div>

    </div>
  );
};

export default Cart;