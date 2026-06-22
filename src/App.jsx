import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Lazy load Pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Contact = lazy(() => import('./pages/Contact'));
const Drivers = lazy(() => import('./pages/Drivers'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderComplete = lazy(() => import('./pages/OrderComplete'));

// Lazy load Legal Pages
const Terms = lazy(() => import('./pages/legal/Terms'));
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const Refund = lazy(() => import('./pages/legal/Refund'));
const Shipping = lazy(() => import('./pages/legal/Shipping'));

// Lazy load Admin Pages
const Login = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER - HIDE ON ADMIN */}
      {!isAdminPath && <Navbar />}

      {/* MAIN */}
      <main className="flex-grow">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetail />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/drivers"
            element={<Drivers />}
          />

          <Route
           path="/order-complete"
           element={<OrderComplete />}
         />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
         />

          {/* LEGAL PATHS */}
          <Route
            path="/terms"
            element={<Terms />}
          />
          <Route
            path="/privacy"
            element={<Privacy />}
          />
          <Route
            path="/refund"
            element={<Refund />}
          />
          <Route
            path="/shipping"
            element={<Shipping />}
          />

          {/* ADMIN PATHS */}
          <Route
            path="/admin/login"
            element={<Login />}
          />
          <Route
            path="/admin"
            element={<AdminLayout />}
          />
          <Route
            path="/admin/dashboard"
            element={<AdminLayout />}
          />

          <Route
            path="*"
            element={<Products />}
          />
          </Routes>
        </Suspense>
      </main>

      {/* FOOTER - HIDE ON ADMIN */}
      {!isAdminPath && <Footer />}

      {/* WHATSAPP - HIDE ON ADMIN */}
      {!isAdminPath && <WhatsAppButton />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      {/* TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </Router>
  );
}

export default App;