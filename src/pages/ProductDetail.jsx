import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getProducts, getProductReviews, addReview } from '../services/dbService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductUrl } from '../utils/slugify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SEO from '../components/SEO';

const ProductDetails = () => {
  const navigate = useNavigate();

  // AUTH
  const { currentUser } = useAuth();

  // CART
  const { addToCart, loadingItemIds } = useCart();

  // PARAMS
  const { id } = useParams();
  const productId = id ? id.split('-')[0] : '';

  // STATES
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);

  // REVIEWS STATE
  const [reviews, setReviews] = useState([]);

  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    if (currentUser) {
      setReviewerName(currentUser.displayName || '');
      setReviewerEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // RESET ON PRODUCT ID CHANGE
  useEffect(() => {
    setActiveTab('description');
    setQuantity(1);
  }, [id]);

  // EFFECT FOR FETCHING PRODUCT & RELATED
  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        if (data) {
          setProduct(data);
          setMainImage(data.mainImage || '');

          // Fetch reviews from Firestore
          let dbReviews = [];
          try {
            dbReviews = await getProductReviews(productId);
          } catch (err) {
            console.error("Error loading reviews from database:", err);
          }

          const defaultDummyReviews = [
            {
              name: "Rohan Sharma",
              rating: 5,
              date: "May 12, 2026",
              comment: "Excellent build quality and very fast printing speeds. Highly recommended for retail shops."
            },
            {
              name: "Anita Verma",
              rating: 4,
              date: "June 2, 2026",
              comment: "Setup was simple on Android and Windows. Works flawlessly over Bluetooth."
            }
          ];

          const formattedDbReviews = dbReviews.map(r => ({
            name: r.reviewerName || r.name,
            rating: Number(r.rating) || 5,
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }) : new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }),
            comment: r.comment
          }));

          setReviews([...formattedDbReviews, ...defaultDummyReviews]);

          // Fetch related products
          const allProds = await getProducts();
          let related = allProds.filter(
            (p) => p.category === data.category && String(p.id) !== String(data.id)
          );
          if (related.length < 4) {
            const extra = allProds.filter(
              (p) => p.category !== data.category && String(p.id) !== String(data.id)
            );
            related = [...related, ...extra].slice(0, 4);
          } else {
            related = related.slice(0, 4);
          }
          setRelatedProducts(related);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error loading product detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRelated();
    window.scrollTo(0, 0);
  }, [id, productId]);

  // SUBMIT REVIEW HANDLER
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        productId: String(productId),
        reviewerName,
        reviewerEmail,
        rating: Number(newRating),
        comment: reviewComment,
      };

      // Save to Firestore
      await addReview(reviewData);

      // Local state update
      const newReview = {
        name: reviewerName,
        rating: newRating,
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        comment: reviewComment,
      };
      setReviews([newReview, ...reviews]);
      setReviewerName('');
      setReviewerEmail('');
      setReviewComment('');
      setNewRating(5);
      toast.success("Review submitted successfully and saved to database! Thank you.");
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to save review to database.");
    }
  };

  // LOADING STATE (SKELETON LOADER)
  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 bg-gray-100 w-1/3 rounded mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Left Image Skeleton */}
            <div className="space-y-6">
              <div className="h-[500px] bg-gray-100 rounded-2xl w-full"></div>
              <div className="grid grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>

            {/* Right Details Skeleton */}
            <div className="space-y-6 pt-4">
              <div className="h-6 bg-gray-100 w-1/4 rounded-full"></div>
              <div className="h-12 bg-gray-100 w-3/4 rounded mt-4"></div>
              <div className="h-6 bg-gray-100 w-1/3 rounded"></div>
              <div className="h-12 bg-gray-100 w-1/2 rounded mb-8"></div>
              
              <div className="space-y-4 pt-6">
                <div className="h-4 bg-gray-100 w-full rounded"></div>
                <div className="h-4 bg-gray-100 w-5/6 rounded"></div>
                <div className="h-4 bg-gray-100 w-4/5 rounded"></div>
              </div>
              
              <div className="flex gap-4 pt-10">
                <div className="h-14 bg-gray-100 w-32 rounded-lg"></div>
                <div className="h-14 bg-gray-100 flex-1 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PRODUCT NOT FOUND
  if (!product)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
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
      <SEO 
        title={product.title} 
        description={product.shortDesc ? product.shortDesc.join(', ') : 'Buy this high-quality product from BillingZone.'} 
        image={mainImage}
        type="product"
      />
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-semibold">
          <Link to="/" className="hover:text-black">
            HOME
          </Link>
          /
          <Link to="/products" className="hover:text-black uppercase mx-1">
            PRODUCTS
          </Link>
          /
          <span className="text-black uppercase">
            {product.title}
          </span>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
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
                          setQuantity((q) => Math.max(1, q - 1))
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

        {/* TABS CONTAINER */}
        <div className="mt-16 border-b border-gray-200">
          <div className="flex gap-8 justify-start">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === 'description'
                  ? 'border-[#0088cc] text-[#0088cc]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              className={`pb-4 text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === 'additional'
                  ? 'border-[#0088cc] text-[#0088cc]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Additional Information
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-[#0088cc] text-[#0088cc]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="py-10">
          {activeTab === 'description' && (
            <div className="space-y-8 animate-fadeIn">
              {product.videoUrl && (
                <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-100 aspect-video mb-8">
                  <iframe
                    width="100%"
                    height="100%"
                    src={product.videoUrl}
                    title={`${product.title} Video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  {product.longDescription || "No detailed description available for this product yet."}
                </p>
              </div>

              {product.shortDesc && product.shortDesc.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-3">Key Features</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    {product.shortDesc.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'additional' && (
            <div className="animate-fadeIn max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Technical Specifications</h3>
              <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full border-collapse text-left">
                  <tbody>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="px-6 py-4 font-bold text-gray-700 w-1/3 text-sm">Brand</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{product.brand || 'ATPOS'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-6 py-4 font-bold text-gray-700 w-1/3 text-sm">SKU</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{product.sku || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="px-6 py-4 font-bold text-gray-700 w-1/3 text-sm">Category</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{product.category}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-6 py-4 font-bold text-gray-700 w-1/3 text-sm">Warranty</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{product.warranty || '1 Year Warranty'}</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="px-6 py-4 font-bold text-gray-700 w-1/3 text-sm">Stock Status</td>
                      <td className={`px-6 py-4 text-sm font-bold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </td>
                    </tr>
                    {product.specs && Object.entries(product.specs).map(([key, value], idx) => (
                      <tr 
                        key={key} 
                        className={`border-b border-gray-100 ${idx % 2 === 0 ? '' : 'bg-gray-50/50'}`}
                      >
                        <td className="px-6 py-4 font-bold text-gray-700 w-1/3 text-sm uppercase">{key}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-fadeIn max-w-4xl mx-auto space-y-10">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Customer Reviews</h3>
                {reviews.length === 0 ? (
                  <div className="bg-gray-50 p-6 rounded-xl text-center text-gray-500">
                    There are no reviews yet. Be the first to write a review!
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((rev, idx) => (
                      <div key={idx} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-gray-800 text-sm">{rev.name}</span>
                          <span className="text-yellow-400 text-xs">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                          <span className="text-gray-400 text-xs">{rev.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* REVIEW SUBMIT FORM */}
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100 space-y-4">
                <h4 className="text-lg font-bold text-gray-800">Add a Review</h4>
                <p className="text-xs text-gray-400">Your email address will not be published. Required fields are marked *</p>
                
                {/* Rating selection */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-600">Your rating * :</span>
                  <div className="flex gap-1 text-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`transition-colors cursor-pointer ${
                          star <= newRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Name *</label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      readOnly={!!currentUser}
                      placeholder="Your name"
                      className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0088cc] ${currentUser ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Email *</label>
                    <input
                      type="email"
                      required
                      value={reviewerEmail}
                      onChange={(e) => setReviewerEmail(e.target.value)}
                      readOnly={!!currentUser}
                      placeholder="Your email address"
                      className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0088cc] ${currentUser ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Your Review *</label>
                  <textarea
                    required
                    rows="4"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write your detailed product feedback here..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0088cc] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-[#0088cc] hover:bg-[#006699] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors shadow-md cursor-pointer hover:scale-[1.02] duration-200"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 pt-12 border-t border-gray-150">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide uppercase">Related Products</h2>
              <div className="h-px bg-gray-200 flex-grow mx-6"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <div 
                  key={p.id}
                  className="flex flex-col h-full bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <Link to={getProductUrl(p)}>
                    <div className="relative bg-white p-4 overflow-hidden">
                      <img
                        src={p.mainImage || p.image}
                        alt={p.title}
                        className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300?text=Printer";
                        }}
                      />
                    </div>
                  </Link>

                  <div className="flex flex-col flex-grow p-4">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      {p.brand} • {p.category}
                    </span>

                    <Link to={getProductUrl(p)}>
                      <h3 className="text-xs font-semibold text-gray-800 leading-relaxed hover:text-[#0088cc] transition-colors min-h-[48px] line-clamp-2">
                        {p.title}
                      </h3>
                    </Link>

                    <div className="flex text-yellow-400 text-[10px] my-2">
                      {'★'.repeat(p.rating || 5)}
                      {'☆'.repeat(5 - (p.rating || 5))}
                    </div>

                    <div className="mt-2 mb-4 flex items-baseline gap-2">
                      <span className="text-[#0088cc] font-bold text-sm">
                        ₹{p.price.toLocaleString('en-IN')}.00
                      </span>
                      {p.oldPrice && (
                        <span className="text-gray-400 line-through text-[11px]">
                          ₹{p.oldPrice.toLocaleString('en-IN')}.00
                        </span>
                      )}
                    </div>

                    {/* Quick Add To Basket */}
                    {(() => {
                      const isItemLoading = loadingItemIds.includes(String(p.id));
                      return (
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            try {
                              await addToCart({
                                ...p,
                                image: p.mainImage,
                                quantity: 1,
                              });
                            } catch (error) {
                              console.error("Error adding related to cart:", error);
                            }
                          }}
                          disabled={isItemLoading}
                          className={`mt-auto w-full bg-[#0088cc] hover:bg-[#006699] text-white font-bold py-2.5 px-4 rounded-lg text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                            isItemLoading ? 'opacity-80 cursor-wait' : ''
                          }`}
                        >
                          {isItemLoading ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Adding...</span>
                            </>
                          ) : (
                            "Add To Basket"
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;