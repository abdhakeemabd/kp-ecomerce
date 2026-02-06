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

  // Load products from localStorage on mount and sync with hardcoded data
  useEffect(() => {
    const savedProducts = localStorage.getItem('adminProducts');
    const initialReversed = [...initialProducts].reverse();

    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        let merged = Array.isArray(parsedProducts) ? [...parsedProducts] : [];
        let hasNew = false;

        // Force Sync: Ensure every product in initialProducts (the code) exists in merged
        // We use ID as the unique key to prevent duplicates and handle products with same title
        initialProducts.forEach(initial => {
          const exists = merged.some(p => p.id.toString() === initial.id.toString());
          if (!exists) {
            merged.push(initial); 
            hasNew = true;
          }
        });

        if (hasNew) {
          setProducts(merged);
          localStorage.setItem('adminProducts', JSON.stringify(merged));
        } else {
          setProducts(parsedProducts);
        }
      } catch (e) {
        console.error('Failed to sync products:', e);
        setProducts(initialReversed);
      }
    } else {
      setProducts(initialReversed);
      localStorage.setItem('adminProducts', JSON.stringify(initialReversed));
    }

    initialLoadDone.current = true;
  }, []);


  // Save products to localStorage whenever they change
  useEffect(() => {
    if (initialLoadDone.current && products.length > 0) {
      localStorage.setItem('adminProducts', JSON.stringify(products));
    }
  }, [products]);

  // Sync state between tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'adminProducts' && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Storage sync error:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

  const addProduct = async (productData) => {
    try {
      setLoading(true);
      const newProduct = { ...productData, id: Date.now().toString() };
      setProducts([newProduct, ...products]);
      return { success: true, data: newProduct };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      setLoading(true);
      const updatedProducts = products.map(p =>
        p.id.toString() === productId.toString() ? { ...p, ...productData } : p
      );
      setProducts(updatedProducts);
      return { success: true, data: productData };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setLoading(true);
      const filteredProducts = products.filter(p => p.id.toString() !== productId.toString());
      setProducts(filteredProducts);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Helper for LIFO sorting (Newest ID First)
  const getSortedProducts = (productList) => {
    return [...productList].sort((a, b) => {
      const idA = typeof a.id === 'string' ? parseInt(a.id) : a.id;
      const idB = typeof b.id === 'string' ? parseInt(b.id) : b.id;
      return idB - idA;
    });
  };

  const sortedProducts = getSortedProducts(products);

  const getProductById = (productId) => {
    return products.find(p => p.id.toString() === productId.toString());
  };

  const getProductsByCategory = (category) => {
    return sortedProducts.filter(p => 
      p.category?.toLowerCase() === category.toLowerCase()
    );
  };

  const searchProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    return sortedProducts.filter(p =>
      p.title?.toLowerCase().includes(lowerQuery) ||
      p.name?.toLowerCase().includes(lowerQuery) ||
      p.content?.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery)
    );
  };

  const resetProducts = () => {
    const reversedInitial = [...initialProducts].reverse();
    setProducts(reversedInitial);
    localStorage.setItem('adminProducts', JSON.stringify(reversedInitial));
  };

  const value = {
    products: sortedProducts,
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
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};

export default ProductContext;
