import React from 'react';

const Categories = () => {
  const categoryData = [
    // '/assets/' se shuru karein kyunki images ab public folder mein hain
    { id: 1, name: 'RECEIPT PRINTER', image: '/assets/Thermal.jpg'},
    { id: 2, name: 'LABEL PRINTER', image: '/assets/barcode.webp' },
    { id: 3, name: 'BARCODE SCANNER', image: '/assets/scanner.jpg' },
    { id: 4, name: 'MOBILE PRINTER', image: '/assets/Receipt Printer.jpg' },
    { id: 5, name: 'RECEIPT PAPER ROLL', image: '/assets/receipt-paper.jpg' },
    { id: 6, name: 'POS SYSTEM', image: '/assets/POS SYSTEM.avif' },
    { id: 7, name: 'CASH BOX & ACCESSORIES', image: '/assets/cashbox.jpg' },  
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Heading with Lines */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex-grow h-px bg-gray-300"></div>
        <h2 className="px-6 text-xl md:text-2xl font-bold text-gray-800 tracking-wide uppercase">
          Product Categories
        </h2>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categoryData.map((cat) => (
          <div key={cat.id} className="group cursor-pointer">
            <div className="bg-[#F3F3F3] border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
              {/* Image Area */}
              <div className="h-40 md:h-56 flex items-center justify-center p-4">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  // Agar image path galat ho toh placeholder dikhega
                  onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=Category"; }}
                />
              </div>
              {/* Blue Label */}
              <div className="bg-[#0073B7] py-3 text-center">
                <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wider">
                  {cat.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;