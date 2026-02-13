import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import ImageGallery from './form/ImageGallery';
import ProductFormFields from './form/ProductFormFields';
import ProductPricing from './form/ProductPricing';
import InventorySizeManager from './form/InventorySizeManager';
import FormFooter from '../shared/FormFooter';
import { validateProduct } from '../../utils/validators';

const ProductForm = forwardRef(({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  externalValidationErrors = {},
  isEditing = false 
}, ref) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    genero: '',
    temporada: '',
    precio: '',
    precio_lista: '',
    stock: 0,
    stock: 0,
    stock_by_size: {},
    tallas: [],
    colores: [],
    imagenes: [],
    activo: true,
    destacado: false,
    ...initialData,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expose formData to parent via ref (with dependencies to prevent infinite loop)
  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    hasUnsavedChanges: () => formData.imagenes?.length > 0,
  }), [formData]);

  // Set external validation errors (only when they change)
  useEffect(() => {
    if (Object.keys(externalValidationErrors).length > 0) {
      setErrors(externalValidationErrors);
    }
  }, [externalValidationErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateProduct(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Sanitize data before sending
      const sanitizedData = {
        ...formData,
        precio: parseFloat(formData.precio) || 0,
        precio_lista: parseFloat(formData.precio_lista) || 0,
        stock: parseInt(formData.stock) || 0,
      };
      
      console.log('Sending product data:', JSON.stringify(sanitizedData, null, 2));
      await onSubmit?.(sanitizedData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ general: error.message || 'Error al guardar el producto' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormDataChange = (newData) => {
    setFormData(newData);
    // Clear errors for changed fields
    const changedFields = Object.keys(newData).filter(
      (key) => newData[key] !== formData[key]
    );
    if (changedFields.length > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        changedFields.forEach((field) => delete newErrors[field]);
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pb-32">
      {/* General Error */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400">
          <p className="font-medium">{errors.general}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
        {/* Left Column: Image Gallery (2 columns) */}
        <div className="lg:col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">
            Galería
          </h2>
          <ImageGallery
            images={formData.imagenes || []}
            onChange={(images) => handleFormDataChange({ ...formData, imagenes: images })}
          />
        </div>

        {/* Right Column: Form Fields (3 columns) */}
        <div className="lg:col-span-3 space-y-12">
          {/* Información General */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">
              Información General
            </h2>
            <ProductFormFields
              formData={formData}
              onChange={handleFormDataChange}
              errors={errors}
            />
          </div>

          {/* Precios */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">
              Precios
            </h2>
            <ProductPricing
              formData={formData}
              onChange={handleFormDataChange}
              errors={errors}
            />
          </div>

          {/* Inventario */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">
              Inventario
            </h2>
            <InventorySizeManager
              formData={formData}
              onChange={handleFormDataChange}
              errors={errors}
            />
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <FormFooter
        onCancel={onCancel}
        onSave={handleSubmit}
        saveText={isEditing ? 'Guardar Producto' : 'Crear Producto'}
        cancelText="Cancelar"
        disabled={isSubmitting}
      />
    </form>
  );
});

ProductForm.displayName = 'ProductForm';

export default ProductForm;
