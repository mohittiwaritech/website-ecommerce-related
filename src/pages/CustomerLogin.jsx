import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { toast } from 'react-toastify';

const CustomerLogin = () => {
  const navigate = useNavigate();
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register State
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Welcome Back!");
      navigate('/my-orders');
    } catch (error) {
      console.error("Google Auth error:", error);
      if (error.code === 'auth/popup-closed-by-user') return;
      toast.error(error.message || "Google authentication failed.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please enter email and password.");
      return;
    }
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      toast.success("Welcome Back!");
      navigate('/my-orders');
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword) {
      toast.error("Please enter email and password.");
      return;
    }
    setIsRegistering(true);
    try {
      await createUserWithEmailAndPassword(auth, registerEmail.trim(), registerPassword);
      toast.success("Account created successfully!");
      navigate('/my-orders');
    } catch (error) {
      console.error("Register error:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Email already exists. Please login instead.");
      } else {
        toast.error(error.message || "Registration failed.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans min-h-[70vh]">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-12 uppercase tracking-wide">
        MY ACCOUNT
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
        
        {/* LOGIN COLUMN */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 uppercase">LOGIN</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Username or email address *</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Password *</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer w-fit">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#006699]" />
              <span>Remember me</span>
            </label>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="bg-[#006699] hover:bg-[#004d73] text-white font-bold py-3 px-8 text-sm transition duration-200 uppercase tracking-wider disabled:opacity-50"
            >
              {isLoggingIn ? 'LOGGING IN...' : 'LOG IN'}
            </button>
          </form>

          <div className="space-y-4 pt-4">
            <a href="#" className="text-sm text-gray-600 hover:text-[#006699]">Lost your password?</a>
            
            <div>
              <p className="text-sm font-bold text-gray-800 mb-3">Use a social account for faster login or easy registration.</p>
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="flex items-center justify-center gap-3 bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold py-3 px-6 text-sm transition duration-200 rounded-sm shadow-sm"
              >
                <div className="bg-white p-1 rounded-sm">
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                </div>
                <span>Log in with Google</span>
              </button>
            </div>
          </div>
        </div>

        {/* REGISTER COLUMN */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 uppercase">REGISTER</h2>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Email address *</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Password *</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              />
            </div>

            <label className="flex items-start gap-2.5 text-sm text-gray-800 font-bold cursor-pointer w-fit mt-2">
              <input 
                type="checkbox" 
                checked={subscribeNewsletter}
                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 accent-[#006699]" 
              />
              <span>Subscribe to our newsletter</span>
            </label>

            <p className="text-[13px] text-gray-600 leading-relaxed pt-2">
              Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <a href="/privacy" className="text-gray-900 font-bold hover:underline">privacy policy</a>.
            </p>

            <button
              type="submit"
              disabled={isRegistering}
              className="bg-[#006699] hover:bg-[#004d73] text-white font-bold py-3 px-8 text-sm transition duration-200 uppercase tracking-wider disabled:opacity-50"
            >
              {isRegistering ? 'REGISTERING...' : 'REGISTER'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CustomerLogin;
