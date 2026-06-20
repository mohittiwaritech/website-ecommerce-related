import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useLocation } from 'react-router-dom';

const OrderComplete = () => {

  const { cart } = useCart();
  const location = useLocation();
  const orderData = location.state?.orderData;
  const displayCart = orderData ? orderData.items : cart;

  const subtotal = displayCart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  const gst = subtotal * 0.18;

  const orderNumber =
    Math.floor(
      100000 + Math.random() * 900000
    );

  return (

    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* STEPS */}
      <div className="text-center text-lg md:text-2xl text-gray-300 font-light mb-10">

        SHOPPING CART
        {' > '}
        CHECKOUT DETAILS
        {' > '}

        <span className="text-black font-semibold">

          ORDER COMPLETE

        </span>

      </div>

      {/* SUCCESS */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-5 shadow-sm mb-10">

        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl">

          ✓

        </div>

        <div>

          <h2 className="text-2xl font-bold text-green-700">

            Order Placed Successfully

          </h2>

          <p className="text-gray-600 mt-2 text-sm">

            Thank you for shopping with us.
            Your order has been confirmed.

          </p>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2">

          {/* ORDER DETAILS */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold">

                Order Details

              </h2>

              <span className="bg-[#006699] text-white text-xs px-4 py-2 rounded-full font-semibold">

                ORDER #{orderNumber}

              </span>

            </div>

            {/* PRODUCTS */}
            <div className="space-y-5">

              {displayCart.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-5"
                >

                  {/* IMAGE */}
                  <div className="flex items-center gap-4">

                    <img
                      src={
                        item.image ||
                        item.hoverImage
                      }
                      alt={
                        item.title ||
                        item.name
                      }
                      className="w-20 h-20 object-contain border rounded-xl"
                    />

                    <div>

                      <h3 className="font-semibold text-sm leading-6">

                        {item.title || item.name}

                      </h3>

                      <p className="text-xs text-gray-500 mt-1">

                        Qty:
                        {' '}
                        {item.quantity}

                      </p>

                    </div>

                  </div>

                  {/* PRICE */}
                  <div className="font-bold text-lg">

                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString('en-IN')}

                  </div>

                </div>

              ))}

            </div>

            {/* TOTAL */}
            <div className="mt-8 space-y-4 text-sm">

              <div className="flex justify-between">

                <span>

                  Subtotal

                </span>

                <span className="font-semibold">

                  ₹
                  {subtotal.toLocaleString(
                    'en-IN'
                  )}

                </span>

              </div>

              <div className="flex justify-between">

                <span>

                  Shipping

                </span>

                <span className="text-green-600 font-semibold">

                  Free Shipping

                </span>

              </div>

              <div className="flex justify-between border-t pt-4 text-xl font-bold">

                <span>

                  Total

                </span>

                <div className="text-right">

                  ₹
                  {subtotal.toLocaleString(
                    'en-IN'
                  )}

                  <p className="text-xs text-gray-400 font-normal mt-1">

                    Includes ₹
                    {gst.toFixed(2)}
                    {' '}
                    GST

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm sticky top-5">

            <h2 className="text-2xl font-bold mb-6">

              Order Summary

            </h2>

            <div className="space-y-5 text-sm">

              <div className="flex justify-between">

                <span className="text-gray-500">

                  Order Number

                </span>

                <span className="font-semibold">

                  #{orderNumber}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">

                  Date

                </span>

                <span>

                  {new Date().toLocaleDateString()}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">

                  Payment

                </span>

                <span>

                  Cash on Delivery

                </span>

              </div>

              <div className="flex justify-between border-t pt-5">

                <span className="text-lg font-bold">

                  Total

                </span>

                <span className="text-xl font-bold text-[#006699]">

                  ₹
                  {subtotal.toLocaleString(
                    'en-IN'
                  )}

                </span>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-col gap-3">

              <Link to="/products" className="block">

                <button className="w-full bg-[#006699] hover:bg-[#004d73] text-white py-3 rounded-xl font-semibold">

                  Continue Shopping

                </button>

              </Link>

              <Link to="/" className="block">

                <button className="w-full border border-gray-300 hover:bg-gray-100 py-3 rounded-xl font-semibold">

                  Back To Home

                </button>

              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderComplete;