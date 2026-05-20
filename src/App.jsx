import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import Drivers from './pages/Drivers';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderComplete from './pages/OrderComplete';

function App() {

  return (

    <Router>

      <div className="min-h-screen bg-white flex flex-col">

        {/* HEADER */}
        <Navbar />

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

            <Route
              path="*"
              element={<Products />}
            />

          </Routes>

        </main>

        {/* FOOTER */}
        <Footer />

        {/* WHATSAPP */}
        <WhatsAppButton />

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

      </div>

    </Router>
  );
}

export default App;