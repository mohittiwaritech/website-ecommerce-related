// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsData } from '../data/productsData'; // <-- Data file ko import kiya

export default function ProductDetail() {
  const { id } = useParams(); 
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // URL wali ID ke hisaab se data dhoondhna
  const product = productsData.find((item) => item.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Agar user ne aisi ID daali jo data file mein nahi hai
  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">Product Not Found!</h2>
        <p className="mt-2 text-gray-600">Lagta hai aapne yeh data productsData.js me add nahi kiya hai.</p>
        <Link to="/products" className="text-blue-600 mt-4 inline-block underline">Wapas Products par jayein</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      
      {/* BREADCRUMB */}
      <div className="text-sm text-gray-500 mb-8 border-b pb-4">
        <Link to="/" className="hover:text-black">Home</Link> / 
        <Link to="/products" className="hover:text-black"> Products</Link> / 
        <span className="text-gray-800 uppercase mx-1">{product.category}</span> /
        <span className="text-black font-bold ml-1">{product.title}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-10 mb-16">
        
        {/* LEFT SIDE: Photos */}
        <div className="w-full md:w-1/2">
          {/* Main Photo */}
          <div className="border border-gray-200 p-8 text-center bg-white shadow-sm hover:shadow-md transition mb-4">
            <img src={product.mainImage} alt={product.title} className="w-full h-auto object-contain max-h-[400px]" />
          </div>
          {/* Chhoti Photos (Thumbnails) */}
          <div className="flex gap-4">
            {product.thumbnails && product.thumbnails.map((thumb, index) => (
              <div key={index} className="border border-gray-200 p-2 cursor-pointer hover:border-[#0088cc] transition-colors">
                <img src={thumb} alt={`Thumb ${index}`} className="w-16 h-16 object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-snug">
            {product.title}
          </h1>
          
          <div className="flex text-yellow-400 text-sm mb-4">
            {'★'.repeat(product.rating || 5)}{'☆'.repeat(5 - (product.rating || 5))} 
            <span className="text-gray-500 text-xs ml-2">(Customer Reviews)</span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">
              {product.priceRange ? product.priceRange : `₹${product.price.toLocaleString('en-IN')}.00`}
            </span>
            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Options (USB, Bluetooth etc) */}
          {product.options && (
            <div className="mb-6">
              <span className="block text-sm font-bold text-gray-800 mb-2">Options:</span>
              <div className="flex gap-3">
                {product.options.map((opt, idx) => (
                  <button key={idx} className="border border-gray-300 px-4 py-2 text-sm hover:border-black focus:border-black focus:ring-1 focus:ring-black">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ul className="list-disc pl-5 mb-8 text-sm text-gray-700 space-y-2">
            {product.shortDesc && product.shortDesc.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>

          <div className="flex items-center gap-4 py-6 border-t border-b border-gray-200 mb-6">
            <div className="flex items-center border border-gray-300 h-12">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-gray-600 hover:bg-gray-100 h-full font-bold">-</button>
              <input type="text" value={quantity} readOnly className="w-12 text-center h-full outline-none font-bold" />
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-gray-600 hover:bg-gray-100 h-full font-bold">+</button>
            </div>
            
            <button className="bg-[#0088cc] hover:bg-[#006699] text-white font-bold px-8 h-12 transition-colors">
              ADD TO BASKET
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM TABS: Description & Specs */}
      <div className="mt-12">
        <div className="flex gap-8 border-b border-gray-200 mb-6">
          <button 
            className={`pb-2 text-lg font-bold ${activeTab === 'description' ? 'border-b-2 border-[#0088cc] text-[#0088cc]' : 'text-gray-500 hover:text-black'}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`pb-2 text-lg font-bold ${activeTab === 'specs' ? 'border-b-2 border-[#0088cc] text-[#0088cc]' : 'text-gray-500 hover:text-black'}`}
            onClick={() => setActiveTab('specs')}
          >
            Technical Specifications
          </button>
        </div>

        <div className="py-4 text-gray-700">
          {activeTab === 'description' && (
            <div>
              <p className="leading-relaxed mb-8">{product.longDescription}</p>
              
              {/* YouTube Video Section */}
              {product.videoUrl && (
                <div className="w-full max-w-3xl mx-auto h-64 sm:h-96 bg-gray-100 relative mt-8">
                  <iframe 
                    className="w-full h-full"
                    src={product.videoUrl} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && product.specs && (
            <table className="w-full text-left border text-sm max-w-3xl">
              <tbody>
                {Object.entries(product.specs).map(([key, value], index) => (
                  <tr key={index} className="border-b">
                    <th className="p-3 bg-gray-50 w-1/3 border-r font-semibold">{key}</th>
                    <td className="p-3">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}