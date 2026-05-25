import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsData } from '../data/productsData';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {

  const navigate = useNavigate();

  // CART
  const { addToCart, loadingItemIds } = useCart();

  // PARAMS
  const { id } = useParams();

  // PRODUCT FIND
  const product = productsData.find(
    (item) => item.id === id
  );

  // STATES
  const [mainImage, setMainImage] = useState(
    product?.mainImage || ''
  );

  const [quantity, setQuantity] = useState(1);

  // EFFECT
  useEffect(() => {

    if (product) {

      setMainImage(product.mainImage);

      window.scrollTo(0, 0);

    }

  }, [id, product]);

  // PRODUCT NOT FOUND
  if (!product)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">

        <h2 className="text-2xl font-bold mb-4">
          Product Not Found
        </h2>

        <Link
          to="/products"
          className="bg-[#0088cc] text-white px-6 py-2 rounded-lg"
        >
          Back to Products
        </Link>

      </div>
    );

  return (

    <div className="bg-white min-h-screen">

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-semibold">

          <Link
            to="/"
            className="hover:text-black"
          >
            HOME
          </Link>

          /

          <Link
            to="/products"
            className="hover:text-black uppercase mx-1"
          >
            PRODUCTS
          </Link>

          /

          <span className="text-black uppercase">
            {product.title}
          </span>

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

          {/* LEFT */}
          <div className="space-y-6">

            {/* MAIN IMAGE */}
            <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm flex items-center justify-center h-[500px]">

              <img
                src={mainImage}
                alt={product.title}
                className="max-h-full object-contain transition-transform duration-500 hover:scale-110"
              />

            </div>

            {/* THUMBNAILS */}
            <div className="grid grid-cols-6 gap-3">

              {product.thumbnails?.map((img, idx) => (

                <button
                  key={idx}
                  onMouseEnter={() => setMainImage(img)}
                  className={`border-2 p-1 rounded-lg transition-all ${
                    mainImage === img
                      ? 'border-[#0088cc]'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >

                  <img
                    src={img}
                    alt=""
                    className="h-16 w-full object-contain"
                  />

                </button>

              ))}

            </div>

          </div>

          {/* RIGHT */}
          <div>

            {/* CATEGORY */}
            <span className="bg-gray-100 text-[#0088cc] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">

              {product.brand} • {product.category}

            </span>

            {/* TITLE */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-3 leading-tight">

              {product.title}

            </h1>

            {/* RATING */}
            <div className="flex items-center gap-4 mb-6">

              <div className="text-yellow-400 text-lg">
                {'★'.repeat(product.rating)}
              </div>

              <span className="text-sm text-gray-400 font-medium">
                Verified Product Hardware
              </span>

            </div>

            {/* PRICE */}
            <div className="mb-8">

              <div className="flex items-center gap-4">

                <span className="text-4xl font-bold text-[#0088cc]">

                  ₹{product.price.toLocaleString('en-IN')}.00

                </span>

                <span className="text-xl text-gray-300 line-through">

                  ₹{product.oldPrice.toLocaleString('en-IN')}.00

                </span>

              </div>

              <p className="text-xs text-green-600 font-bold mt-2 uppercase">
                Special Price Includes All Taxes
              </p>

            </div>

            {/* FEATURES */}
            <ul className="space-y-3 mb-10">

              {product.shortDesc?.map((desc, i) => (

                <li
                  key={i}
                  className="flex items-start gap-3 text-gray-600 text-[15px]"
                >

                  <span className="text-blue-500 mt-1">
                    ✔
                  </span>

                  {desc}

                </li>

              ))}

            </ul>

            {/* CART SECTION */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">

              {/* QUANTITY */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-14 bg-gray-50">
                {(() => {
                  const isItemLoading = loadingItemIds.includes(String(product.id));
                  return (
                    <>
                      <button
                        onClick={() =>
                          setQuantity((q) =>
                            Math.max(1, q - 1)
                          )
                        }
                        disabled={isItemLoading || quantity <= 1}
                        className="px-5 hover:bg-gray-200 font-bold transition-colors disabled:opacity-40"
                      >
                        -
                      </button>

                      <span className="w-12 text-center font-bold text-lg select-none">
                        {quantity}
                      </span>

                      <button
                        onClick={() =>
                          setQuantity((q) => q + 1)
                        }
                        disabled={isItemLoading}
                        className="px-5 hover:bg-gray-200 font-bold transition-colors disabled:opacity-40"
                      >
                        +
                      </button>
                    </>
                  );
                })()}
              </div>

              {/* ADD TO CART BUTTON */}
              {(() => {
                const isItemLoading = loadingItemIds.includes(String(product.id));
                return (
                  <button
                    onClick={async () => {
                      try {
                        await addToCart({
                          ...product,
                          image: product.mainImage,
                          quantity,
                        });
                      } catch (error) {
                        console.error("Error adding to cart:", error);
                      }
                    }}
                    disabled={isItemLoading}
                    className={`bg-[#0088cc] hover:bg-[#006699] text-white px-12 py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 shadow-xl flex-1 flex items-center justify-center gap-2.5 hover:scale-105 ${
                      isItemLoading ? 'opacity-85 cursor-wait hover:scale-100' : ''
                    }`}
                  >
                    {isItemLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding to Basket...</span>
                      </>
                    ) : (
                      <>🛒 Add To Basket</>
                    )}
                  </button>
                );
              })()}

            </div>

          </div>

        </div>

      </div>

    </div>

  );
};

export default ProductDetails;