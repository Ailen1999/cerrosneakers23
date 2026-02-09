import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProductTable from '../components/products/ProductTable';
import Pagination from '../components/shared/Pagination';
import Modal from '../components/shared/Modal';
import ErrorMessage from '../components/shared/ErrorMessage';
import { useToast, ToastContainer } from '../components/shared/Toast';
import { useProducts } from '../hooks/useProducts';

function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading, error, total, fetchProducts, deleteProduct, bulkDeleteProducts } = useProducts();
  const { toasts, showToast, removeToast } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, isBulk: false });
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchProducts({
      limit: itemsPerPage,
      page: currentPage,
      search: searchQuery,
    });
    // Reset selection when products change/page change
    setSelectedIds([]);
  }, [currentPage, itemsPerPage, searchQuery, fetchProducts]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, productId: id, isBulk: false });
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.length === 0) return;
    setDeleteModal({ isOpen: true, productId: null, isBulk: true });
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteModal.isBulk) {
        await bulkDeleteProducts(selectedIds);
        showToast(`${selectedIds.length} productos eliminados exitosamente`, 'success');
        setSelectedIds([]);
      } else {
        await deleteProduct(deleteModal.productId);
        showToast('Producto eliminado exitosamente', 'success');
      }
      setDeleteModal({ isOpen: false, productId: null, isBulk: false });
    } catch (err) {
      console.error('Error deleting products:', err);
      showToast(deleteModal.isBulk ? 'Error al eliminar los productos' : 'Error al eliminar el producto', 'error');
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <MainLayout pageTitle="Gestión de Productos" onSearch={handleSearch}>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="flex flex-col gap-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2">
            {/* Bulk Delete Button */}
            {selectedIds.length > 0 && (
              <button 
                onClick={handleBulkDeleteClick}
                className="px-4 py-2 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">delete</span>
                Eliminar ({selectedIds.length})
              </button>
            )}
          </div>
          <button
            onClick={() => navigate('/admin/products/create')}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
          >
            <span className="material-symbols-outlined notranslate text-[16px]">add</span>
            Añadir Producto
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error.message || 'Error al cargar productos'}
            type="error"
          />
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white dark:bg-[#1E1E1E] shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">Cargando productos...</p>
          </div>
        ) : (
          <>
            {/* Products Table */}
            <ProductTable
              products={products}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />

            {/* Pagination */}
            {total > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, productId: null, isBulk: false })}
          onConfirm={handleDeleteConfirm}
          title={deleteModal.isBulk ? "Eliminar Productos" : "Eliminar Producto"}
          message={deleteModal.isBulk 
            ? `¿Estás seguro de que deseas eliminar los ${selectedIds.length} productos seleccionados? Esta acción no se puede deshacer.`
            : "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      </div>
    </MainLayout>
  );
}

export default ProductsPage;
