import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useLocation } from 'react-router-dom';

const OrderComplete = () => {
  const { cart } = useCart();
  const location = useLocation();
  
  // Extract orderData from route navigation state
  const orderData = location.state?.orderData;
  const displayCart = orderData ? orderData.items : cart;

  const subtotal = displayCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const displayPaymentMethod = orderData?.paymentMethod || 'Online Payment';
  const codFee = displayPaymentMethod === 'Cash on Delivery' ? 75 : 0;
  const finalTotal = orderData?.total || (subtotal + codFee);
  
  // Calculate GST as included in the subtotal
  const gst = orderData?.gst || (subtotal * 18 / 118);

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
          
          {/* GOOGLE BANNER */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Save time next time you checkout by linking your account to your favorite social network. No need to remember another username and password.
            </p>
            <button className="flex items-center gap-2.5 bg-[#4285F4] hover:bg-[#357AE8] text-white px-4 py-2 text-sm font-semibold rounded shadow-sm transition-colors cursor-pointer">
              <div className="bg-white p-1 rounded flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.77z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.39 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.24A7.16 7.16 0 0 1 4.9 12c0-.79.13-1.57.38-2.34V6.51H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.39l4.11-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.39 0 3.18 2.12 1.21 5.39l4.11 3.15c.94-2.85 3.57-4.96 6.68-4.96z"
                  />
                </svg>
              </div>
              Link your account to Google
            </button>
          </div>

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
                    <td className="py-3.5 font-semibold text-gray-600">Subtotal:</td>
                    <td className="py-3.5 text-right font-semibold text-gray-900">
                      ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    <td className="py-5 text-gray-900">Total:</td>
                    <td className="py-5 text-right text-gray-900">
                      ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-xs font-normal text-gray-400 block mt-1">
                        (includes ₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} GST)
                      </span>
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