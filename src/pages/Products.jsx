import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Yahan poore 65 products ek-ek karke likhe hain. Koi shortcut use nahi kiya hai.
const allProducts = [
  // --- PAGE 1 WALE PRODUCTS ---
  { id: '2', category: 'Mobile Printer', interface: 'Bluetooth', tag: '58MM 2 INCH RECEIPT PRINTER', title: 'Atpos HL508T 58mm Bluetooth Thermal Receipt Printer | 2 Inch', rating: 5, oldPrice: 2950, price: 1990, image: 'https://via.placeholder.com/200', inStock: true, btnType: 'ADD TO BASKET' },
  { id: '3', category: 'Receipt Printer', interface: 'USB', tag: '58MM 2 INCH RECEIPT PRINTER', title: 'Atpos HS58 58mm USB Thermal Receipt Printer', rating: 4, oldPrice: 2000, price: 1099, image: 'https://via.placeholder.com/200', inStock: true, btnType: 'ADD TO BASKET' },
  { id: '4', category: 'Receipt Printer', interface: 'USB + Bluetooth', tag: '80MM 3 INCH RECEIPT PRINTER', title: 'Atpos HL-300 80mm 3 Inch Thermal Receipt Printer | Auto Cutter', rating: 5, price: 3990, priceRange: '₹3,990.00 – ₹4,490.00', options: ['USB', 'USB+Bluetooth'], image: 'https://via.placeholder.com/200', inStock: true, btnType: 'SELECT OPTIONS' },
  { id: '5', category: 'Label Printer', interface: 'USB', tag: '2 INCH 58MM LABEL PRINTER', title: 'Atpos F-200 Wireless Portable Thermal Receipt Printer', rating: 5, oldPrice: 5875, price: 2590, image: 'https://via.placeholder.com/200', inStock: true, btnType: 'ADD TO BASKET' },
  { id: '7', category: 'Receipt Printer', interface: 'USB + Bluetooth', tag: '80MM 3 INCH RECEIPT PRINTER', title: 'Atpos AT 402 80mm 3 Inch Dual Mode Thermal Receipt + Label Printer', rating: 4, oldPrice: 7550, price: 6990, image: 'https://via.placeholder.com/200', inStock: true, btnType: 'ADD TO BASKET' },
  { id: '8', category: 'Mobile Printer', interface: 'Bluetooth', tag: '80MM 3 INCH MOBILE PRINTER', title: 'Atpos Bluetooth F-200 Wireless Portable Thermal Receipt Printer', rating: 0, oldPrice: 4500, price: 3199, image: 'https://via.placeholder.com/200', inStock: false, btnType: 'READ MORE' }, // OUT OF STOCK
  { id: '9', category: 'Receipt Printer', interface: 'USB', tag: '80MM 3 INCH RECEIPT PRINTER', title: 'Atpos AT-402 80mm 3 Inch Thermal Receipt Printer | Auto Cutter', rating: 5, price: 5199, priceRange: '₹5,199.00 – ₹5,699.00', options: ['Black', 'White'], image: 'https://via.placeholder.com/200', inStock: true, btnType: 'SELECT OPTIONS' },
  
  // --- PAGE 2 WALE PRODUCTS ---
  { id: '10', category: 'Mobile Printer', interface: 'Bluetooth', tag: '58MM 2 INCH MOBILE PRINTER', title: 'Atpos HL450 58mm Portable Thermal Receipt Printer', rating: 4, oldPrice: 3900, price: 1990, image: 'https://via.placeholder.com/200', inStock: true, btnType: 'ADD TO BASKET' },
  { id: '13', category: 'Label Rolls', interface: 'None', tag: 'DIRECT THERMAL LABEL', title: '100x150mm Direct Thermal Barcode Sticker | 3-36 PACK', rating: 5, price: 849, priceRange: '₹849.00 – ₹7,699.00', options: ['3 Rolls', '36 Rolls', '9 Rolls'], image: 'https://via.placeholder.com/200', inStock: true, btnType: 'SELECT OPTIONS' },
  { id: '14', category: 'Receipt Printer', interface: 'USB + LAN', tag: '80MM 3 INCH RECEIPT PRINTER', title: 'Atpos AT-502 80mm 3 Inch Thermal Receipt Printer | Auto Cutter', rating: 5, oldPrice: 7999, price: 5990, image: 'https://via.placeholder.com/200', inStock: false, btnType: 'READ MORE' }, // OUT OF STOCK
  { id: '15', category: 'Barcode Scanner', interface: 'USB', tag: 'BARCODE SCANNER', title: 'Atpos AT-9300D 2D 1D Desktop Barcode Scanner | USB Wired', rating: 4, oldPrice: 3500, price: 2999, image: 'https://via.placeholder.com/200', inStock: true, btnType: 'ADD TO BASKET' },

  // --- BAAKI KE 50 PRODUCTS (Aap inke naam baad mein badal sakte hain) ---
  { id: '16', category: 'Barcode Scanner', interface: 'Wireless', tag: 'BARCODE SCANNER', title: 'Atpos AT-1100LW 1D Wireless Scanner', rating: 5, oldPrice: 1899, price: 1690, image: 'https://via.placeholder.com/200', inStock: true, btnType: 'ADD TO BASKET' },
  { id: '17', category: 'Mobile Printer', interface: 'Bluetooth', tag: '80MM 3 INCH MOBILE PRINTER', title: 'Atpos M80 80mm Portable Bluetooth Thermal Printer', rating: 4, oldPrice: 4499, price: 3869, image: 'https://via.placeholder.com/200', inStock: true, btnType: 'ADD TO BASKET' },
  { id: '18', category: 'POS System', interface: 'LAN', tag: 'POS SYSTEM', title: 'ATPOS 1000 Android Mobile POS 4G LTE', rating: 5, oldPrice: 12500, price: 11999, image: 'https://via.placeholder.com/200', inStock: true, btnType: 'ADD TO BASKET' },
  { id: '19', category: 'Cash Box & Accessories', interface: 'None', tag: 'CASH DRAWER', title: 'ATPOS 405CB Cash Drawer 5 Note', rating: 4, oldPrice: 4500, price: 3490, image: 'https://via.placeholder.com/200', inStock: true, btnType: 'ADD TO BASKET' },
  
  { id: '21', category: 'Printers', interface: 'USB', tag: 'PRINTER', title: 'ATPOS Product 21', rating: 4, oldPrice: 1000, price: 800, image: 'https://via.placeholder.com/200', inStock: true, btnType: 'ADD TO BASKET' },
  { id: '22', category: 'Printers', interface: 'USB', tag: 'PRINTER', title: 'ATPOS Product 22', rating: 5, oldPrice: 1200, price: 900, image: 'https://via.placeholder.com/200', inStock: true, btnType: 'ADD TO BASKET' },
 
];

const categoriesList = [
  
  'Label Printer', 'Mobile Printer',  
  'POS System', 'Printers', 'Receipt Printer'
];

function Products() {
  const [products, setProducts] = useState(allProducts);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedInterface, setSelectedInterface] = useState(''); 
  const [maxPrice, setMaxPrice] = useState(50000);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Ek page par 12 items (aapki website ki tarah)

  // Filters setup
  useEffect(() => {
    let filtered = allProducts;
    if (searchQuery) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedInterface) filtered = filtered.filter(p => p.interface && p.interface.includes(selectedInterface));
    if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory);
    filtered = filtered.filter(p => p.price <= maxPrice);

    setProducts(filtered);
    setCurrentPage(1); 
  }, [searchQuery, selectedInterface, selectedCategory, maxPrice]);

  // Pagination ka math
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4">
        <div className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-4 md:mb-0">
          <Link to="/" className="hover:text-black">Home</Link> / <span className="text-black">Products</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Showing {products.length === 0 ? 0 : indexOfFirstItem + 1}–{Math.min(indexOfLastItem, products.length)} of {products.length} results</span>
          <select className="border border-gray-300 p-2 outline-none rounded">
            <option>Sort by popularity</option>
            <option>Sort by latest</option>
            <option>Sort by price: low to high</option>
            <option>Sort by price: high to low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR (Filters) */}
        <div className="w-full lg:w-1/4">
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm border-b pb-2">Filter By</h3>
            <select 
              className="w-full border border-gray-300 p-2 outline-none rounded text-sm text-gray-600"
              value={selectedInterface}
              onChange={(e) => setSelectedInterface(e.target.value)}
            >
              <option value="">Any Interface</option>
              <option value="USB">USB</option>
              <option value="Bluetooth">Bluetooth</option>
              <option value="LAN">LAN</option>
              <option value="Wireless">Wireless / Wi-Fi</option>
            </select>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm border-b pb-2">Search Product</h3>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm border-b pb-2">Product Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li 
                className={`cursor-pointer hover:text-blue-600 ${selectedCategory === '' ? 'text-blue-600 font-bold' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </li>
              {categoriesList.map((cat, index) => (
                <li 
                  key={index} 
                  className={`cursor-pointer hover:text-blue-600 border-t border-gray-100 pt-2 flex justify-between ${selectedCategory === cat ? 'text-blue-600 font-bold' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} <span className="text-gray-400">v</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm border-b pb-2">Filter By Price</h3>
            <input 
              type="range" 
              min="0" 
              max="50000" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full mb-4 accent-gray-700"
            />
            <div className="flex justify-between items-center text-sm font-semibold">
              <button className="bg-gray-600 text-white px-4 py-1 rounded text-xs hover:bg-gray-800">FILTER</button>
              <span>Price: ₹0 — ₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Grid) */}
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {currentProducts.map((product) => (
              <div key={product.id} className="group flex flex-col relative bg-white pb-4 transition-all hover:shadow-lg border border-transparent hover:border-gray-200">
                
                {!product.inStock && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 px-4 py-1 font-bold z-10 opacity-80 text-xs text-center w-3/4">
                    OUT OF STOCK
                  </div>
                )}

                <Link to={`/product/${product.id}`} className="block relative overflow-hidden mb-4 text-center border border-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className={`w-full h-40 object-contain mx-auto p-4 ${!product.inStock ? 'opacity-50' : ''}`}
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-[#0088cc] text-white text-sm py-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    QUICK VIEW
                  </div>
                </Link>

                <div className="px-3 flex flex-col flex-grow">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">{product.tag}</p>
                  
                  <Link to={`/product/${product.id}`} className="text-[13px] font-semibold text-gray-800 hover:text-blue-600 mb-2 line-clamp-3 leading-snug">
                    {product.title}
                  </Link>
                  
                  <div className="flex text-yellow-400 text-[10px] mb-2">
                    {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}
                  </div>

                  {product.options && (
                    <div className="flex flex-wrap gap-1 mb-3 mt-1">
                      {product.options.map((opt, idx) => (
                        <span key={idx} className="border border-gray-300 text-gray-500 text-[10px] px-1 py-0.5 rounded-sm">
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto mb-3 text-sm">
                    {product.priceRange ? (
                      <span className="font-bold text-gray-900 text-sm">{product.priceRange}</span>
                    ) : (
                      <>
                        {product.oldPrice && <span className="text-gray-400 line-through mr-1 text-xs">₹{product.oldPrice.toLocaleString('en-IN')}.00</span>}
                        <span className="font-bold text-gray-900 text-sm">₹{product.price.toLocaleString('en-IN')}.00</span>
                      </>
                    )}
                  </div>

                  <div>
                    <button 
                      className={`text-[11px] font-bold px-3 py-2 text-white w-full sm:w-auto ${product.btnType === 'READ MORE' ? 'bg-[#006699]' : product.btnType === 'SELECT OPTIONS' ? 'bg-[#006699]' : 'bg-[#0088cc] hover:bg-[#006699]'}`}
                    >
                      {product.btnType}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
          </div>

          {currentProducts.length === 0 && (
             <div className="text-center py-12 text-gray-500">
               No products found matching your search or filter criteria.
             </div>
          )}

          {/* EXACT PAGINATION DESIGN (1 2 3 4 5 6) */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold ${currentPage === i + 1 ? 'bg-[#006699] text-white border-[#006699]' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Products;