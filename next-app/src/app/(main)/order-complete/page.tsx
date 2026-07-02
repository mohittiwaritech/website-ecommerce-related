"use client";
import Link from "next/link";
import React from 'react';
import { useCart } from '@/context/CartContext';


const OrderComplete = () => {
  const { cart } = useCart();
  
  
  // Extract orderData from route navigation state
  const orderData = null;
  const displayCart = orderData ? orderData.items : cart;

  const subtotal = displayCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const displayPaymentMethod = orderData?.paymentMethod || 'Online Payment';
  const codFee = displayPaymentMethod === 'Cash on Delivery' ? 75 : 0;
  
  // Calculate GST as 18% included in the subtotal
  const gst = orderData?.gst || (subtotal * 18 / 118);
  const finalTotal = orderData?.total || (subtotal + codFee);
  const subtotalExclTax = subtotal - gst;

  const orderNumber = orderData?.id || Math.floor(100000 + Math.random() * 900000);

  const customerDetails = orderData?.customerDetails || {
    firstName: 'Mohit',
    lastName: 'Tiwari',
    address: 'C - 56/22, Sector 62 Road, C Block, Phase 2, Industrial Area, Noida, Uttar Pradesh',
    city: 'Noida',
    state: 'Uttar Pradesh',
    zip: '201309',
    phone: '+916393784020',
    email: 'mt806414@gmail.com'
  };

  const getOrdinalDate = (date) => {
    const day = date.getDate();
    const year = date.getFullYear();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[date.getMonth()];
    
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';

    return `${day}${suffix} ${month} ${year}`;
  };

  const orderDateText = orderData?.createdAt 
    ? getOrdinalDate(new Date(orderData.createdAt)) 
    : getOrdinalDate(new Date());

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 font-sans">
      {/* STEPS */}
      <div className="text-center text-lg md:text-xl text-gray-300 font-light mb-10 tracking-wider">
        SHOPPING CART
        <span className="mx-2 text-gray-300">›</span>
        CHECKOUT DETAILS
        <span className="mx-2 text-gray-300">›</span>
        <span className="text-black font-semibold">ORDER COMPLETE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* LEFT COLUMN (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PAYMENT NOTIFICATION */}
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {displayPaymentMethod === 'Cash on Delivery' 
                ? 'Pay with cash upon delivery.' 
                : 'Paid online via Razorpay.'}
            </p>
          </div>

          {/* ORDER DETAILS TABLE */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Order details</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-wider">
                    <th className="py-3">Product</th>
                    <th className="py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {displayCart.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 font-normal text-gray-800">
                        {item.title || item.name} <span className="text-gray-400 ml-1">× {item.quantity}</span>
                      </td>
                      <td className="py-4 text-right font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  
                   <tr>
                    <td className="py-3.5 font-semibold text-gray-600">Subtotal (Excl. Tax):</td>
                    <td className="py-3.5 text-right font-semibold text-gray-900">
                      ₹{subtotalExclTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="py-3.5 font-semibold text-gray-600">GST (18%):</td>
                    <td className="py-3.5 text-right font-semibold text-gray-900">
                      ₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="py-3.5 font-semibold text-gray-600">Shipping:</td>
                    <td className="py-3.5 text-right font-semibold text-green-600">
                      Free shipping
                    </td>
                  </tr>

                  {displayPaymentMethod === 'Cash on Delivery' && (
                    <tr>
                      <td className="py-3.5 font-semibold text-gray-600">Cash on delivery:</td>
                      <td className="py-3.5 text-right font-semibold text-gray-900">
                        ₹75.00
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td className="py-3.5 font-semibold text-gray-600">Payment method:</td>
                    <td className="py-3.5 text-right text-gray-600 font-medium">
                      {displayPaymentMethod}
                    </td>
                  </tr>

                  <tr className="border-t-2 border-gray-200 text-base font-bold">
                    <td className="py-5 text-gray-900">Total (Incl. Tax):</td>
                    <td className="py-5 text-right text-lg text-[#0088cc]">
                      ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ADDRESSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900">Billing address</h3>
              <address className="not-italic text-sm text-gray-600 space-y-1.5 leading-relaxed">
                <p className="font-bold text-gray-900">{customerDetails.firstName} {customerDetails.lastName}</p>
                <p className="italic">{customerDetails.address}</p>
                <p className="italic">{customerDetails.city} {customerDetails.zip}</p>
                <p className="italic">{customerDetails.state}</p>
                <p className="pt-1.5 font-medium">{customerDetails.phone}</p>
                <p className="text-[#0088cc] hover:underline cursor-pointer font-medium">{customerDetails.email}</p>
              </address>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900">Shipping address</h3>
              <address className="not-italic text-sm text-gray-600 space-y-1.5 leading-relaxed">
                <p className="font-bold text-gray-900">{customerDetails.firstName} {customerDetails.lastName}</p>
                <p className="italic">{customerDetails.address}</p>
                <p className="italic">{customerDetails.city} {customerDetails.zip}</p>
                <p className="italic">{customerDetails.state}</p>
                <p className="pt-1.5 font-medium">{customerDetails.phone}</p>
              </address>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (1/3 width) */}
        <div className="space-y-6">
          
          {/* GREEN SUMMARY CARD */}
          <div className="bg-[#fbfdfa] border border-[#e1e9dd] rounded-xl p-6 text-sm text-gray-700 shadow-sm">
            <p className="mb-6 leading-relaxed font-semibold text-[#4d6a40] text-sm">
              {displayPaymentMethod === 'Cash on Delivery'
                ? 'Thank you for shopping with us. Your order has been received and is being processed.'
                : 'Thank you for shopping with us. Your account has been charged and your transaction is successful. We will be processing your order soon.'}
            </p>
            <ul className="space-y-3.5 text-gray-900 font-semibold list-disc list-inside">
              <li>
                Order number: <span className="font-normal text-gray-700 ml-1">#{orderNumber}</span>
              </li>
              <li>
                Date: <span className="font-normal text-gray-700 ml-1">{orderDateText}</span>
              </li>
              <li>
                Email: <span className="font-normal text-gray-700 ml-1">{customerDetails.email}</span>
              </li>
              <li>
                Total: <span className="font-normal text-gray-700 ml-1">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </li>
              <li>
                Payment method: <span className="font-normal text-gray-700 ml-1">{displayPaymentMethod}</span>
              </li>
            </ul>
          </div>

          {/* BACK TO SHOPPING BUTTONS */}
          <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
            <Link to="/products" className="block">
              <button className="w-full bg-[#006699] hover:bg-[#004d73] text-white py-3 rounded-lg font-bold text-sm tracking-wider transition-colors cursor-pointer">
                CONTINUE SHOPPING
              </button>
            </Link>
            <Link to="/" className="block">
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-bold text-sm tracking-wider transition-colors cursor-pointer">
                BACK TO HOME
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};


export default OrderComplete;
