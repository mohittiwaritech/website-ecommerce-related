import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const TextField = ({ label, name, value, onChange, onBlur, error, type = "text", placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const inputType = isPasswordType ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">{label} *</label>
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full border px-4 py-3.5 text-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#006699] bg-gray-50/50 hover:bg-gray-50/20 focus:bg-white transition-all duration-200 pr-12 ${error ? 'border-red-500 bg-red-50/30 focus:ring-red-50' : 'border-gray-200'
            }`}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#006699] focus:outline-none"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
};

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

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

const Checkout = () => {

  // PRE-WAKEUP RENDER SERVER (Hack for free tier)
  useEffect(() => {
    // Ping backend to wake it up while user is filling the form
    fetch('https://website-ecommerce-related-tql6.onrender.com/api/ping').catch(() => { });
  }, []);

  // NAVIGATE
  const navigate = useNavigate();

  // AUTH
  const { currentUser } = useAuth();

  // CART
  const {
    cart,
    clearCart
  } = useCart();

  // TOTAL & TAX-INCLUSIVE CALCULATIONS
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const gst = totalAmount * 18 / 118;
  const subtotal = totalAmount - gst; // exclusive portion

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

  // ACCOUNT CREATION
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');

  const saveOrderToFirebase = async (paymentId, orderId, signature, userId = null) => {
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
        status: paymentId ? 'Paid' : 'Pending',
        userId: userId
      };

      await addDoc(collection(db, "orders"), orderData);
      await clearCart();
      toast.success('Order placed successfully!');

      // Send confirmation email
      try {
        const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://website-ecommerce-related-tql6.onrender.com';
        await fetch(`${API_BASE_URL}/api/send-order-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            items: cart.map(item => ({
              title: item.title || item.name,
              price: item.price,
              quantity: item.quantity
            })),
            customerDetails: formData,
            orderDetails: {
              subtotal,
              gst,
              total: subtotal + gst,
              paymentMethod,
            }
          })
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      navigate('/order-complete', { state: { orderData } });
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
    if (!currentUser && createAccount) {
      if (!password) {
        toast.error('Please enter a password for your new account');
        return;
      }
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
    }

    setIsSubmitting(true);

    const handleAccountAndSave = async (payId, ordId, sign) => {
      let finalUserId = currentUser?.uid || null;
      if (!finalUserId && createAccount && password) {
        try {
          const userCred = await createUserWithEmailAndPassword(auth, formData.email, password);
          finalUserId = userCred.user.uid;
        } catch (err) {
          console.error("Failed to create account", err);
          toast.info("Order placed, but account creation failed (Email may already exist).");
        }
      }
      await saveOrderToFirebase(payId, ordId, sign, finalUserId);
    };

    try {
      if (paymentMethod === 'Online Payment') {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
          toast.error('Razorpay SDK failed to load. Are you online?');
          setIsSubmitting(false);
          return;
        }

        // Dynamically choose backend URL based on environment
        const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://website-ecommerce-related-tql6.onrender.com';

        const orderRes = await fetch(`${API_BASE_URL}/api/create-razorpay-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems: cart.map(item => ({ id: item.id, quantity: item.quantity }))
          })
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
              // Dynamically choose backend URL based on environment
              const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://website-ecommerce-related-tql6.onrender.com';

              const verifyRes = await fetch(`${API_BASE_URL}/api/verify-payment`, {
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
                await handleAccountAndSave(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
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
        paymentObject.on('payment.failed', function () {
          toast.error('Payment failed. Please try again.');
          setIsSubmitting(false);
        });
        paymentObject.open();

      } else {
        await handleAccountAndSave(null, null, null);
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
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans">
      {/* TOP STEPS */}
      <div className="text-center text-xs md:text-sm text-gray-300 font-bold mb-12 uppercase tracking-widest">
        Shopping Cart
        <span className="mx-3 text-gray-300">›</span>
        <span className="text-black font-extrabold border-b-2 border-black pb-1">Checkout Details</span>
        <span className="mx-3 text-gray-300">›</span>
        Order Complete
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* LEFT SIDE (Billing Form) */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-4 text-left">
            BILLING DETAILS
          </h2>

          <div className="space-y-5">
            {/* FIRST + LAST NAME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstName}
                placeholder="John"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.lastName}
                placeholder="Doe"
              />
            </div>

            <TextField
              label="Street Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.address}
              placeholder="House number and street name"
            />

            <TextField
              label="Town / City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.city}
              placeholder="City name"
            />

            {/* STATE */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">State *</label>
              <div className="relative">
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border px-4 py-3.5 text-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#006699] bg-gray-50/50 hover:bg-gray-50/20 focus:bg-white transition-all duration-200 appearance-none ${errors.state ? 'border-red-500 bg-red-50/30 focus:ring-red-50' : 'border-gray-200'
                    }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              {errors.state && <p className="text-red-500 text-xs mt-1 font-medium">{errors.state}</p>}
            </div>

            <TextField
              label="ZIP Code"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.zip}
              placeholder="6-digit PIN code"
            />

            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              placeholder="10-digit mobile number"
            />

            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              placeholder="email@example.com"
            />

            {/* CREATE ACCOUNT TOGGLE */}
            {!currentUser && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <label className="flex items-start gap-2.5 text-sm text-gray-700 font-bold cursor-pointer select-none text-left">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#006699] border-gray-300 rounded focus:ring-[#006699]/20"
                  />
                  <span>Create an account & Subscribe to our newsletter?</span>
                </label>

                {createAccount && (
                  <TextField
                    label="Account Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE (Order Summary & Payments) */}
        <div className="bg-[#fcfdfd] border border-gray-100 rounded-2xl p-6 shadow-sm h-fit sticky top-24 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3.5 text-left">
            YOUR ORDER
          </h2>

          {/* PRODUCTS LIST */}
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 divide-y divide-gray-100">
            {cart.map((item, index) => (
              <div
                key={item.id}
                className={`flex justify-between gap-4 text-sm ${index > 0 ? 'pt-4' : ''}`}
              >
                <div className="flex gap-3">
                  <img
                    src={item.image || item.hoverImage}
                    alt={item.title || item.name}
                    className="w-14 h-14 object-contain border rounded-xl bg-white p-1"
                  />
                  <div className="text-left">
                    <p className="font-bold text-gray-800 leading-snug line-clamp-2">
                      {item.title || item.name}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 font-medium">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-bold text-gray-900 whitespace-nowrap">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}.00
                </div>
              </div>
            ))}
          </div>

          {/* TOTALS */}
          <div className="space-y-3 py-5 border-t border-b border-gray-100 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal (Excl. Tax)</span>
              <span className="font-semibold text-gray-900">
                ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (18%)</span>
              <span className="font-semibold text-gray-900">
                ₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-green-600">
                Free Shipping
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
              <span>Total (Incl. Tax)</span>
              <div className="text-right">
                <span className="text-lg text-[#006699]">
                  ₹{(subtotal + gst).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 text-left">Payment Method</h3>

            <label className={`flex items-start gap-3.5 border rounded-xl p-4 cursor-pointer transition-all duration-200 text-left ${paymentMethod === 'Online Payment'
              ? 'border-[#006699] bg-[#006699]/5 shadow-sm'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/40'
              }`}>
              <input
                type="radio"
                name="payment"
                value="Online Payment"
                checked={paymentMethod === 'Online Payment'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 w-4 h-4 accent-[#006699]"
              />
              <div className="select-none">
                <p className="font-bold text-sm text-gray-800">Online Payment</p>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal">UPI / Debit Card / Credit Card (Instant & Secure)</p>
              </div>
            </label>

            {/* 
            <label className={`flex items-start gap-3.5 border rounded-xl p-4 cursor-pointer transition-all duration-200 text-left ${
              paymentMethod === 'Cash on Delivery'
                ? 'border-[#006699] bg-[#006699]/5 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/40'
              }`}>
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 w-4 h-4 accent-[#006699]"
              />
              <div className="select-none">
                <p className="font-bold text-sm text-gray-800">Cash on Delivery</p>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal">Pay with cash when order is delivered</p>
              </div>
            </label>
            */}
          </div>

          {/* TERMS & PLACE ORDER */}
          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-2.5 text-xs text-gray-500 leading-normal cursor-pointer select-none text-left">
              <input
                type="checkbox"
                required
                className="mt-0.5 w-4 h-4 accent-[#006699] border-gray-300 rounded focus:ring-[#006699]/20"
              />
              <span>I have read and agree to the website terms and conditions *</span>
            </label>

            <button
              onClick={handlePayment}
              disabled={isSubmitting}
              className={`w-full text-white py-3.5 font-bold text-sm tracking-wider rounded-xl transition-all duration-300 active:scale-[0.98] ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#006699] hover:bg-[#004d73] hover:shadow-lg hover:shadow-blue-900/10'
                }`}
            >
              {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;