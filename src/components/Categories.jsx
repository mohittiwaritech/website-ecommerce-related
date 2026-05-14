import React from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {

  const navigate = useNavigate();

  const categoryData = [

    {
      id: 1,
      name: 'Receipt Printer',
      image: '/assets/Thermal.jpg',
    },

    {
      id: 2,
      name: 'Label Printer',
      image: '/assets/barcode.webp',
    },

    {
      id: 3,
      name: 'Barcode Scanner',
      image: '/assets/scanner.jpg',
    },

    {
      id: 4,
      name: 'Mobile Printer',
      image: '/assets/Receipt Printer.jpg',
    },

    {
      id: 5,
      name: 'Receipt Paper Roll',
      image: '/assets/receipt-paper.jpg',
    },

    {
      id: 6,
      name: 'POS System',
      image: '/assets/POS SYSTEM.avif',
    },

    {
      id: 7,
      name: 'Cash Box ',
      image: '/assets/cashbox.jpg',
    },

    {
      id: 8,
      name: 'Billing Software',
      image: '/assets/soft111.jpg',
    },
  ];

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

        {categoryData.map((cat) => (

          <button
            key={cat.id}
            type="button"
            onClick={() =>
              handleCategoryClick(cat.name)
            }
            className="group text-left"
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
        ))}
      </div>
    </section>
  );
};

export default Categories;