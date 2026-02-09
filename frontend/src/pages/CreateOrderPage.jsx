import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService'; // Need to create/expose this

function CreateOrderPage() {
  const navigate = useNavigate();
  
  // Form State
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  });
  
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  
  // Product Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Calculated Totals
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const shipping = 0; // Hardcoded for now
  const total = subtotal + shipping;

  // Search Products Debounced (simulated)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          // Assuming productService.getProducts supports 'search' param
          // We need to import axios directly or expose a service method nicely.
          // For now, let's assume we can use a fetch or duplicate logic if service not ready.
          // BUT, we should use the service.
          const response = await productService.getProducts({ search: searchQuery, limit: 5 });
          setSearchResults(response.products || []);
        } catch (error) {
          console.error("Error searching products", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleAddItem = (product) => {
    // Check if already in cart
    const existing = items.find(i => i.product_id === product.id);
    if (existing) {
      updateQuantity(product.id, existing.quantity + 1);
    } else {
      setItems([...items, {
        product_id: product.id,
        product_name: product.nombre,
        quantity: 1,
        unit_price: product.precio,
        image: product.imagenes && product.imagenes[0], // Display purpose
        subtotal: product.precio
      }]);
    }
    setSearchQuery(''); // Clear search
    setSearchResults([]);
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    setItems(items.map(item => {
      if (item.product_id === productId) {
        return { ...item, quantity: newQty, subtotal: item.unit_price * newQty };
      }
      return item;
    }));
  };

  const removeItem = (productId) => {
    setItems(items.filter(i => i.product_id !== productId));
  };

  const handleSubmit = async () => {
    if (!customer.name || items.length === 0) {
      alert("Por favor complete los datos del cliente y agregue productos.");
      return;
    }

    const orderData = {
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_address: customer.address,
      items: items.map(i => ({
        product_id: i.product_id,
        product_name: i.product_name,
        quantity: i.quantity,
        unit_price: i.unit_price,
        subtotal: i.subtotal
      })),
      total_amount: total,
      status: 'Pendiente', // Default
      notes: `Pago: ${paymentMethod}`
    };

    try {
      await orderService.createOrder(orderData);
      navigate('/admin/orders');
    } catch (error) {
      console.error("Error creating order:", error);
      const msg = error.response?.data?.error || "Error al crear el pedido. Verifique el stock.";
      alert(msg);
    }
  };

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white dark:bg-[#1E1E1E] p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Información del Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">Nombre del Cliente</label>
                <input 
                  value={customer.name}
                  onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-800 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white text-sm py-2.5 px-4" 
                  placeholder="Ej: Juan Pérez" 
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">Teléfono / WhatsApp</label>
                <input 
                  value={customer.phone}
                  onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-800 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white text-sm py-2.5 px-4" 
                  placeholder="+54 9 11 ..." 
                  type="tel"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">Dirección de Envío</label>
                <input 
                  value={customer.address}
                  onChange={(e) => setCustomer({...customer, address: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-800 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white text-sm py-2.5 px-4" 
                  placeholder="Calle, Número, Localidad, Provincia" 
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="bg-white dark:bg-[#1E1E1E] p-6 border border-gray-200 dark:border-gray-800 shadow-sm relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Agregar Productos</h2>
            </div>
            
            {/* Search Input */}
            <div className="relative mb-6">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-black border-none text-sm focus:ring-1 focus:ring-black dark:focus:ring-white" 
                placeholder="Buscar por nombre, modelo o SKU..." 
                type="text"
              />
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 shadow-lg z-50 max-h-60 overflow-auto">
                    {searchResults.map(product => (
                        <div 
                            key={product.id} 
                            onClick={() => handleAddItem(product)}
                            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer flex justify-between items-center"
                        >
                            <span className="text-sm dark:text-white">{product.nombre}</span>
                            <span className="text-sm font-bold">${product.precio}</span>
                        </div>
                    ))}
                </div>
              )}
            </div>

            {/* Added Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800">
                  <div className="h-14 w-12 bg-gray-200 flex-shrink-0">
                    {item.image ? (
                        <img alt={item.product_name} className="w-full h-full object-cover" src={item.image} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">IMG</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium dark:text-white">{item.product_name}</p>
                    <p className="text-[10px] text-gray-500 uppercase">ID: {item.product_id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E1E]">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900">-</button>
                      <span className="px-3 text-sm font-medium dark:text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900">+</button>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-sm font-bold dark:text-white">${item.subtotal.toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeItem(item.product_id)} className="text-gray-400 hover:text-red-500">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-4">No hay productos agregados.</p>
              )}
            </div>
          </div>

          {/* Payment & Totals */}
          <div className="bg-white dark:bg-[#1E1E1E] p-6 border border-border-light dark:border-border-dark shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <h2 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Método de Pago</h2>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium cursor-pointer ${paymentMethod === 'Efectivo' ? 'text-black dark:text-white' : 'text-gray-400'}`} onClick={() => setPaymentMethod('Efectivo')}>Efectivo</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer custom-toggle" 
                        checked={paymentMethod === 'Tarjeta'}
                        onChange={(e) => setPaymentMethod(e.target.checked ? 'Tarjeta' : 'Efectivo')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black"></div>
                  </label>
                  <span className={`text-xs font-medium cursor-pointer ${paymentMethod === 'Tarjeta' ? 'text-black dark:text-white' : 'text-gray-400'}`} onClick={() => setPaymentMethod('Tarjeta')}>Tarjeta</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <p className="text-xs text-gray-500 uppercase tracking-widest">Resumen del Total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-gray-400">Subtotal:</span>
                  <span className="text-sm font-medium dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-gray-400">Envío:</span>
                  <span className="text-sm font-medium dark:text-white">${shipping.toFixed(2)}</span>
                </div>
                <div className="h-px w-32 bg-gray-100 dark:bg-gray-800 my-1"></div>
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-bold uppercase tracking-widest dark:text-white">Total:</span>
                  <span className="text-3xl font-display font-bold text-black dark:text-white">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">
              <button onClick={() => navigate('/admin/orders')} className="px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] border border-black dark:border-white text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  Cancelar
              </button>
              <button onClick={handleSubmit} className="px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity">
                  Confirmar Pedido
              </button>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default CreateOrderPage;
