"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from 'react';

import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProducts, getCategories } from '@/services/dbService';
import { getProductUrl } from '@/utils/slugify';



function Products() {
  const searchParams = useSearchParams();

  const [allProducts, setAllProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedInterface, setSelectedInterface] = useState('');
  const [maxPrice, setMaxPrice] = useState(50000);
  const { addToCart, loadingItemIds } = useCart();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rawProducts, rawCategories] = await Promise.all([
          getProducts(),
          getCategories()
        ]);

        const mapped = rawProducts.map(p => ({
          id: p.id,
          category: p.category,
          interface: p.specs?.Connectivity || p.specs?.Interface || 'None',
          tag: p.category.toUpperCase(),
          title: p.title,
          rating: p.rating,
          price: p.price,
          oldPrice: p.oldPrice,
          image: p.mainImage,
          hoverImage: p.thumbnails && p.thumbnails.length > 1 ? p.thumbnails[1] : p.mainImage,
          inStock: p.inStock,
          btnType: 'ADD TO BASKET',
        }));

        setAllProducts(mapped);
        setProducts(mapped);
        setCategoriesList(rawCategories.map(c => c.name));
      } catch (error) {
        console.error("Error loading products/categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showSuccessToast = () => {
    toast.success(
      <div className="flex items-center gap-3">
        <div className="text-3xl text-white">✓</div>
        <div>
          <h4 className="font-bold text-sm uppercase">PRODUCT ADDED</h4>
          <p className="text-xs">Item successfully added to cart</p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        style: {
          background: '#16a34a',
          color: '#fff',
          borderRadius: '10px',
          padding: '12px',
          minHeight: '70px',
        }
      }
    );
  };

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // CATEGORY URL FILTER
  useEffect(() => {
    
    const categoryFromUrl = searchParams.get('category');
    const typeFromUrl = searchParams.get('type');
    
    setSelectedCategory(categoryFromUrl || '');
    setSelectedType(typeFromUrl || '');
  }, [searchParams]);

  // FILTER PRODUCTS
  useEffect(() => {
    let filtered = allProducts;

    // SEARCH
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // INTERFACE FILTER
    if (selectedInterface) {
      filtered = filtered.filter(
        (p) =>
          p.interface &&
          p.interface.includes(selectedInterface)
      );
    }

    // CATEGORY / TYPE FILTER
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category === selectedCategory
      );
    } else if (selectedType === 'hardware') {
      filtered = filtered.filter(
        (p) => p.category !== 'Billing Software'
      );
    }

    // PRICE FILTER
    filtered = filtered.filter(
      (p) => p.price <= maxPrice
    );

    setProducts(filtered);
    setCurrentPage(1);

  }, [
    searchQuery,
    selectedCategory,
    selectedType,
    selectedInterface,
    maxPrice,
    allProducts
  ]);

  // PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem - itemsPerPage;

  const currentProducts = products.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(
    products.length / itemsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl font-sans text-slate-900">
      

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4">

        <div className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4 md:mb-0">
          <Link to="/" className="hover:text-black">
            Home
          </Link>{' '}
          / <span className="text-black">Products</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            Showing {indexOfFirstItem + 1}–
            {Math.min(indexOfLastItem, products.length)} of{' '}
            {products.length} results
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* MOBILE FILTERS TOGGLE */}
        <button 
          className="lg:hidden w-full bg-gray-100 p-3 rounded-md text-sm font-bold flex justify-between items-center mb-0 text-gray-700"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          <span>Filters & Search</span>
          <svg className={`w-5 h-5 transform transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {/* SIDEBAR */}
        <div className={`w-full lg:w-1/4 lg:block ${isMobileFiltersOpen ? 'block' : 'hidden'}`}>

          {/* SEARCH PRODUCT */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm border-b pb-2">
              Search Product
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full border border-gray-300 p-2 outline-none rounded text-sm text-gray-600"
              />

              <button className="bg-[#0088cc] hover:bg-[#006699] text-white px-4 py-2 rounded text-sm font-semibold transition-all">
                Search
              </button>
            </div>
          </div>

          {/* FILTER */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm border-b pb-2">
              Filter By Interface
            </h3>

            <select
              className="w-full border border-gray-300 p-2 outline-none rounded text-sm text-gray-600"
              value={selectedInterface}
              onChange={(e) =>
                setSelectedInterface(e.target.value)
              }
            >
              <option value="">Any Interface</option>
              <option value="USB">USB</option>
              <option value="Bluetooth">Bluetooth</option>
              <option value="LAN">LAN</option>
            </select>
          </div>

          {/* FILTER BY PRICE */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm border-b pb-2">
              Filter By Price
            </h3>
            
            <div className="flex flex-col space-y-4">
              <input 
                type="range" 
                min="0" 
                max="100000" 
                step="500"
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0088cc]"
              />
              <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                <button 
                  className="bg-gray-600 hover:bg-gray-800 text-white px-3 py-1.5 rounded-full uppercase text-[10px] tracking-wider transition-colors"
                >
                  Filter
                </button>
                <span>Price: ₹0 — ₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm border-b pb-2">
              Product Categories
            </h3>

            <ul className="space-y-2 text-sm text-gray-600">

              <li
                className={`cursor-pointer hover:text-blue-600 ${
                  selectedCategory === ''
                    ? 'text-blue-600 font-bold'
                    : ''
                }`}
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </li>

              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <li key={idx} className="border-t border-gray-100 pt-2 h-7 bg-gray-100 animate-pulse rounded mt-2"></li>
                ))
              ) : (
                categoriesList.map((cat, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer hover:text-blue-600 border-t border-gray-100 pt-2 flex justify-between ${
                      selectedCategory === cat
                        ? 'text-blue-600 font-bold'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedCategory(cat)
                    }
                  >
                    {cat}
                    <span>›</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="w-full lg:w-3/4">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="flex flex-col h-80 bg-white border border-gray-150 rounded-sm overflow-hidden animate-pulse p-3 space-y-4">
                  <div className="bg-gray-100 h-40 w-full rounded"></div>
                  <div className="h-3 w-1/3 bg-gray-100 rounded"></div>
                  <div className="h-5 w-3/4 bg-gray-100 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-100 rounded mt-auto"></div>
                  <div className="h-9 w-full bg-gray-100 rounded mt-2"></div>
                </div>
              ))
            ) : (
              currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col relative bg-white pb-4 transition-all hover:shadow-lg border border-transparent hover:border-gray-200"
                >
                  {/* IMAGE */}
                  <Link
                    to={getProductUrl(product)}
                    className="block relative overflow-hidden mb-4 bg-white border-b border-gray-50"
                  >
                    <div className="relative w-full h-52 p-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className={`w-full h-full object-contain absolute top-0 left-0 p-4 transition-opacity duration-500 ease-in-out z-10 ${
                          product.hoverImage
                            ? 'group-hover:opacity-0'
                            : 'opacity-100'
                        }`}
                      />
                      {product.hoverImage && (
                        <img
                          src={product.hoverImage}
                          alt={product.title}
                          className="w-full h-full object-contain absolute top-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-20"
                        />
                      )}
                    </div>
                    {/* QUICK VIEW */}
                    <div className="absolute bottom-0 left-0 w-full bg-[#0088cc]/90 text-white text-[10px] py-2 text-center font-bold uppercase transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-30 tracking-widest">
                      Quick View
                    </div>
                  </Link>

                  {/* DETAILS */}
                  <div className="px-3 flex flex-col flex-grow">
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1 font-bold">
                      {product.tag}
                    </p>
                    <Link
                      to={getProductUrl(product)}
                      className="text-[13px] font-semibold text-gray-800 hover:text-blue-600 mb-2 leading-tight"
                    >
                      {product.title}
                    </Link>
                    {/* RATING */}
                    <div className="flex text-yellow-400 text-[10px] mb-2">
                      {'★'.repeat(product.rating)}
                      {'☆'.repeat(5 - product.rating)}
                    </div>
                    {/* PRICE */}
                    <div className="mt-auto mb-3">
                      <div className="flex flex-col">
                        {product.oldPrice && (
                          <span className="text-gray-400 line-through text-[11px]">
                            ₹{product.oldPrice.toLocaleString('en-IN')}.00
                          </span>
                        )}
                        <span className="font-bold text-gray-900 text-sm">
                          ₹{product.price.toLocaleString('en-IN')}.00
                        </span>
                      </div>
                    </div>
                    {/* BUTTON */}
                    {(() => {
                      const isItemLoading = loadingItemIds.includes(String(product.id));
                      return (
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock || isItemLoading}
                          className={`text-[11px] font-bold px-3 py-2 text-white w-full uppercase transition-all rounded-sm flex items-center justify-center gap-1.5 min-h-[34px] ${
                            product.inStock
                              ? 'bg-[#0088cc] hover:bg-[#006699]'
                              : 'bg-gray-400 cursor-not-allowed'
                          } ${isItemLoading ? 'opacity-85 cursor-wait' : ''}`}
                        >
                          {isItemLoading ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Adding...</span>
                            </>
                          ) : product.inStock ? (
                            product.btnType
                          ) : (
                            'Out of Stock'
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2 flex-wrap">

              {/* PREV */}
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev > 1 ? prev - 1 : prev
                  )
                }
                className="px-3 py-2 border rounded text-sm hover:bg-gray-100"
              >
                Prev
              </button>

              {/* PAGE NUMBERS */}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setCurrentPage(i + 1)
                  }
                  className={`w-9 h-9 rounded border text-sm font-semibold ${
                    currentPage === i + 1
                      ? 'bg-[#0088cc] text-white border-[#0088cc]'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* NEXT */}
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages
                      ? prev + 1
                      : prev
                  )
                }
                className="px-3 py-2 border rounded text-sm hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function ProductsPage() { return <Suspense fallback={<div>Loading...</div>}><Products /></Suspense>; }
