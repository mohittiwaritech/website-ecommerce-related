import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// PRODUCTS DATA
const allProducts = [
  {
    id: '1',
    category: 'POS System',
    tag: 'POS SYSTEM',
    title: 'Windows Touch POS System 15.6"ATPOS TP J6412 Touchscreen',
    rating: 5,
    price: 49999,
    oldPrice: 54500,
    image: '/assets/POS SYSTEM.avif',
    hoverImage: '/assets/Atpos pp.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '2',
    category: 'POS System',
    tag: 'POS SYSTEM',
    title:
      'ANDROID POS SYSTEM INBUILT 3 INCH PRINTER 15.6" Touchscreen',
    rating: 5,
    price: 40000,
    oldPrice: 36000,
    image: '/assets/SPPOS.webp',
    hoverImage: '/assets/SP1.webp',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '3',
    category: 'POS System',
    interface: 'LAN',
    tag: 'POS SYSTEM',
    title: 'ATPOS 1008 Android Mobile POS 4G LTE',
    rating: 5,
    oldPrice: 12500,
    price: 11999,
    image: '/assets/1008.webp',
    hoverImage: '/assets/10008.webp',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '4',
    category: 'Label Printer',
    interface: 'USB + Bluetooth',
    tag: '80MM 3 INCH RECEIPT PRINTER',
    title:
      'Atpos AT 602 80mm 3 Inch Dual Mode Thermal Receipt + Label Printer',
    rating: 4,
    oldPrice: 7550,
    price: 6990,
    image: '/assets/500sm-min.png',
    hoverImage: '/assets/602.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '5',
    category: 'Label Printer',
    interface: 'USB + Bluetooth',
    tag: '58MM 2 INCH LABEL PRINTER',
    title:
      'Atpos E58 Bluetooth Thermal Barcode Label Sticker Printer 58mm | Direct Thermal',
    rating: 4,
    oldPrice: 3500,
    price: 2950,
    image: '/assets/barcode.webp',
    hoverImage: '/assets/e58bt.webp',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '6',
    category: 'Receipt Printer',
    interface: 'USB',
    tag: '58MM 2 INCH RECEIPT PRINTER',
    title: 'Atpos H58 58mm USB Thermal Receipt Printer',
    rating: 4,
    oldPrice: 2990,
    price: 2100,
    image: '/assets/h58u.jpg',
    hoverImage: '/assets/h58001.png',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '7',
    category: 'Receipt Printer',
    interface: 'USB',
    tag: '80MM 3 INCH RECEIPT PRINTER',
    title:
      'Atpos HL-300 80mm 3 Inch Thermal USB Receipt Printer | Auto Cutter',
    rating: 5,
    
    price: 3990,
    priceRange: '₹3,990.00  ',
    image: '/assets/Atpos-HL300s.jpg',
    hoverImage: '/assets/HL3000.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },


{
    id: '20',
    category: 'Receipt Printer',
    interface: 'USB + Bluetooth',
    tag: '80MM 3 INCH RECEIPT PRINTER',
    title:
      'Atpos HL-300 80mm 3 Inch Thermal (Usb + Bluetooth)  Receipt Printer | Auto Cutter',
    rating: 5,
    price: 3990,
    priceRange: '₹4,490.00',
    image: '/assets/Atpos-HL300s.jpg',
    hoverImage: '/assets/HL3000.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },


  {
    id: '8',
    category: 'Receipt Printer',
    interface: 'USB',
    tag: '80MM 3 INCH RECEIPT PRINTER',
    title:
      'Atpos AT-402 80mm 3 Inch Thermal Receipt Printer | Auto Cutter',
    rating: 5,
    price: 5199,
    priceRange: '₹5,199.00 ',
    image: '/assets/402.jpg',
    hoverImage: '/assets/receipt printer 402.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },



  {
    id: '9',
    category: 'Mobile Printer',
    interface: 'Bluetooth',
    tag: '80MM 3 INCH MOBILE PRINTER',
    title: 'Atpos M80 80mm Portable Bluetooth Thermal Printer',
    rating: 4,
    oldPrice: 4499,
    price: 3869,
    image: '/assets/m80.jpg',
    hoverImage: '/assets/md80.webp',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '10',
    category: 'Receipt Printer',
    interface: 'Bluetooth',
    tag: '58MM 2 INCH RECEIPT PRINTER',
    title:
      'Atpos H58BT 58mm Bluetooth Thermal Receipt Printer | 2 Inch',
    rating: 5,
    oldPrice: 2950,
    price: 1990,
    image: '/assets/h58001.png',
    hoverImage: '/assets/h58u.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '11',
    category: 'Mobile Printer',
    interface: 'Bluetooth',
    tag: '58MM 2 INCH MOBILE PRINTER',
    title: 'Atpos HL450 58mm Portable Thermal Receipt Printer',
    rating: 4,
    oldPrice: 3900,
    price: 1990,
    image: '/assets/HL450.jpg',
    hoverImage: '/assets/450HL.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '12',
    category: 'Receipt Paper Roll',
    interface: 'None',
    tag: 'DIRECT THERMAL LABEL',
    title: '100x150mm Direct Thermal Barcode Sticker',
    rating: 5,
    price: 849,
    image: '/assets/roll.jpg',
    hoverImage: '/assets/labelrolll.jpg',
    inStock: true,
    btnType: 'SELECT OPTIONS',
  },

  {
    id: '13',
    category: 'Barcode Scanner',
    interface: 'USB',
    tag: 'BARCODE SCANNER',
    title:
      'Atpos AT-9300D 2D 1D Desktop Barcode Scanner | USB Wired',
    rating: 4,
    oldPrice: 3500,
    price: 2999,
    image: '/assets/9300d.jpg',
    hoverImage: '/assets/9300d1.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '14',
    category: 'Barcode Scanner',
    interface: 'Wireless',
    tag: 'BARCODE SCANNER',
    title: 'Atpos at 2200D 2D Barcode QR Scanner Wired',
    rating: 5,
    oldPrice: 1899,
    price: 1690,
    image: '/assets/2200D.jpg',
    hoverImage: '/assets/2200D1.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '15',
    category: 'Cash Box ',
    interface: 'None',
    tag: 'CASH DRAWER',
    title: 'ATPOS 405CB Cash Drawer 5 Note',
    rating: 4,
    oldPrice: 4500,
    price: 3490,
    image: '/assets/cashbox.jpg',
    hoverImage: '/assets/CASHBOX1.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '16',
    category: 'Billing Software',
    interface: 'None',
    tag: 'SOFTWARE',
    title: 'RESTAURANT BILLING SOFTWARE',
    rating: 5,
    oldPrice: 8500,
    price: 5000,
    image: '/assets/ChatGPT Image May 14, 2026, 05_22_04 PM.png',
    hoverImage: '/assets/soft111.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

{
    id: '17',
    category: 'Billing Software',
    interface: 'None',
    tag: 'SOFTWARE',
    title: 'Cafe BILLING Software',
    rating: 5,
    oldPrice: 8500,
    price: 5000,
    image: '/assets/ChatGPT Image May 14, 2026, 05_24_50 PM.png',
    hoverImage: '/assets/soft111.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

  {
    id: '18',
    category: 'Billing Software',
    interface: 'None',
    tag: 'SOFTWARE',
    title: 'Retail Billing Software',
    rating: 5,
    oldPrice: 8500,
    price: 5000,
    image: '/assets/ChatGPT Image Mar 12, 2026, 09_51_08 PM.png',
    hoverImage: '/assets/soft111.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },


  {
    id: '19',
    category: 'Billing Software',
    interface: 'None',
    tag: 'SOFTWARE',
    title: 'Garment Billing Software',
    rating: 5,
    oldPrice: 8500,
    price: 5000,
    image: '/assets/ChatGPT Image Mar 12, 2026, 06_18_12 PM.png',
    hoverImage: '/assets/soft111.jpg',
    inStock: true,
    btnType: 'ADD TO BASKET',
  },

];

const categoriesList = [
  'Label Printer',
  'Mobile Printer',
  'POS System',
  'Billing Software',
  'Receipt Printer',
  'Cash Box ',
  'Receipt Paper Roll',
  'Barcode Scanner',
];

function Products() {

  const location = useLocation();

  const [products, setProducts] = useState(allProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedInterface, setSelectedInterface] = useState('');
  const [maxPrice, setMaxPrice] = useState(50000);
  const { addToCart } = useCart();

  const showSuccessToast = () => {

  toast.success(

    <div className="flex items-center gap-3">

      <div className="text-3xl text-white">
        ✓
      </div>

      <div>

        <h4 className="font-bold text-sm uppercase">
          PRODUCT ADDED
        </h4>

        <p className="text-xs">
          Item successfully added to cart
        </p>

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

    const params = new URLSearchParams(
      location.search
    );

    const categoryFromUrl =
      params.get('category');

    if (categoryFromUrl) {

      setSelectedCategory(categoryFromUrl);
    }

  }, [location.search]);

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

    // CATEGORY FILTER
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category === selectedCategory
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
    selectedInterface,
    maxPrice,
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

        {/* SIDEBAR */}
        <div className="w-full lg:w-1/4">

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

              {categoriesList.map((cat, index) => (
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
              ))}
            </ul>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="w-full lg:w-3/4">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {currentProducts.map((product) => (

              <div
                key={product.id}
                className="group flex flex-col relative bg-white pb-4 transition-all hover:shadow-lg border border-transparent hover:border-gray-200"
              >

                {/* IMAGE */}
                <Link
                  to={`/product/${product.id}`}
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
                    to={`/product/${product.id}`}
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
                          ₹
                          {product.oldPrice.toLocaleString(
                            'en-IN'
                          )}
                          .00
                        </span>
                      )}

                      <span className="font-bold text-gray-900 text-sm">
                        {product.priceRange
                          ? product.priceRange
                          : `₹${product.price.toLocaleString(
                              'en-IN'
                            )}.00`}
                      </span>
                    </div>
                  </div>

                  {/* BUTTON */}
<button
  onClick={() => {

    addToCart(product);

    showSuccessToast();

  }}
  disabled={!product.inStock}
  className={`text-[11px] font-bold px-3 py-2 text-white w-full uppercase transition-colors rounded-sm ${
    product.inStock
      ? 'bg-[#0088cc] hover:bg-[#006699]'
      : 'bg-gray-400 cursor-not-allowed'
  }`}
>
  {product.inStock
    ? product.btnType
    : 'Out of Stock'}
</button>
                </div>
              </div>
            ))}
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

export default Products;