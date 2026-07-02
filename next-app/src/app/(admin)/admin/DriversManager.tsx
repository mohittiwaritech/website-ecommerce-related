"use client";
import React, { useState, useEffect } from 'react';
import { 
  getDrivers, 
  saveDriver, 
  deleteDriver 
} from '@/services/dbService';
import { storage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Upload, 
  Link,
  FolderOpen
} from 'lucide-react';

const DriversManager = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Drawer/Modal State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadIndex, setUploadIndex] = useState(null); // tracking which link file is uploading

  // Form State
  const [form, setForm] = useState({
    id: '',
    name: '',
    image: '',
    desc: '',
    links: [] // array of { label: '', url: '' }
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getDrivers();
      setDrivers(data);
    } catch (error) {
      console.error("Error loading drivers:", error);
      toast.error("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDrawer = (driver = null) => {
    if (driver) {
      setEditingDriver(driver);
      setForm({
        id: driver.id || '',
        name: driver.name || '',
        image: driver.image || '',
        desc: driver.desc || '',
        links: driver.links || []
      });
    } else {
      setEditingDriver(null);
      setForm({
        id: '',
        name: '',
        image: '',
        desc: '',
        links: [{ label: '', url: '' }]
      });
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingDriver(null);
  };

  // Image Upload helper
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `drivers/images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm(prev => ({ ...prev, image: url }));
      toast.success("Driver preview image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // File Upload helper for download links
  const handleDriverFileUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadIndex(index);
    try {
      const storageRef = ref(storage, `drivers/files/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      const updatedLinks = [...form.links];
      updatedLinks[index].url = url;
      setForm(prev => ({ ...prev, links: updatedLinks }));
      
      toast.success("Driver ZIP/EXE file uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("File upload failed");
    } finally {
      setUploading(false);
      setUploadIndex(null);
    }
  };

  // Dynamic Download Links List
  const handleAddLinkRow = () => {
    setForm(prev => ({
      ...prev,
      links: [...prev.links, { label: '', url: '' }]
    }));
  };

  const handleRemoveLinkRow = (index) => {
    setForm(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleLinkChange = (index, field, val) => {
    const updated = [...form.links];
    updated[index][field] = val;
    setForm(prev => ({ ...prev, links: updated }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.desc) {
      toast.error("Name and Description are required");
      return;
    }

    // Filter out empty links
    const activeLinks = form.links.filter(l => l.label.trim() && l.url.trim());

    const driverPayload = {
      name: form.name,
      image: form.image,
      desc: form.desc,
      links: activeLinks
    };

    if (form.id) {
      driverPayload.id = form.id;
    }

    try {
      await saveDriver(driverPayload);
      toast.success(form.id ? "Driver updated successfully!" : "Driver added successfully!");
      handleCloseDrawer();
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save driver info");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this driver entry?")) {
      try {
        await deleteDriver(id);
        toast.success("Driver entry deleted");
        loadData();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete driver");
      }
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.name?.toLowerCase().includes(search.toLowerCase()) || 
    d.desc?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        {/* SEARCH */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 inset-y-0 my-auto text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search drivers/hardware..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2 text-xs w-full sm:w-64 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={() => handleOpenDrawer()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider transition w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      {/* DRIVERS TABLE */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
          {/* Header Skeleton */}
          <div className="bg-slate-950/60 border-b border-slate-800 p-4 flex gap-6">
            <div className="h-3 bg-slate-800 rounded w-20"></div>
            <div className="h-3 bg-slate-800 rounded flex-1"></div>
            <div className="h-3 bg-slate-800 rounded flex-1"></div>
            <div className="h-3 bg-slate-800 rounded w-24"></div>
            <div className="h-3 bg-slate-800 rounded w-32"></div>
          </div>
          {/* Rows Skeleton */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-b border-slate-800/50 p-4 flex gap-6 items-center">
              <div className="h-12 w-12 bg-slate-800 rounded"></div>
              <div className="h-4 bg-slate-800 rounded flex-1"></div>
              <div className="h-3 bg-slate-800 rounded flex-1"></div>
              <div className="h-3 bg-slate-800 rounded w-20"></div>
              <div className="h-8 w-20 bg-slate-800 rounded-lg ml-auto"></div>
            </div>
          ))}
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded-2xl text-slate-500">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          No driver kits configured. Click "Add Driver" to create one.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 w-20">Preview</th>
                  <th className="p-4">Hardware Name</th>
                  <th className="p-4">Downloads Offered</th>
                  <th className="p-4 w-24 text-center">Links</th>
                  <th className="p-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredDrivers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/20 text-slate-300">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded bg-white p-1 border border-slate-700 flex items-center justify-center">
                        <img
                          src={d.image}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=Driver"; }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{d.name}</div>
                    </td>
                    <td className="p-4 text-slate-400">
                      <span className="line-clamp-1">{d.desc}</span>
                    </td>
                    <td className="p-4 text-center font-bold text-blue-400">
                      {d.links?.length || 0} files
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDrawer(d)}
                        className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
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
            
            {/* HEADER */}
            <div className="h-20 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50">
              <div>
                <h3 className="font-bold text-white text-md">
                  {editingDriver ? 'Edit Driver Setup' : 'Add New Driver Setup'}
                </h3>
                <p className="text-slate-400 text-xs">
                  Configure driver previews and download links
                </p>
              </div>
              <button 
                onClick={handleCloseDrawer}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-6 space-y-6">
              
              {/* HARDWARE NAME */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hardware Printer Name</label>
                <input
                  type="text"
                  required
                  placeholder="H58 Receipt Printer"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Short description (e.g. Windows Driver, Linux Driver and SDK Kit)</label>
                <input
                  type="text"
                  required
                  placeholder="Windows Driver, Linux SDK, and Manuals"
                  value={form.desc}
                  onChange={(e) => setForm(prev => ({ ...prev, desc: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* PREVIEW IMAGE */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Printer Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={form.image}
                    onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      id="driver-preview-upload"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="driver-preview-upload"
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold uppercase cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-blue-400" />
                      <span>Upload</span>
                    </label>
                  </div>
                </div>
                {form.image && (
                  <div className="w-16 h-16 border border-slate-850 p-1 bg-white rounded">
                    <img src={form.image} alt="" className="max-h-full max-w-full object-contain mx-auto" />
                  </div>
                )}
              </div>

              {/* DYNAMIC DOWNLOAD LINKS */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Download Packages & Links</label>
                  <button
                    type="button"
                    onClick={handleAddLinkRow}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Package
                  </button>
                </div>

                <div className="space-y-4">
                  {form.links.map((link, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkRow(idx)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-slate-500">Label (e.g. Windows Driver)</label>
                          <input
                            type="text"
                            required
                            placeholder="Windows Driver Setup"
                            value={link.label}
                            onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-slate-500">Upload Zip/Exe File or Paste URL</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="https://..."
                              value={link.url}
                              onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                            />
                            <div className="relative">
                              <input
                                type="file"
                                id={`file-upload-${idx}`}
                                onChange={(e) => handleDriverFileUpload(e, idx)}
                                className="hidden"
                              />
                              <label
                                htmlFor={`file-upload-${idx}`}
                                className="flex items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl cursor-pointer"
                              >
                                {uploading && uploadIndex === idx ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Upload className="w-4 h-4 text-blue-400" />
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </form>

            {/* DRAWER FOOTER */}
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

export default DriversManager;
