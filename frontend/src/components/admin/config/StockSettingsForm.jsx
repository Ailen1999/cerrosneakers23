function StockSettingsForm({ config, onChange }) {
  return (
    <section className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-[#e8e8f3] dark:border-white/10 shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between p-4 bg-background-light dark:bg-[#111121] rounded-lg">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#0e0e1b] dark:text-white">Alertas de Stock Bajo</span>
            <span className="text-xs text-[#505095] dark:text-gray-300">Notificar al administrador cuando un talle llegue al límite.</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#0e0e1b] dark:text-white">Umbral:</span>
              <input 
                className="w-16 h-8 rounded border-[#d1d1e6] dark:border-white/20 bg-white dark:bg-[#1a1a2e] text-center text-xs text-[#0e0e1b] dark:text-white focus:ring-white focus:border-white" 
                type="number" 
                value={config.low_stock_threshold || 0}
                onChange={(e) => onChange('low_stock_threshold', parseInt(e.target.value))}
              />
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={config.enable_stock_alerts || false}
                onChange={(e) => onChange('enable_stock_alerts', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-black peer-checked:after:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-white"></div>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-background-light dark:bg-[#111121] rounded-lg">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#0e0e1b] dark:text-white">Nuevos Pedidos</span>
            <span className="text-xs text-[#505095] dark:text-gray-300">Notificar por Email cada vez que se realice una venta.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={config.enable_order_alerts || false}
              onChange={(e) => onChange('enable_order_alerts', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-black peer-checked:after:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-white"></div>
          </label>
        </div>
      </div>
    </section>
  );
}

export default StockSettingsForm;
