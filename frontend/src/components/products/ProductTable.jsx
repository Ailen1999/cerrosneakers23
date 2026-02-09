import { useState } from 'react';
import ProductTableRow from './ProductTableRow';

function ProductTable({ products, selectedIds, onSelect, onSelectAll, onEdit, onDelete, onSort }) {
  const [sortColumn, setSortColumn] = useState(null);

  const handleSort = (column) => {
    setSortColumn(column);
    if (onSort) {
      onSort(column);
    }
  };

  const isAllSelected = products.length > 0 && selectedIds.length === products.length;

  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
        <span className="material-symbols-outlined notranslate text-gray-300 dark:text-gray-700 text-5xl mb-4">
          inventory_2
        </span>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No se encontraron productos
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E1E1E] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#252525] border-b border-gray-200 dark:border-gray-800">
              <th className="p-5 w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-white dark:checked:border-white"
                />
              </th>
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Imagen
              </th>
              <th
                className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-white"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Nombre
                  <span className="material-symbols-outlined notranslate text-[14px]">unfold_more</span>
                </div>
              </th>
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Categoría
              </th>
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 text-right">
                Efectivo
              </th>
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 text-right">
                Crédito
              </th>
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 text-center">
                Estado
              </th>
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                isSelected={selectedIds.includes(product.id)}
                onSelect={onSelect}
                onEdit={() => onEdit(product.id)}
                onDelete={() => onDelete(product.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;
