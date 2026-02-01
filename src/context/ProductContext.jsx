import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { products as initialProducts } from '../data/products';
import axios from 'axios';

const ProductContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://z71mwq0q-8000.inc1.devtunnels.ms';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const initialLoadDone = useRef(false);

  // Load products from localStorage on mount only
  useEffect(() => {
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error('Failed to parse products from localStorage:', e);
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
      localStorage.setItem('adminProducts', JSON.stringify(initialProducts));
    }
    initialLoadDone.current = true;
  }, []);

  // Save products to localStorage whenever they change (after initial load)
  useEffect(() => {
    if (initialLoadDone.current && products.length > 0) {
      localStorage.setItem('adminProducts', JSON.stringify(products));
    }
  }, [products]);

  // Listen for storage changes from other tabs (native browser event only)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only respond to changes to 'adminProducts' key from OTHER tabs
      if (e.key === 'adminProducts' && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Failed to parse products from storage event:', err);
        }
      }
    };

    // The 'storage' event only fires in OTHER tabs, not the current one
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fetch products from API (optional)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/api/v1/products`);
      setProducts(response.data);
      localStorage.setItem('adminProducts', JSON.stringify(response.data));

      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Add new product
  const addProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);

      const newProduct = {
        ...productData,
        id: Date.now().toString(),
      };

      setProducts([...products, newProduct]);

      // Optional: Sync with backend API
      // await axios.post(`${API_BASE_URL}/api/v1/products`, newProduct);

      return { success: true, data: newProduct };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update existing product
  const updateProduct = async (productId, productData) => {
    try {
      setLoading(true);
      setError(null);

      const updatedProducts = products.map(p =>
        p.id.toString() === productId.toString() ? { ...p, ...productData } : p
      );
      setProducts(updatedProducts);

      // Optional: Sync with backend API
      // await axios.put(`${API_BASE_URL}/api/v1/products/${productId}`, productData);

      return { success: true, data: productData };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);

      const filteredProducts = products.filter(p => p.id.toString() !== productId.toString());
      setProducts(filteredProducts);

      // Optional: Sync with backend API
      // await axios.delete(`${API_BASE_URL}/api/v1/products/${productId}`);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get product by ID
  const getProductById = (productId) => {
    return products.find(p => p.id.toString() === productId.toString());
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter(p => 
      p.category?.toLowerCase() === category.toLowerCase()
    );
  };

  // Search products
  const searchProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
      p.title?.toLowerCase().includes(lowerQuery) ||
      p.name?.toLowerCase().includes(lowerQuery) ||
      p.content?.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery)
    );
  };

  // Reset to initial products
  const resetProducts = () => {
    setProducts(initialProducts);
    localStorage.setItem('adminProducts', JSON.stringify(initialProducts));
  };

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    searchProducts,
    resetProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;
