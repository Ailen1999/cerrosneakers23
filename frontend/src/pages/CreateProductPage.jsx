import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Breadcrumb from '../components/shared/Breadcrumb';
import ProductForm from '../components/products/ProductForm';
import { useProducts } from '../hooks/useProducts';
import { useToast, ToastContainer } from '../components/shared/Toast';
import { validateProduct } from '../utils/validators';

function CreateProductPage() {
  const navigate = useNavigate();
  const { createProduct } = useProducts();
  const { toasts, showToast, removeToast } = useToast();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const formRef = useRef(null);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Productos', path: '/admin/products' },
    { label: 'Nuevo Producto' },
  ];
  
  // Check if form has unsaved changes
  const checkUnsavedChanges = () => {
    return formRef.current?.hasUnsavedChanges() || false;
  };

  // Warn before closing/refreshing browser
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (checkUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleSubmit = async (formDataToSubmit) => {
    try {
      setError(null);
      await createProduct(formDataToSubmit);
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
    if (checkUnsavedChanges()) {
      setPendingNavigation('/admin/products');
      setShowConfirmDialog(true);
    } else {
      // Use window.location for reliable navigation
      window.location.href = '/admin/products';
    }
  };

  // Handle "Yes, Save" from confirmation dialog
  const handleSaveAndProceed = async () => {
    const formData = formRef.current?.getFormData();
    if (!formData) {
      if (pendingNavigation) {
        navigate(pendingNavigation);
      }
      setShowConfirmDialog(false);
      return;
    }

    // Validate form
    const errors = validateProduct(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setShowConfirmDialog(false);
      showToast('Por favor complete los campos obligatorios', 'error');
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If valid, save and proceed
    try {
      await createProduct(formData);
      showToast('Producto creado exitosamente', 'success');
      if (pendingNavigation) {
        setTimeout(() => navigate(pendingNavigation), 500);
      }
      setShowConfirmDialog(false);
    } catch (err) {
      setError(err);
      setShowConfirmDialog(false);
      showToast('Error al guardar el producto', 'error');
    }
  };

  // Handle "No, Discard" from confirmation dialog
  const handleDiscardAndProceed = () => {
    setShowConfirmDialog(false);
    // Use window.location for immediate navigation, bypassing React state updates
    if (pendingNavigation) {
      window.location.href = pendingNavigation;
    }
  };

  return (
    <MainLayout pageTitle="Crear Producto">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">
              ¿Desea guardar el producto?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tiene cambios sin guardar. Si no los guarda, se perderán.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDiscardAndProceed}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                No, Descartar
              </button>
              <button
                onClick={handleSaveAndProceed}
                className="flex-1 px-4 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded hover:opacity-80 transition-opacity"
              >
                Sí, Guardar
              </button>
            </div>
          </div>
        </div>
      )}

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
          ref={formRef}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          externalValidationErrors={validationErrors}
          isEditing={false}
        />
      </div>
    </MainLayout>
  );
}

export default CreateProductPage;

