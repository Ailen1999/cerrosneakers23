import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';

/**
 * Custom hook for managing products state
 * @returns {Object} - Products state and operations
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Fetch all products
  const fetchProducts = useCallback(async (options = {}) => {
    const { limit = 10, page = 1, category = '', search = '' } = options;
    
    setLoading(true);
    setError(null);

    try {
      const data = await productService.getProducts({ limit, page, category, search });
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch product by ID
  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const product = await productService.getProduct(id);
      return product;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create product
  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);

    try {
      const newProduct = await productService.createProduct(productData);
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );
      return updatedProduct;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => prev - 1);
      return { success: true };
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search products
  const searchProducts = useCallback(async (query, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const data = await productService.getProducts({ search: query, limit });
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Bulk delete products
  const bulkDeleteProducts = useCallback(async (ids) => {
    setLoading(true);
    setError(null);

    try {
      await productService.bulkDeleteProducts(ids);
      setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
      setTotal((prev) => prev - ids.length);
      return { success: true };
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    total,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    searchProducts,
  };
}

export default useProducts;
