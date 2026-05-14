import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsData } from '../data/productsData';

const ProductDetails = () => {
  const { id } = useParams();
  const product = productsData.find((item) => item.id === id);

  const [mainImage, setMainImage] = useState(product?.mainImage || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (product) {
      setMainImage(product.mainImage);
      window.scrollTo(0, 0);
    }
  }, [id, product]);

  if (!product) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      <Link to="/products" className="bg-[#0088cc] text-white px-6 py-2 rounded-lg">Back to Products</Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Top Banner Branding */}
      <div className=" text-white py-2 text-center text-xs font-bold uppercase tracking-widest">
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-semibold">
          <Link to="/" className="hover:text-black">HOME</Link> / 
          <Link to="/products" className="hover:text-black uppercase mx-1">PRODUCTS</Link> / 
          <span className="text-black uppercase">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* LEFT: Image Section */}
          <div className="space-y-6">
            <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm flex items-center justify-center h-[500px]">
              <img src={mainImage} alt={product.title} className="max-h-full object-contain transition-transform duration-500 hover:scale-110" />
            </div>
            {/* Thumbnails Grid */}
            <div className="grid grid-cols-6 gap-3">
              {product.thumbnails?.map((img, idx) => (
                <button 
                  key={idx} 
                  onMouseEnter={() => setMainImage(img)}
                  className={`border-2 p-1 rounded-lg transition-all ${mainImage === img ? 'border-[#0088cc]' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="h-16 w-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Content Section */}
          <div>
            <span className="bg-gray-100 text-[#0088cc] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {product.brand} • {product.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-3 leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="text-yellow-400 text-lg">{'★'.repeat(product.rating)}</div>
              <span className="text-sm text-gray-400 font-medium">Verified Product Hardware</span>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-[#0088cc]">₹{product.price.toLocaleString('en-IN')}.00</span>
                <span className="text-xl text-gray-300 line-through">₹{product.oldPrice.toLocaleString('en-IN')}.00</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-tighter text-green-600">Special Price Includes All Taxes</p>
            </div>

            {/* Feature List */}
            <ul className="space-y-3 mb-10">
              {product.shortDesc?.map((desc, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 text-[15px]">
                  <span className="text-blue-500 mt-1">✔</span> {desc}
                </li>
              ))}
            </ul>

            {/* CTA Actions */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-14 bg-gray-50">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-5 hover:bg-gray-200 font-bold">-</button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)} className="px-5 hover:bg-gray-200 font-bold">+</button>
              </div>
              <button className="bg-[#0088cc] hover:bg-[#006699] text-white px-12 py-4 rounded-lg font-bold uppercase tracking-widest transition-all shadow-lg flex-1">
                Add To Basket
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: TABS */}
        <div className="border-t border-gray-100 pt-10">
          <div className="flex gap-12 border-b border-gray-100 mb-10">
            {['description', 'specs'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'border-b-2 border-[#0088cc] text-[#0088cc]' : 'text-gray-400 hover:text-black'}`}
              >
                {tab === 'description' ? 'Overview' : 'Technical Specifications'}
              </button>
            ))}
          </div>

          <div className="pb-20">
            {activeTab === 'description' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="prose prose-blue">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Product Overview</h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">{product.longDescription}</p>
                  <p className="bg-blue-50 p-4 border-l-4 border-blue-400 italic text-gray-600">This hardware has been tested with popular billing software for 100% compatibility.</p>
                </div>
                {/* Responsive Video Container */}
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 aspect-video">
                  <iframe width="100%" height="100%" src={product.videoUrl} title="Product Demo" frameBorder="0" allowFullScreen></iframe>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-4xl mx-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <th className="p-4 text-left font-bold text-gray-800 border-b border-gray-200 w-1/3">{key}</th>
                        <td className="p-4 text-gray-600 border-b border-gray-200">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;