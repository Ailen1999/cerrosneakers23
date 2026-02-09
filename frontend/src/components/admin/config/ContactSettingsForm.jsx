function ContactSettingsForm({ config, onChange }) {
  return (
    <section className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-[#e8e8f3] dark:border-white/10 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-[#f0f0f5] dark:border-white/5 pb-4">
        <span className="material-symbols-outlined text-[#25D366]">chat</span>
        <h3 className="text-xl font-bold tracking-tight dark:text-white">WhatsApp Business</h3>
      </div>
      
      <div className="space-y-6">
        <label className="flex flex-col gap-2 max-w-md">
          <span className="text-sm font-semibold text-[#0e0e1b] dark:text-white">Número de Teléfono</span>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#505095] dark:text-gray-300 font-medium">+</span>
            <input 
              className="form-input w-full pl-8 rounded-lg border-[#d1d1e6] dark:border-white/20 bg-background-light dark:bg-[#111121] dark:text-white focus:ring-primary focus:border-primary h-12 text-sm" 
              placeholder="5491112345678" 
              type="text" 
              value={config.whatsapp_number || ''}
              onChange={(e) => onChange('whatsapp_number', e.target.value)}
            />
          </div>
          <p className="text-xs text-[#505095] dark:text-gray-300">Ingrese el número completo con código de país (ej. 54911...)</p>
        </label>
        
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#0e0e1b] dark:text-white">Plantilla de Mensaje Predeterminado</span>
          <p className="text-xs text-[#505095] dark:text-gray-300 mb-1">Este mensaje se enviará automáticamente cuando un cliente inicie una consulta desde la web.</p>
          <textarea 
            className="form-input w-full rounded-lg border-[#d1d1e6] dark:border-white/20 bg-background-light dark:bg-[#111121] dark:text-white focus:ring-primary focus:border-primary p-4 text-sm resize-none" 
            rows="4"
            value={config.whatsapp_message || ''}
            onChange={(e) => onChange('whatsapp_message', e.target.value)}
          />
        </label>
      </div>
    </section>
  );
}

export default ContactSettingsForm;
