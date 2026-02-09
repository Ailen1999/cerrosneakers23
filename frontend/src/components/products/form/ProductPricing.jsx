function ProductPricing({ formData, onChange, errors = {} }) {
  const handleChange = (field, value) => {
    onChange?.({ ...formData, [field]: value });
  };

  const formatPrice = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? '' : num.toFixed(2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
      {/* Precio Efectivo */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-3">
          Precio Efectivo
        </label>
        <div className="flex items-baseline gap-2">
          <span className="text-xl text-gray-500 dark:text-gray-400">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.precio || ''}
            onChange={(e) => handleChange('precio', parseFloat(e.target.value) || '')}
            onBlur={(e) => e.target.value && handleChange('precio', parseFloat(formatPrice(e.target.value)))}
            className="minimal-input flex-1 py-2 text-xl text-black"
            placeholder="0.00"
            required
          />
        </div>
        {errors.precio && (
          <p className="text-red-500 text-xs mt-1">{errors.precio}</p>
        )}
      </div>
    </div>
  );
}

export default ProductPricing;
