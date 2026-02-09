function InventorySizeManager({ formData, onChange, errors = {} }) {
  const handleChange = (field, value) => {
    onChange?.({ ...formData, [field]: value });
  };

  // Determine available sizes based on category
  const getAvailableSizes = () => {
    const category = formData.categoria?.toLowerCase();
    
    // For footwear, show numeric sizes
    if (category === 'calzado' || category === 'zapatillas' || category === 'zapatos') {
      return ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
    }
    
    // For clothing and other categories, show letter sizes
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  };

  const availableSizes = getAvailableSizes();

  const toggleSize = (size) => {
    const currentSizes = formData.tallas || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    
    // If removing size, remove from stock_by_size
    let newStockBySize;
    if (currentSizes.includes(size)) {
        newStockBySize = { ...(formData.stock_by_size || {}) };
        delete newStockBySize[size];
    } else {
        // If adding size, initialize with 0
        newStockBySize = { ...(formData.stock_by_size || {}), [size]: 0 };
    }
    
    // Calculate new total stock
    const newTotalStock = Object.values(newStockBySize).reduce((sum, qty) => sum + (qty || 0), 0);
    
    onChange?.({
        ...formData,
        tallas: newSizes,
        stock_by_size: newStockBySize,
        stock: newTotalStock
    });
  };

  const handleStockChange = (size, quantity) => {
      const newStockBySize = { 
          ...(formData.stock_by_size || {}),
          [size]: quantity
      };
      
      // Calculate total stock
      const totalStock = Object.values(newStockBySize).reduce((sum, qty) => sum + (qty || 0), 0);
      
      onChange?.({
          ...formData,
          stock_by_size: newStockBySize,
          stock: totalStock
      });
  };

  return (
    <div className="space-y-6">
      {/* Tabla de Tallas e Inventario */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-[#252525]">
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="p-3 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 w-12">
                {/* Checkbox header */}
              </th>
              <th className="p-3 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Talla
              </th>
              <th className="p-3 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 text-right">
                Stock
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {availableSizes.map((size) => {
              const isSelected = (formData.tallas || []).includes(size);
              const sizeStock = (formData.stock_by_size || {})[size] || 0;
              
              return (
                <tr
                  key={size}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-gray-50 dark:bg-[#1E1E1E]'
                      : 'hover:bg-gray-50 dark:hover:bg-[#1E1E1E]/50'
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSize(size)}
                      className="w-4 h-4 border border-gray-300 dark:border-gray-700 rounded-sm cursor-pointer"
                    />
                  </td>
                  <td className="p-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {size}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {isSelected && (
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={sizeStock}
                        onChange={(e) => handleStockChange(size, parseInt(e.target.value) || 0)}
                        className="minimal-input w-24 py-1 text-right text-sm text-black"
                        placeholder="0"
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {errors.stock && (
        <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
      )}
      {errors.tallas && (
        <p className="text-red-500 text-xs mt-1">{errors.tallas}</p>
      )}
    </div>
  );
}

export default InventorySizeManager;
