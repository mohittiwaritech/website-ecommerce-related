import React, { useState, useEffect } from 'react';
import { 
  getProducts, 
  saveProduct, 
  deleteProduct, 
  getCategories 
} from '../../services/dbService';
import { storage } from '../../firebase'; // keep for other things if needed, or remove if unused. Actually let's just remove the storage usage in upload.
import { toast } from 'react-toastify';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Star,
  Eye,
  FilePlus,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Drawer/Modal State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    id: '',
    sku: '',
    brand: 'ATPOS',
    category: '',
    title: '',
    rating: 5,
    price: 0,
    oldPrice: 0,
    mainImage: '',
    thumbnails: [],
    shortDescInput: '', // temporary
    shortDesc: [],
    longDescription: '',
    videoUrl: '',
    specs: [], // Array of { key: '', value: '' } for form, will convert to map for firestore
    warranty: '1 Year Warranty',
    inStock: true,
    featured: false
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDrawer = (product = null) => {
    if (product) {
      // Map specs object to key-value array
      const specsArray = Object.entries(product.specs || {}).map(([key, value]) => ({ key, value }));
      
      setEditingProduct(product);
      setForm({
        id: product.id || '',
        sku: product.sku || '',
        brand: product.brand || 'ATPOS',
        category: product.category || '',
        title: product.title || '',
        rating: product.rating || 5,
        price: product.price || 0,
        oldPrice: product.oldPrice || 0,
        mainImage: product.mainImage || '',
        thumbnails: product.thumbnails || [],
        shortDescInput: (product.shortDesc || []).join('\n'),
        shortDesc: product.shortDesc || [],
        longDescription: product.longDescription || '',
        videoUrl: product.videoUrl || '',
        specs: specsArray,
        warranty: product.warranty || '1 Year Warranty',
        inStock: product.inStock !== false,
        featured: product.featured === true
      });
    } else {
      setEditingProduct(null);
      setForm({
        id: '',
        sku: '',
        brand: 'ATPOS',
        category: categories[0]?.name || '',
        title: '',
        rating: 5,
        price: 0,
        oldPrice: 0,
        mainImage: '',
        thumbnails: [],
        shortDescInput: '',
        shortDesc: [],
        longDescription: '',
        videoUrl: '',
        specs: [],
        warranty: '1 Year Warranty',
        inStock: true,
        featured: false
      });
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingProduct(null);
  };

  // Image Upload helper (via Backend Proxy to ImageKit)
  const handleImageUpload = async (e, type = 'main') => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Convert file to Base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      // 2. Send to our secure Node.js backend
      const res = await fetch('https://website-ecommerce-related-tql6.onrender.com/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file: base64,
          fileName: file.name
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const url = data.url;
      
      if (type === 'main') {
        setForm(prev => ({ ...prev, mainImage: url }));
        toast.success("Main image uploaded successfully!");
      } else {
        setForm(prev => ({ ...prev, thumbnails: [...prev.thumbnails, url] }));
        toast.success("Thumbnail added successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveThumbnail = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      thumbnails: prev.thumbnails.filter((_, i) => i !== indexToRemove)
    }));
  };

  // Add Dynamic Spec Row
  const handleAddSpecRow = () => {
    setForm(prev => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }]
    }));
  };

  const handleRemoveSpecRow = (index) => {
    setForm(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };

  const handleSpecChange = (index, field, val) => {
    const updated = [...form.specs];
    updated[index][field] = val;
    setForm(prev => ({ ...prev, specs: updated }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) {
      toast.error("Title and Category are required");
      return;
    }

    // Convert specs array back to firestore specs map object
    const specsMap = {};
    form.specs.forEach(item => {
      if (item.key.trim()) {
        specsMap[item.key.trim()] = item.value.trim();
      }
    });

    // Process short descriptions from linebreaks
    const shortDescLines = form.shortDescInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const productPayload = {
      sku: form.sku,
      brand: form.brand,
      category: form.category,
      title: form.title,
      rating: Number(form.rating) || 5,
      price: Number(form.price) || 0,
      oldPrice: Number(form.oldPrice) || 0,
      mainImage: form.mainImage,
      thumbnails: form.thumbnails.length > 0 ? form.thumbnails : [form.mainImage],
      shortDesc: shortDescLines,
      longDescription: form.longDescription,
      videoUrl: form.videoUrl,
      specs: specsMap,
      warranty: form.warranty,
      inStock: form.inStock,
      featured: form.featured
    };

    if (form.id) {
      productPayload.id = form.id;
    } else {
      // Create new ID or leave for firestore to assign, but keeping IDs formatted is nice
      // e.g. SKU slug
      if (form.sku) {
        productPayload.id = form.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
    }

    try {
      await saveProduct(productPayload);
      toast.success(form.id ? "Product updated successfully!" : "Product created successfully!");
      handleCloseDrawer();
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully");
        loadData();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleToggleStock = async (product) => {
    try {
      await saveProduct({ ...product, inStock: !product.inStock });
      toast.success(`Product stock updated to ${!product.inStock ? 'In Stock' : 'Out of Stock'}`);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update stock status");
    }
  };

  // Filters
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 inset-y-0 my-auto text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by SKU or Title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2 text-xs w-full sm:w-64 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* CATEGORIES FILTER */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2 text-xs focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => handleOpenDrawer()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider transition w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded-2xl text-slate-500">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          No products found. Use "Add Product" to create one.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 w-20">Image</th>
                  <th className="p-4">SKU / Brand</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 w-28 text-center">In Stock</th>
                  <th className="p-4 w-24 text-center">Featured</th>
                  <th className="p-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20 text-slate-300">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded bg-white p-1 border border-slate-700 flex items-center justify-center">
                        <img
                          src={p.mainImage}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=Product"; }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{p.sku || 'N/A'}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{p.brand}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200 line-clamp-2 max-w-xs">{p.title}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-[10px] font-bold text-blue-400 uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-black text-white">
                      ₹{p.price.toLocaleString('en-IN')}
                      {p.oldPrice > 0 && (
                        <div className="text-[10px] text-slate-500 line-through font-normal">₹{p.oldPrice.toLocaleString('en-IN')}</div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleStock(p)}
                        className={`mx-auto w-20 flex items-center justify-center gap-1.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
                          p.inStock 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        {p.inStock ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            <span>Out</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      {p.featured ? (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 mx-auto" />
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDrawer(p)}
                        className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 bg-slate-950 border border-slate-800 hover:border-red-900/50 text-slate-400 hover:text-red-400 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-xs font-sans">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl animate-slide-in">
            {/* DRAWER HEADER */}
            <div className="h-20 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50">
              <div>
                <h3 className="font-bold text-white text-md">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
                </h3>
                <p className="text-slate-400 text-xs">
                  Fill in standard product information details
                </p>
              </div>
              <button 
                onClick={handleCloseDrawer}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DRAWER FORM */}
            <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-6 space-y-6">
              
              {/* BRAND / SKU */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="POS-TP-J6412"
                    value={form.sku}
                    onChange={(e) => setForm(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="ATPOS"
                    value={form.brand}
                    onChange={(e) => setForm(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* TITLE */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="Atpos TP J6412 Touch POS Billing Terminal"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* CATEGORY / RATING */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rating (1 to 5 Stars)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm(prev => ({ ...prev, rating: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* PRICE / OLD PRICE */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sale Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">List Price / Old Price (INR)</label>
                  <input
                    type="number"
                    value={form.oldPrice}
                    onChange={(e) => setForm(prev => ({ ...prev, oldPrice: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* MAIN IMAGE UPLOAD */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Main Product Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={form.mainImage}
                    onChange={(e) => setForm(prev => ({ ...prev, mainImage: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      id="main-img-upload"
                      onChange={(e) => handleImageUpload(e, 'main')}
                      className="hidden"
                    />
                    <label
                      htmlFor="main-img-upload"
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer h-full"
                    >
                      <Upload className="w-4 h-4 text-blue-400" />
                      <span>Upload</span>
                    </label>
                  </div>
                </div>
                {form.mainImage && (
                  <div className="w-20 h-20 border border-slate-850 p-1 bg-white rounded">
                    <img src={form.mainImage} alt="" className="max-h-full max-w-full object-contain mx-auto" />
                  </div>
                )}
              </div>

              {/* THUMBNAILS CAROUSEL GALLERY */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Additional Product Thumbnails</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    id="thumb-img-upload"
                    onChange={(e) => handleImageUpload(e, 'thumb')}
                    className="hidden"
                  />
                  <label
                    htmlFor="thumb-img-upload"
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-400" />
                    <span>Add Thumbnail</span>
                  </label>
                </div>
                
                {form.thumbnails.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {form.thumbnails.map((url, idx) => (
                      <div key={idx} className="relative w-16 h-16 border border-slate-800 p-1 bg-white rounded group">
                        <img src={url} alt="" className="max-h-full max-w-full object-contain mx-auto" />
                        <button
                          type="button"
                          onClick={() => handleRemoveThumbnail(idx)}
                          className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 shadow-md"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SHORT DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Key Highlights / Bullet points (one per line)</label>
                <textarea
                  rows="4"
                  placeholder="Intel J6412 Quad Core CPU&#10;8GB DDR4 RAM + 128GB SSD&#10;Thermal Printer Built-in"
                  value={form.shortDescInput}
                  onChange={(e) => setForm(prev => ({ ...prev, shortDescInput: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-4 text-xs focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* LONG DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Long Description</label>
                <textarea
                  rows="4"
                  placeholder="Professional billing terminal suitable for large-scale grocery stores..."
                  value={form.longDescription}
                  onChange={(e) => setForm(prev => ({ ...prev, longDescription: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-4 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* SPECIFICATION MAP */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Technical Specifications</label>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Spec Row
                  </button>
                </div>
                <div className="space-y-2">
                  {form.specs.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Specification Name (e.g. Processor)"
                        value={item.key}
                        onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. Intel Celeron)"
                        value={item.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(idx)}
                        className="p-2 bg-slate-950 border border-slate-800 text-red-500 hover:text-red-400 rounded-lg hover:border-red-900/50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* DETAILS AND WARRANTY */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Video URL Embed</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/embed/..."
                    value={form.videoUrl}
                    onChange={(e) => setForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Warranty Info</label>
                  <input
                    type="text"
                    placeholder="1 Year Warranty"
                    value={form.warranty}
                    onChange={(e) => setForm(prev => ({ ...prev, warranty: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* TOGGLES */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Stock Availability</p>
                    <p className="text-[10px] text-slate-500">Show as in-stock on shop</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Featured Placement</p>
                    <p className="text-[10px] text-slate-500">Place on homepage list</p>
                  </div>
                </label>
              </div>

            </form>

            {/* DRAWER FOOTER ACTIONS */}
            <div className="h-20 border-t border-slate-800 px-6 flex items-center justify-end gap-3 bg-slate-900/50">
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-lg transition"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProductsManager;
