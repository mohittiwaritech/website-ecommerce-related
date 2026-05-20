import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {

  // NAVIGATE
  const navigate = useNavigate();

  // CART
  const {
    cart,
    clearCart
  } = useCart();

  // SUBTOTAL
  const subtotal = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  // GST
  const gst = subtotal * 0.18;

  // FORM DATA
  const [formData, setFormData] = useState({

    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: ''

  });

  // ERRORS
  const [errors, setErrors] = useState({});

  // VALIDATION
  const validateForm = () => {

    let newErrors = {};

    if (!formData.firstName)
      newErrors.firstName =
        'First Name is required';

    if (!formData.lastName)
      newErrors.lastName =
        'Last Name is required';

    if (!formData.address)
      newErrors.address =
        'Address is required';

    if (!formData.city)
      newErrors.city =
        'City is required';

    if (!formData.state)
      newErrors.state =
        'State is required';

    if (!formData.zip)
      newErrors.zip =
        'ZIP Code is required';

    if (!formData.phone)
      newErrors.phone =
        'Phone Number is required';

    if (!formData.email)
      newErrors.email =
        'Email Address is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  return (

    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* TOP STEPS */}
      <div className="text-center text-xl md:text-2xl text-gray-300 font-light mb-10">

        SHOPPING CART
        {' > '}

        <span className="text-black font-semibold">

          CHECKOUT DETAILS

        </span>

        {' > '}
        ORDER COMPLETE

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-6 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">

            BILLING DETAILS

          </h2>

          <div className="space-y-4">

            {/* FIRST + LAST NAME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* FIRST NAME */}
              <div>

                <label className="block mb-1 text-sm font-medium">

                  First Name *

                </label>

                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstName: e.target.value
                    })
                  }
                  className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:outline-none focus:border-[#006699]"
                />

                {errors.firstName && (

                  <p className="text-red-500 text-xs mt-1">

                    {errors.firstName}

                  </p>

                )}

              </div>

              {/* LAST NAME */}
              <div>

                <label className="block mb-1 text-sm font-medium">

                  Last Name *

                </label>

                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastName: e.target.value
                    })
                  }
                  className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:outline-none focus:border-[#006699]"
                />

                {errors.lastName && (

                  <p className="text-red-500 text-xs mt-1">

                    {errors.lastName}

                  </p>

                )}

              </div>

            </div>

            {/* ADDRESS */}
            <div>

              <label className="block mb-1 text-sm font-medium">

                Street Address *

              </label>

              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value
                  })
                }
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:outline-none focus:border-[#006699]"
              />

              {errors.address && (

                <p className="text-red-500 text-xs mt-1">

                  {errors.address}

                </p>

              )}

            </div>

            {/* CITY */}
            <div>

              <label className="block mb-1 text-sm font-medium">

                Town / City *

              </label>

              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    city: e.target.value
                  })
                }
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:outline-none focus:border-[#006699]"
              />

              {errors.city && (

                <p className="text-red-500 text-xs mt-1">

                  {errors.city}

                </p>

              )}

            </div>

            {/* STATE */}
            <div>

              <label className="block mb-1 text-sm font-medium">

                State *

              </label>

              <select
                value={formData.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    state: e.target.value
                  })
                }
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:outline-none focus:border-[#006699]"
              >

                <option value="">
                  Select State
                </option>

                <option>
                  Uttar Pradesh
                </option>

                <option>
                  Delhi
                </option>

                <option>
                  Haryana
                </option>

                <option>
                  Maharashtra
                </option>

                <option>
                  Telangana
                </option>

              </select>

              {errors.state && (

                <p className="text-red-500 text-xs mt-1">

                  {errors.state}

                </p>

              )}

            </div>

            {/* ZIP */}
            <div>

              <label className="block mb-1 text-sm font-medium">

                ZIP Code *

              </label>

              <input
                type="text"
                value={formData.zip}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    zip: e.target.value
                  })
                }
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:outline-none focus:border-[#006699]"
              />

              {errors.zip && (

                <p className="text-red-500 text-xs mt-1">

                  {errors.zip}

                </p>

              )}

            </div>

            {/* PHONE */}
            <div>

              <label className="block mb-1 text-sm font-medium">

                Phone *

              </label>

              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value
                  })
                }
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:outline-none focus:border-[#006699]"
              />

              {errors.phone && (

                <p className="text-red-500 text-xs mt-1">

                  {errors.phone}

                </p>

              )}

            </div>

            {/* EMAIL */}
            <div>

              <label className="block mb-1 text-sm font-medium">

                Email Address *

              </label>

              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                }
                className="w-full border border-gray-300 p-2 text-sm rounded-lg focus:outline-none focus:border-[#006699]"
              />

              {errors.email && (

                <p className="text-red-500 text-xs mt-1">

                  {errors.email}

                </p>

              )}

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white border border-[#006699] rounded-xl p-5 shadow-sm h-fit">

          <h2 className="text-2xl font-bold mb-5">

            YOUR ORDER

          </h2>

          {/* PRODUCTS */}
          <div className="space-y-4 border-b pb-4 max-h-[250px] overflow-y-auto">

            {cart.map((item) => (

              <div
                key={item.id}
                className="flex justify-between gap-4 text-sm"
              >

                <div className="flex gap-3">

                  <img
                    src={
                      item.image ||
                      item.hoverImage
                    }
                    alt={
                      item.title ||
                      item.name
                    }
                    className="w-14 h-14 object-contain border rounded"
                  />

                  <div>

                    <p className="font-semibold leading-5">

                      {item.title || item.name}

                    </p>

                    <p className="text-gray-500 text-xs mt-1">

                      Qty:
                      {' '}
                      {item.quantity}

                    </p>

                  </div>

                </div>

                <div className="font-bold whitespace-nowrap">

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
          <div className="space-y-3 py-5 border-b text-sm">

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

              <span>
                Free Shipping
              </span>

            </div>

            <div className="flex justify-between text-lg font-bold pt-2">

              <span>
                Total
              </span>

              <div className="text-right">

                ₹
                {subtotal.toLocaleString(
                  'en-IN'
                )}

                <p className="text-xs text-gray-400 font-normal">

                  incl.
                  {' '}
                  ₹
                  {gst.toFixed(2)}
                  {' '}
                  GST

                </p>

              </div>

            </div>

          </div>

          {/* PAYMENT */}
          <div className="py-5 space-y-3">

            <label className="flex items-start gap-3 border rounded-lg p-3 cursor-pointer hover:border-[#006699] transition-all">

              <input
                type="radio"
                name="payment"
                defaultChecked
                className="mt-1 accent-[#006699]"
              />

              <div>

                <p className="font-semibold text-sm">

                  Online Payment

                </p>

                <p className="text-xs text-gray-500 mt-1">

                  UPI / Debit Card / Credit Card

                </p>

              </div>

            </label>

            <label className="flex items-start gap-3 border rounded-lg p-3 cursor-pointer hover:border-[#006699] transition-all">

              <input
                type="radio"
                name="payment"
                className="mt-1 accent-[#006699]"
              />

              <div>

                <p className="font-semibold text-sm">

                  Cash on Delivery

                </p>

              </div>

            </label>

            <label className="flex items-start gap-2 text-xs leading-5">

              <input
                type="checkbox"
                className="mt-1 accent-[#006699]"
              />

              <span>

                I agree to the terms and conditions

              </span>

            </label>

          </div>

          {/* PLACE ORDER */}
          <button
            onClick={() => {

              if (validateForm()) {

                // CLEAR CART
                clearCart();

                // REDIRECT
                navigate(
                  '/order-complete'
                );

              } else {

                alert(
                  'Please fill all required details'
                );

              }

            }}
            className="w-full bg-[#006699] hover:bg-[#004d73] text-white py-3 font-bold text-sm tracking-wider rounded-lg transition-all"
          >

            PLACE ORDER

          </button>

        </div>

      </div>

    </div>
  );
};

export default Checkout;