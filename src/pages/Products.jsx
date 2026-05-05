import React, { useState, useEffect } from 'react';

const INITIAL_PRODUCTS = [
  { id: 1, category: 'Receipt Printer', tag: '80mm 3 Inch', name: 'Atpos HL-300 Thermal Receipt Printer', price: 3990, image: '/hl300.jpg', status: 'select_options' },
  { id: 2, category: 'Label Printer', tag: '2 Inch 58mm', name: 'Atpos E58 Bluetooth Barcode Printer', price: 2590, image: '/e58.jpg', status: 'add_to_basket' },
  { id: 3, category: 'Paper | Label Rolls', tag: 'Receipt Roll', name: '80mm 3 Inch Thermal Paper Roll', price: 1395, image: '/roll25.jpg', status: 'add_to_basket' },
  { id: 4, category: 'Receipt Printer', tag: '80mm 3 Inch', name: 'Atpos AT-602 Dual Mode Printer', price: 6990, image: '/at602.jpg', status: 'add_to_basket' },
  { id: 5, category: 'Mobile Printer', tag: '58mm 2 Inch', name: 'Atpos Bluetooth E-200 Portable Printer', price: 3199, image: '/e200.jpg', status: 'out_of_stock' },
  { id: 6, category: 'Receipt Printer', tag: '80mm 3 Inch', name: 'Atpos AT-402 Bluetooth Printer', price: 5199, image: '/at402.jpg', status: 'select_options' },
  { id: 7, category: 'Label Printer', tag: '4 Inch 108mm', name: 'Atpos HQ450L Shipping Label Printer', price: 7290, image: '/hq450l.jpg', status: 'add_to_basket' },
  { id: 8, category: 'Receipt Printer', tag: '80mm 3 Inch', name: 'Atpos AT-302 USB+LAN Printer', price: 5190, image: '/at302.jpg', status: 'add_to_basket' },
  { id: 9, category: 'Mobile Printer', tag: '58mm 2 Inch', name: 'Atpos HL450 Portable Thermal Printer', price: 1990, image: '/hl450.png', status: 'add_to_basket' },
  { id: 10, category: 'POS System', tag: 'Smart POS', name: 'ATPOS TP J6412 Touch POS System', price: 49999, image: '/tp_j6412.jpg', status: 'add_to_basket' },

  ...Array.from({ length: 55 }).map((_, i) => {
    const categories = ["Barcode Scanner", "Label Printer", "Mobile Printer", "Paper | Label Rolls", "Receipt Printer", "POS System"];
    const cat = categories[i % categories.length];
    return {
      id: i + 11,
      category: cat,
      tag: cat,
      name: `Atpos Premium ${cat} Model ${i + 101}`,
      price: 1500 + (i * 200),
      image: '/placeholder.jpg',
      status: 'add_to_basket'
    };
  })
];

const CATEGORIES = ["All", "Receipt Printer", "Label Printer", "Mobile Printer", "POS System", "Barcode Scanner", "Paper | Label Rolls"];

const Products = () => {
  const [filteredItems, setFilteredItems] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    let temp = [...INITIAL_PRODUCTS];
    if (category !== 'All') temp = temp.filter(p => p.category === category);
    if (searchTerm.trim() !== '') {
      temp = temp.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (sort === 'low') temp.sort((a, b) => a.price - b.price);
    if (sort === 'high') temp.sort((a, b) => b.price - a.price);

    setFilteredItems(temp);
    setPage(1); 
  }, [category, sort, searchTerm]);

  const currentItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="w-full bg-[#f9fafb] min-h-screen font-sans antialiased text-slate-900">
      
      {/* --- PREMIUM BLACK SUB-HEADER --- */}
      <div className="bg-[#0f172a] text-white sticky top-0 z-40 shadow-xl overflow-x-auto border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-center whitespace-nowrap px-4 py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-4 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 hover:text-[#38bdf8] ${
                category === cat ? 'text-[#38bdf8] border-b-2 border-[#38bdf8]' : 'text-slate-400'
              }`}
            >
              {cat === "All" ? "All Products" : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* --- SIDEBAR --- */}
          <aside className="w-full lg:w-1/4 space-y-8">
            <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100">
              <h3 className="font-extrabold text-[12px] uppercase tracking-widest mb-5 text-slate-400 border-b border-slate-50 pb-3">Search Catalog</h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. HL-300" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0073B7]/20 focus:border-[#0073B7] transition-all placeholder:text-slate-300"
                />
                <span className="absolute right-4 top-3.5 text-slate-400 opacity-50">🔍</span>
              </div>
            </div>

            <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100">
              <h3 className="font-extrabold text-[12px] uppercase tracking-widest mb-5 text-slate-400 border-b border-slate-50 pb-3">Quick Filter</h3>
              <div className="flex flex-col gap-1.5">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-left px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 ${
                        category === cat ? 'bg-[#0073B7] text-white shadow-lg translate-x-1' : 'text-slate-600 hover:bg-slate-50 hover:text-[#0073B7]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* --- MAIN GRID --- */}
          <main className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-10 bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm">
              <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                Showing <span className="text-slate-900">{filteredItems.length}</span> results
              </div>
              <select onChange={(e) => setSort(e.target.value)} className="text-[12px] font-bold p-2 px-4 bg-slate-50 border-none rounded-xl text-slate-600 outline-none cursor-pointer focus:ring-2 focus:ring-slate-100">
                <option value="default">Sort: Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.length > 0 ? currentItems.map(p => (
                <div key={p.id} className="group relative bg-white border border-slate-100 p-6 rounded-[32px] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full">
                  {p.status === 'out_of_stock' && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-[32px]">
                      <span className="bg-slate-900 text-white text-[10px] font-bold px-5 py-2 rounded-full uppercase tracking-widest">Out of Stock</span>
                    </div>
                  )}
                  <div className="h-48 bg-[#f8fafc] rounded-[24px] flex items-center justify-center mb-6 group-hover:bg-white transition-all duration-500 overflow-hidden">
                    <img src={p.image} alt={p.name} className="max-h-40 object-contain group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="flex-grow text-left">
                    <span className="text-[10px] font-extrabold text-[#0073B7]/60 uppercase tracking-[0.15em] mb-2 block">{p.tag}</span>
                    <h4 className="text-[15px] font-bold text-slate-800 leading-[1.4] mb-3 group-hover:text-[#0073B7] transition-colors line-clamp-2">{p.name}</h4>
                    <p className="text-[#0073B7] font-black text-2xl tracking-tight">₹{p.price.toLocaleString()}</p>
                  </div>
                  <button className={`w-full mt-7 py-4 rounded-[18px] text-[11px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
                    p.status === 'out_of_stock' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#0073B7] text-white hover:bg-slate-900 hover:shadow-xl'
                  }`}>
                    {p.status === 'select_options' ? 'Choose Options' : 'Add to Basket'}
                  </button>
                </div>
              )) : (
                <div className="col-span-full py-24 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5 text-3xl">🔎</div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No hardware found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center gap-4">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => {setPage(i + 1); window.scrollTo({top: 0, behavior: 'smooth'});}}
                    className={`w-12 h-12 rounded-2xl font-bold text-[13px] transition-all duration-300 ${
                      page === i + 1 ? 'bg-[#0073B7] text-white shadow-2xl scale-110' : 'bg-white text-slate-400 border border-slate-100 hover:border-[#0073B7] hover:text-[#0073B7]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;