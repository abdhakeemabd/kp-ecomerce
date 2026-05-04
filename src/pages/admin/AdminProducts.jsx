import React, { useState, useEffect } from 'react';
import AdminLayout from '../../component/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Search, Image as ImageIcon, 
  X, Package, Tag, Layers, DollarSign, Database
} from 'lucide-react';
import { productsAPI } from '../../utils/api';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image_url: '',
    discount: 0,
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState('');

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setFormData({...formData, imageFile: file, image_url: base64});
      setImagePreview(base64);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
      } else {
        await productsAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image_url: product.image_url,
      discount: product.discount || 0,
      imageFile: null
    });
    setImagePreview(product.image_url || '');
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image_url: '',
      discount: 0,
      imageFile: null
    });
    setImagePreview('');
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Products Catalog</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your store inventory and items</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 font-bold"
          >
            <Plus size={20} />
            <span>Add New Product</span>
          </button>
        </div>

        <div className="relative group max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by name, category or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-gray-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 shadow-sm dark:text-white text-sm"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 rounded-3xl bg-white dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={product.id} 
                className="glass-card rounded-[2rem] overflow-hidden group border border-gray-100 dark:border-gray-800"
              >
                <div className="relative h-56 bg-gray-100 dark:bg-gray-900">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="text-gray-300 dark:text-gray-700" size={40} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest dark:text-white shadow-sm">
                      {product.category || 'General'}
                    </span>
                  </div>
                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-rose-500 text-white px-2.5 py-1 rounded-xl text-xs font-black shadow-lg shadow-rose-500/20">
                      -{product.discount}%
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2.5 bg-white rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2.5 bg-white rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold dark:text-white truncate group-hover:text-indigo-500 transition-colors">{product.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed h-8">
                    {product.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Price</span>
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">${product.price}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Stock</span>
                      <span className={`text-sm font-bold ${product.stock < 10 ? 'text-rose-500' : 'dark:text-white'}`}>{product.stock} pcs</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none"
              >
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col border border-gray-100 dark:border-gray-800">
                  <div className="p-8 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                    <div>
                      <h2 className="text-2xl font-black dark:text-white flex items-center">
                        <Package className="mr-3 text-indigo-500" />
                        {editingProduct ? 'Update Product' : 'Add New Item'}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Fill in the details below to save the product</p>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-3 rounded-2xl bg-white dark:bg-gray-800 text-gray-400 hover:text-rose-500 transition-colors shadow-sm"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block ml-1">Product Name</label>
                        <div className="relative group">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" size={18} />
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-12 pr-6 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            placeholder="e.g. Premium Cotton T-Shirt"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block ml-1">Description</label>
                        <textarea
                          required
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[120px]"
                          placeholder="Tell us about this product..."
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block ml-1">Price ($)</label>
                        <div className="relative group">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" size={18} />
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full pl-12 pr-6 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block ml-1">Initial Stock</label>
                        <div className="relative group">
                          <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" size={18} />
                          <input
                            type="number"
                            required
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="w-full pl-12 pr-6 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block ml-1">Category</label>
                        <div className="relative group">
                          <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" size={18} />
                          <input
                            type="text"
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full pl-12 pr-6 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            placeholder="Electronics, Apparel..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block ml-1">Discount (%)</label>
                        <div className="relative group">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" size={18} />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                            className="w-full pl-12 pr-6 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block ml-1">Product Media</label>
                        <div className="flex items-center space-x-6">
                          <div className="w-32 h-32 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700">
                            {imagePreview ? (
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="text-gray-300" size={32} />
                            )}
                          </div>
                          <div className="flex-1">
                            <label className="inline-flex items-center px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl text-sm font-bold cursor-pointer hover:bg-indigo-100 transition-colors">
                              <Plus size={18} className="mr-2" />
                              Upload Image
                              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                            <p className="text-[10px] text-gray-500 mt-2">Max size: 5MB. Formats: JPG, PNG, WEBP</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-6">
                      <button
                        type="submit"
                        className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
                      >
                        {editingProduct ? 'Save Changes' : 'Create Product'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-[1.5rem] font-bold hover:bg-gray-200 transition-all"
                      >
                        Discard
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
export default AdminProducts;
