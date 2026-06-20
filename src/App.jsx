import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Support from './pages/Support';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderComplete from './pages/OrderComplete';

// Legal Pages
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Refund from './pages/legal/Refund';
import Shipping from './pages/legal/Shipping';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER - HIDE ON ADMIN */}
      {!isAdminPath && <Navbar />}

      {/* MAIN */}
      <main className="flex-grow">
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
            path="/support"
            element={<Support />}
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