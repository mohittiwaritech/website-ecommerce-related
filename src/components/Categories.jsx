import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/dbService';

const Categories = () => {
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategoryData(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // CATEGORY CLICK
  const handleCategoryClick = (categoryName) => {
    navigate(
      `/products?category=${encodeURIComponent(
        categoryName
      )}`
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">

      {/* HEADING */}
      <div className="flex items-center justify-center mb-10">

        <div className="flex-grow h-px bg-gray-300"></div>

        <h2 className="px-6 text-xl md:text-2xl font-bold text-gray-800 tracking-wide uppercase">

          Product Categories
        </h2>

        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          // Skeleton Loader
          Array.from({ length: 8 }).map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-50 border border-gray-100 overflow-hidden animate-pulse h-52 flex flex-col justify-between"
            >
              <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="bg-gray-200 h-10 w-full"></div>
            </div>
          ))
        ) : (
          categoryData.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() =>
                handleCategoryClick(cat.name)
              }
              className="group text-left w-full"
            >

              <div className="bg-[#F3F3F3] border border-gray-200 overflow-hidden transition-all hover:shadow-lg cursor-pointer">

                {/* IMAGE */}
                <div className="h-40 md:h-56 flex items-center justify-center p-4">

                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/200?text=Category';
                    }}
                  />
                </div>

                {/* LABEL */}
                <div className="bg-[#0073B7] py-3 text-center">

                  <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wider">

                    {cat.name}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
};

export default Categories;