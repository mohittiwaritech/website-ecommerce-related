import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CheckCircle } from 'lucide-react';

const FeaturedProducts = () => {
  const { addToCart, loadingItemIds } = useCart();

  const products = [
    {
      id: 1,
      tag: '3 INCH 80MM LABEL PRINTER',
      name: 'Atpos MD80 80mm 3-Inch Mobile Label Receipt Printer (Dual Mode) | USB+BT',
      oldPrice: '₹4,950.00',
      price: 4899.00,
      displayPrice: '₹4,899.00',
      image: '/assets/md80.webp',
      buttonText: 'ADD TO BASKET',
      link: '/product/9'
    },

    {
      id: 2,
      tag: '80MM 3 INCH- MOBILE PRINTER',
      name: 'Atpos M80 80mm Portable Bluetooth Thermal Printer | Wireless Printing | 3 Inch',
      oldPrice: '₹4,400.00',
      price: 3869.00,
      displayPrice: '₹3,869.00',
      image: '/assets/m80.jpg',
      buttonText: 'ADD TO BASKET',
      link: '/product/11'
    },

    {
      id: 3,
      tag: '4 INCH 108MM LABEL PRINTER',
      name: 'Atpos HQ450L 4 Inch (108mm) Thermal Barcode Shipping Label Sticker Printer | USB+Bluetooth Interface',
      oldPrice: '₹8,990.00',
      price: 7290.00,
      displayPrice: '₹7,290.00',
      image: '/assets/450.webp',
      buttonText: 'ADD TO BASKET',
      link: '/product/4'
    },

    {
      id: 4,
      tag: '80MM 3 INCH RECEIPT PRINTER',
      name: 'Atpos AT-402 80mm 3 Inch Thermal Receipt Printer (Bluetooth + USB ) | Auto Cutter',
      oldPrice: '₹6,500.00',
      price: 5199.00,
      displayPrice: '₹5,199.00',
      image: '/assets/receipt printer 402.jpg',
      buttonText: 'ADD TO BASKET',
      link: '/product/8'
    }
  ];

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

        {products.map((product) => (

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

        ))}

      </div>

    </section>
  );
};

export default FeaturedProducts;