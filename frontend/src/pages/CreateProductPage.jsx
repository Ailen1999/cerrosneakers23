import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Breadcrumb from '../components/shared/Breadcrumb';
import ProductForm from '../components/products/ProductForm';
import { useProducts } from '../hooks/useProducts';
import { useToast, ToastContainer } from '../components/shared/Toast';

function CreateProductPage() {
  const navigate = useNavigate();
  const { createProduct } = useProducts();
  const { toasts, showToast, removeToast } = useToast();
  const [error, setError] = useState(null);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Productos', path: '/admin/products' },
    { label: 'Nuevo Producto' },
  ];

  const handleSubmit = async (formData) => {
    try {
      setError(null);
      await createProduct(formData);
      console.log('Product created successfully');
      // Show toast before navigating
      showToast('Producto creado exitosamente', 'success');
      // Navigate after toast is visible (1.5 seconds) - using window.location for full page reload
      setTimeout(() => {
        window.location.href = '/admin/products';
      }, 1500);
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err);
      // Don't throw - let the form handle the error display
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  return (
    <MainLayout pageTitle="Crear Producto">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-black dark:text-white mb-2">
            Nuevo Producto
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Completa la información del producto para agregarlo al catálogo
          </p>
          <div className="border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400">
            <p className="font-medium">
              {error.message || 'Error al crear el producto'}
            </p>
          </div>
        )}

        <ProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={false}
        />
      </div>
    </MainLayout>
  );
}

export default CreateProductPage;
