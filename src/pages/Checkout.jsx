import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const TextField = ({ label, name, value, onChange, onBlur, error, type = "text" }) => (
  <div>
    <label className="block mb-1 text-sm font-medium">{label} *</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`w-full border p-2 text-sm rounded-lg focus:outline-none focus:border-[#006699] transition-all ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1 animate-pulse">{error}</p>}
  </div>
);

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

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

  // SUBMISSION STATE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Online Payment');

  const saveOrderToFirebase = async (paymentId, orderId, signature) => {
    try {
      const orderData = {
        customerDetails: formData,
        items: cart.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image || ''
        })),
        subtotal,
        gst,
        total: subtotal + gst,
        paymentMethod,
        paymentDetails: paymentId ? {
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
        } : null,
        createdAt: new Date().toISOString(),
        status: paymentId ? 'Paid' : 'Pending'
      };

      await addDoc(collection(db, "orders"), orderData);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-complete');
    } catch (error) {
      console.error("Error saving order: ", error);
      toast.error('Failed to save order details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      toast.error('Please fill all required details');
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === 'Online Payment') {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
          toast.error('Razorpay SDK failed to load. Are you online?');
          setIsSubmitting(false);
          return;
        }

        // Localhost URL for testing
        // const orderRes = await fetch('http://localhost:5000/api/create-razorpay-order', {
        const orderRes = await fetch('https://website-ecommerce-related.onrender.com/api/create-razorpay-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: Math.round(subtotal + gst) })
        });

        if (!orderRes.ok) {
          throw new Error('Failed to create order on backend');
        }

        const orderDataBackend = await orderRes.json();

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
          amount: orderDataBackend.amount,
          currency: orderDataBackend.currency,
          name: "My E-commerce",
          description: "Order Payment",
          order_id: orderDataBackend.id,
          handler: async function (response) {
            try {
              // Localhost URL for testing
              // const verifyRes = await fetch('http://localhost:5000/api/verify-payment', {
              const verifyRes = await fetch('https://website-ecommerce-related.onrender.com/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                await saveOrderToFirebase(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
              } else {
                toast.error('Payment verification failed.');
                setIsSubmitting(false);
              }
            } catch (err) {
              console.error("Verification error", err);
              toast.error('Payment verification error.');
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#006699",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response){
          toast.error('Payment failed. Please try again.');
          setIsSubmitting(false);
        });
        paymentObject.open();

      } else {
        await saveOrderToFirebase(null, null, null);
      }
    } catch (error) {
      console.error("Error saving order: ", error);
      toast.error('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const validateField = (name, value) => {
    let errorMsg = '';
    if (!value) {
      const fieldNames = {
        firstName: 'First Name',
        lastName: 'Last Name',
        address: 'Address',
        city: 'City',
        state: 'State',
        zip: 'ZIP Code',
        phone: 'Phone Number',
        email: 'Email Address'
      };
      errorMsg = `${fieldNames[name] || name} is required`;
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
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
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstName}
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.lastName}
              />
            </div>

            <TextField
              label="Street Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.address}
            />

            <TextField
              label="Town / City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.city}
            />

            {/* STATE */}
            <div>
              <label className="block mb-1 text-sm font-medium">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border p-2 text-sm rounded-lg focus:outline-none focus:border-[#006699] transition-all ${
                  errors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select State</option>
                <option>Uttar Pradesh</option>
                <option>Delhi</option>
                <option>Haryana</option>
                <option>Maharashtra</option>
                <option>Telangana</option>
              </select>
              {errors.state && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.state}</p>}
            </div>

            <TextField
              label="ZIP Code"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.zip}
            />

            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
            />

            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
            />


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
                value="Online Payment"
                checked={paymentMethod === 'Online Payment'}
                onChange={(e) => setPaymentMethod(e.target.value)}
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
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
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
            onClick={handlePayment}
            disabled={isSubmitting}
            className={`w-full text-white py-3 font-bold text-sm tracking-wider rounded-lg transition-all ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#006699] hover:bg-[#004d73]'
            }`}
          >
            {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Checkout;