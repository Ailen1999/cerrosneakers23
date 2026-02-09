import React, { useState } from 'react';
import { orderService } from '../../services/orderService';

function OrderDetailsModal({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`¿Estás seguro de cambiar el estado a "${newStatus}"?`)) return;
    
    setIsUpdating(true);
    try {
      await orderService.updateStatus(order.id, newStatus);
      setStatus(newStatus);
      onUpdate(order.id, newStatus);
      alert('Estado actualizado correctamente');
    } catch (error) {
      console.error("Error updating status:", error);
      const msg = error.response?.data?.error || error.message || 'Error desconocido';
      alert(`Error: ${msg} \nStatus: ${error.response?.status}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const [isEditingData, setIsEditingData] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    customer_phone: order.customer_phone,
    customer_address: order.customer_address,
    notes: order.notes || ''
  });

  const handleSaveData = async () => {
      setIsUpdating(true);
      try {
        await orderService.updateOrder(order.id, formData);
        onUpdate(order.id, null); // Just trigger refresh 
        setIsEditingData(false);
        alert('Datos actualizados correctamente');
        window.location.reload(); 
      } catch (error) {
        console.error(error);
        alert('Error al actualizar datos');
      } finally {
        setIsUpdating(false);
      }
  };

  const statusOptions = [
    'Pendiente', 'Pagado', 'En Preparación', 'Enviado', 'Entregado', 'Cancelado'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold dark:text-white">Pedido #{order.id}</h2>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          
          {/* Status Control */}
          <div className="bg-gray-50 dark:bg-black p-4 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">Estado Actual</p>
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                status === 'Cancelado' ? 'bg-red-100 text-red-700' :
                status === 'Entregado' ? 'bg-green-100 text-green-700' :
                status === 'Pagado' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {status}
              </span>
            </div>
            <div className="flex bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800">
               <select 
                 disabled={isUpdating}
                 value={status} 
                 onChange={(e) => handleStatusChange(e.target.value)}
                 className="text-sm border-none focus:ring-0 bg-transparent py-2 pl-3 pr-8 dark:text-white cursor-pointer"
               >
                 {statusOptions.map(opt => (
                   <option key={opt} value={opt}>{opt}</option>
                 ))}
               </select>
            </div>
          </div>




          {/* Customer Info */}
          <div className="flex justify-between items-center bg-gray-50 dark:bg-black p-3 mb-4">
             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Datos del Pedido</h3>
             <button 
               onClick={() => setIsEditingData(!isEditingData)}
               className="text-xs font-bold uppercase tracking-widest text-black dark:text-white border-b border-black dark:border-white pb-0.5 hover:opacity-50"
             >
               {isEditingData ? 'Cancelar' : 'Editar Datos'}
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Cliente</h3>
              <div className="space-y-4">
                {isEditingData ? (
                    <>
                       <input 
                         className="w-full text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] dark:text-white p-2"
                         value={formData.customer_name}
                         onChange={e => setFormData({...formData, customer_name: e.target.value})}
                         placeholder="Nombre"
                       />
                       <input 
                         className="w-full text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] dark:text-white p-2"
                         value={formData.customer_email}
                         onChange={e => setFormData({...formData, customer_email: e.target.value})}
                         placeholder="Email"
                       />
                        <input 
                         className="w-full text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] dark:text-white p-2"
                         value={formData.customer_phone}
                         onChange={e => setFormData({...formData, customer_phone: e.target.value})}
                         placeholder="Teléfono"
                       />
                    </>
                ) : (
                    <>
                        <p className="text-sm font-bold dark:text-white">{order.customer_name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer_email}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer_phone}</p>
                    </>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Envío</h3>
               <div className="space-y-4">
                {isEditingData ? (
                    <>
                        <textarea 
                             className="w-full text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] dark:text-white p-2"
                             rows="3"
                             value={formData.customer_address}
                             onChange={e => setFormData({...formData, customer_address: e.target.value})}
                             placeholder="Dirección"
                        />
                        <textarea 
                             className="w-full text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E] dark:text-white p-2"
                             rows="2"
                             value={formData.notes}
                             onChange={e => setFormData({...formData, notes: e.target.value})}
                             placeholder="Notas"
                        />
                    </>
                ) : (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer_address}</p>
                      {order.notes && (
                        <div className="mt-4">
                          <p className="text-[10px] uppercase font-bold text-gray-400">Notas</p>
                          <p className="text-sm italic text-gray-500">{order.notes}</p>
                        </div>
                      )}
                    </>
                )}
               </div>
            </div>
          </div>
          
          {isEditingData && (
              <div className="flex justify-end pt-4">
                  <button 
                    disabled={isUpdating}
                    onClick={handleSaveData}
                    className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 text-xs uppercase font-bold tracking-widest hover:opacity-80 disabled:opacity-50"
                  >
                      {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
              </div>
          )}

          {/* Items Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Productos</h3>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-black text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3 text-center">Cant.</th>
                  <th className="px-4 py-3 text-right">Precio</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 font-medium dark:text-white">{item.product_name}</td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">${item.unit_price}</td>
                    <td className="px-4 py-3 text-right font-bold dark:text-white">${item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200 dark:border-gray-800">
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-right text-xs uppercase font-bold text-gray-500">Total</td>
                  <td className="px-4 py-4 text-right text-lg font-bold dark:text-white">${order.total_amount}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
