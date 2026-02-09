function FinanceSettingsForm({ config, onChange }) {
  return (
    <section className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-[#e8e8f3] dark:border-white/10 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-[#f0f0f5] dark:border-white/5 pb-4">
        <span className="material-symbols-outlined text-primary dark:text-white">payments</span>
        <h3 className="text-xl font-bold tracking-tight dark:text-white">Pasarela de Pagos</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#0e0e1b] dark:text-white">Recargo para Precio de Lista (Cuotas)</span>
          <div className="relative">
            <input 
              className="form-input w-full rounded-lg border-[#d1d1e6] dark:border-white/20 bg-background-light dark:bg-[#111121] dark:text-white focus:ring-primary focus:border-primary h-12 px-4 text-sm" 
              step="0.5" 
              type="number" 
              value={config.credit_card_surcharge || 0}
              onChange={(e) => onChange('credit_card_surcharge', parseFloat(e.target.value))}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-primary dark:text-white">%</span>
          </div>
          <span className="text-xs text-[#505095] dark:text-gray-400">Este porcentaje se utiliza para calcular automáticamente el Precio de Lista sobre el Precio Efectivo.</span>
        </label>
        
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#0e0e1b] dark:text-white">Métodos de pago activos</span>
          {/* TODO: Implement toggle for payment methods in future iteration */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase dark:bg-white/10 dark:text-white dark:border-white/20">Efectivo</span>
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase dark:bg-white/10 dark:text-white dark:border-white/20">Transferencia</span>
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase dark:bg-white/10 dark:text-white dark:border-white/20">Tarjeta de Crédito</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinanceSettingsForm;
