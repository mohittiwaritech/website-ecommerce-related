import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Main Header */}
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* 1. Home Page */}
            <Route path="/" element={<Home />} />
            
            {/* 2. Products Page */}
            <Route path="/products" element={<Products />} />

            {/* 3. Product Detail Page (Dynamic Route) */}
            <Route path="/product/:id" element={<ProductDetail />} /> 
            
            {/* 4. Contact Page */}
            <Route path="/contact" element={<Contact />} />
            
            {/* 5. Support Page */}
            <Route path="/support" element={<Support />} />

            {/* 6. Drivers Page */}
            <Route path="/drivers" element={<Drivers />} />
            
            {/* 7. 404 Redirect - Agar koi galat URL dale toh Home ya Products par bhej do */}
            <Route path="*" element={<Products />} />
          </Routes>
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;