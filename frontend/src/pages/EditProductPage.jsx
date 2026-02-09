import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Breadcrumb from '../components/shared/Breadcrumb';
import ProductForm from '../components/products/ProductForm';
import { useProducts } from '../hooks/useProducts';

function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchProductById, updateProduct } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Productos', path: '/admin/products' },
    { label: `Editar: ${product?.nombre || 'Cargando...'}` },
  ];

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err);
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, fetchProductById]);

  const handleSubmit = async (formData) => {
    try {
      setError(null);
      await updateProduct(id, formData);
      // Redirect to products page on success
      navigate('/admin/products', {
        state: { message: 'Producto actualizado exitosamente', type: 'success' },
      });
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  if (loading) {
    return (
      <MainLayout pageTitle="Editar Producto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-[#1E1E1E] shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">Cargando producto...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error && !product) {
    return (
      <MainLayout pageTitle="Editar Producto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 p-6 text-red-700 dark:text-red-400">
            <h2 className="text-lg font-bold mb-2">Error al cargar el producto</h2>
            <p>{error.message || 'No se pudo cargar la información del producto'}</p>
            <button
              onClick={() => navigate('/admin/products')}
              className="mt-4 px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Volver a Productos
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Editar Producto">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-black dark:text-white mb-2">
            Editar Producto
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Actualiza la información del producto
          </p>
          <div className="border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400">
            <p className="font-medium">
              {error.message || 'Error al actualizar el producto'}
            </p>
          </div>
        )}

        {product && (
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={true}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default EditProductPage;
