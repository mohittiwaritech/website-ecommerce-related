import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/dbService';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CheckCircle } from 'lucide-react';

const FeaturedProducts = () => {
  const { addToCart, loadingItemIds } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const allProducts = await getProducts();
        const featured = allProducts
          .filter(p => p.featured === true)
          .map(p => ({
            id: p.id,
            tag: p.category.toUpperCase(),
            name: p.title,
            oldPrice: p.oldPrice ? `₹${p.oldPrice.toLocaleString('en-IN')}.00` : '',
            price: p.price,
            displayPrice: `₹${p.price.toLocaleString('en-IN')}.00`,
            image: p.mainImage,
            buttonText: 'ADD TO BASKET',
            link: `/product/${p.id}`
          }));
        setProducts(featured);
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  // ADD TO CART WITH ASYNC
  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      // Drawer slides out automatically on success to provide modern visual confirmation.
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (

    <section className="max-w-7xl mx-auto px-4 py-12">

      {/* HEADING */}
      <div className="flex items-center justify-center mb-12">

        <div className="flex-grow h-px bg-gray-200"></div>

        <h2 className="px-6 text-xl md:text-2xl font-bold text-gray-800 tracking-wide uppercase">
          Featured Products
        </h2>

        <div className="flex-grow h-px bg-gray-200"></div>

      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col h-full bg-white border border-gray-100 rounded-xl overflow-hidden animate-pulse min-h-[400px]"
            >
              <div className="bg-gray-100 h-64 w-full"></div>
              <div className="p-4 space-y-3 flex-grow flex flex-col">
                <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mt-auto"></div>
                <div className="h-10 w-full bg-gray-200 rounded mt-4"></div>
              </div>
            </div>
          ))
        ) : (
          products.map((product) => (

            <div
              key={product.id}
              className="flex flex-col h-full bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >

              {/* IMAGE */}
              <Link to={product.link}>

                <div className="relative bg-white p-4 overflow-hidden">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300?text=Printer";
                    }}
                  />

                </div>

              </Link>

              {/* DETAILS */}
              <div className="flex flex-col flex-grow p-4">

                {/* TAG */}
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  {product.tag}
                </span>

                {/* PRODUCT NAME */}
                <Link to={product.link}>

                  <h3 className="text-sm font-semibold text-gray-800 leading-6 hover:text-[#0073B7] transition-colors min-h-[72px]">
                    {product.name}
                  </h3>

                </Link>

                {/* PRICE */}
                <div className="mt-4 mb-5">

                  <span className="text-gray-400 line-through text-sm mr-2">
                    {product.oldPrice}
                  </span>

                  <span className="text-[#0073B7] font-bold text-lg">
                    {product.displayPrice}
                  </span>

                </div>

                {/* ADD TO CART BUTTON */}
                {(() => {
                  const isItemLoading = loadingItemIds.includes(String(product.id));
                  return (
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isItemLoading}
                      className={`mt-auto w-full bg-[#0073B7] hover:bg-[#005f91] text-white font-bold py-3 px-4 rounded-md text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 min-h-[42px] ${
                        isItemLoading ? 'opacity-85 cursor-wait' : ''
                      }`}
                    >
                      {isItemLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Adding...</span>
                        </>
                      ) : (
                        product.buttonText
                      )}
                    </button>
                  );
                })()}

              </div>

            </div>

          ))
        )}

      </div>

    </section>
  );
};

export default FeaturedProducts;