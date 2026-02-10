import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { orderService } from '../services/orderService';
import OrderDetailsModal from '../components/orders/OrderDetailsModal';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: ''
  });
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders(filters);
      setOrders(data.data || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const totalPages = Math.ceil(total / filters.limit);

  const handleViewOrder = async (order) => {
    try {
      // Fetch full details (items, address, notes)
      const fullOrder = await orderService.getOrderById(order.id);
      setSelectedOrder(fullOrder);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      alert("Error al cargar detalles del pedido");
    }
  };

  const handleUpdateOrder = (orderId, newStatus) => {
    // Update local state without refetching all
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await orderService.deleteOrder(orderId);
      // Remove from local state
      setOrders(orders.filter(o => o.id !== orderId));
      setTotal(total - 1);
      alert('Pedido eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error al eliminar el pedido. Por favor intenta nuevamente.');
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const styles = {
      'Pendiente': 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30',
      'Enviado': 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30',
      'Entregado': 'bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30',
      'Cancelado': 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30',
    };
    return styles[status] || 'bg-gray-50 text-gray-700 border border-gray-100';
  };

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex-1"></div>
            <Link to="/admin/orders/new" className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg">
              <span className="material-symbols-outlined text-[16px]">add</span>
              NUEVO PEDIDO
            </Link>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-[#1E1E1E] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#252525] border-b border-gray-200 dark:border-gray-800">
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">ID Pedido</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Cliente</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Fecha</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 text-right">Total</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 text-center">Estado</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="p-10 text-center text-gray-500">Cargando pedidos...</td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-10 text-center text-gray-500">No hay pedidos registrados.</td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors group">
                        <td className="p-5">
                          <span className="font-medium text-black dark:text-white">#ORD-{order.id}</span>
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="font-display font-medium text-black dark:text-white">{order.customer_name}</span>
                            <span className="text-xs text-gray-400">{order.customer_email || order.customer_phone}</span>
                          </div>
                        </td>
                        <td className="p-5 text-gray-600 dark:text-gray-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-5 text-right font-medium text-black dark:text-white">
                          ${order.total_amount.toFixed(2)}
                        </td>
                        <td className="p-5 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">

                            <button onClick={() => handleViewOrder(order)} className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors" title="Editar">
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>

                            <button onClick={() => handleDeleteOrder(order.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition-colors" title="Eliminar">
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1E1E1E]">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando <span className="font-medium text-black dark:text-white">{(filters.page - 1) * filters.limit + 1}</span> a <span className="font-medium text-black dark:text-white">{Math.min(filters.page * filters.limit, total)}</span> de <span className="font-medium text-black dark:text-white">{total}</span> pedidos
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-sm text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {/* Simple pagination logic for now */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                   <button 
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-sm font-medium ${
                      filters.page === p 
                      ? 'text-black dark:text-white bg-gray-50 dark:bg-gray-800' 
                      : 'text-gray-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button 
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= totalPages}
                  className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-sm text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <OrderDetailsModal 
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdateOrder}
        />
      )}
    </MainLayout>
  );
}

export default OrdersPage;
