import React from 'react';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      tag: '3 INCH 80MM LABEL PRINTER',
      name: 'Atpos MD80 80mm 3-Inch Mobile Label Receipt Printer (Dual Mode) | USB+BT',
      oldPrice: '₹4,950.00',
      price: '₹4,899.00',
      image: '/assets/md80.webp', // Sabse pehle '/' lagaya aur src hata diya
      buttonText: 'ADD TO BASKET'
    },
    {
      id: 2,
      tag: '80MM 3 INCH- MOBILE PRINTER',
      name: 'Atpos M80 80mm Portable Bluetooth Thermal Printer | Wireless Printing | 3 Inch',
      oldPrice: '₹4,400.00',
      price: '₹3,869.00',
      image: '/assets/m80.jpg', // Extension small 'jpg' rakha hai as per standard
      buttonText: 'ADD TO BASKET'
    },
    {
      id: 3,
      tag: '4 INCH 108MM LABEL PRINTER',
      name: 'Atpos HQ450L 4 Inch (108mm) Thermal Barcode Shipping Label Sticker Printer | USB+Bluetooth Interface',
      oldPrice: '₹8,990.00',
      price: '₹7,290.00',
      image: '/assets/450.webp',
      buttonText: 'ADD TO BASKET'
    },
    {
      id: 4,
      tag: '80MM 3 INCH RECEIPT PRINTER',
      name: 'Atpos AT-402 80mm 3 Inch Thermal Receipt Printer (Bluetooth + USB ) | Auto Cutter',
      oldPrice: '₹6,500.00',
      price: '₹5,199.00',
      // Space wala issue: Check karein folder mein file ka naam exact yahi ho
      image: '/assets/receipt printer 402.jpg', 
      buttonText: 'SELECT OPTIONS'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Heading with Lines */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex-grow h-px bg-gray-200"></div>
        <h2 className="px-6 text-xl md:text-2xl font-bold text-gray-800 tracking-wide uppercase">
          Featured Products
        </h2>
        <div className="flex-grow h-px bg-gray-200"></div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col group h-full">
            {/* Image Area */}
            <div className="relative aspect-square mb-4 overflow-hidden bg-white">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Printer"; }}
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col flex-grow">
              <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-tight">
                {product.tag}
              </span>
              <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-2 flex-grow hover:text-blue-600 cursor-pointer">
                {product.name}
              </h3>
              
              {/* Pricing */}
              <div className="mb-4">
                <span className="text-gray-400 line-through text-sm mr-2">{product.oldPrice}</span>
                <span className="text-[#0073B7] font-bold text-base">{product.price}</span>
              </div>

              {/* Action Button */}
              <button className="w-full bg-[#0073B7] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm text-xs uppercase transition-colors tracking-wide">
                {product.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;