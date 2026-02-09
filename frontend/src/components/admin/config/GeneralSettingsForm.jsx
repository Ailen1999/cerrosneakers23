import { useState, useRef } from 'react';
import configService from '../../../services/configService';
import { toast } from 'react-hot-toast';

function GeneralSettingsForm({ config, onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo excede el límite de 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const response = await configService.uploadImage(file);
      onChange('logo_url', response.url);
      toast.success("Logo subido correctamente");
    } catch (error) {
      toast.error("Error al subir el logo");
    } finally {
      setIsUploading(false);
      // Clear input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Create a fake event to reuse handleFileChange logic or just call service directly
      // Better to call service directly or mock event, but let's reuse logic by validating here
       if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo excede el límite de 5MB");
        return;
      }
      
      setIsUploading(true);
      configService.uploadImage(file)
        .then(response => {
            onChange('logo_url', response.url);
            toast.success("Logo subido correctamente");
        })
        .catch(() => toast.error("Error al subir el logo"))
        .finally(() => setIsUploading(false));
    }
  };

  return (
    <section className="bg-white dark:bg-[#1a1a2e] p-6 rounded-xl border border-[#e8e8f3] dark:border-white/10 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-[#f0f0f5] dark:border-white/5 pb-4">
        <span className="material-symbols-outlined text-primary dark:text-white">storefront</span>
        <h3 className="text-xl font-bold tracking-tight dark:text-white">Perfil de la Tienda</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#0e0e1b] dark:text-white">Nombre de la Tienda</span>
            <input 
              className="form-input w-full rounded-lg border-[#d1d1e6] dark:border-white/20 bg-background-light dark:bg-[#111121] dark:text-white focus:ring-primary focus:border-primary h-12 px-4 text-sm" 
              placeholder="Ej. Cerro Sneakers" 
              type="text" 
              value={config.store_name || ''}
              onChange={(e) => onChange('store_name', e.target.value)}
            />
          </label>
        </div>
        
        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold text-[#0e0e1b] dark:text-white">Logo de la Tienda</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
          />
          <div 
            onClick={handleAreaClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`group relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-[164px] transition-all cursor-pointer overflow-hidden
              ${isUploading ? 'opacity-50 cursor-wait' : 'hover:border-primary dark:hover:border-white'}
              border-[#d1d1e6] dark:border-white/20 bg-background-light dark:bg-[#111121]`}
          >
            {isUploading ? (
               <div className="flex flex-col items-center gap-2">
                 <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin dark:border-white dark:border-t-transparent"></div>
                 <span className="text-xs text-[#505095] dark:text-gray-400">Subiendo...</span>
               </div>
            ) : config.logo_url ? (
               <img src={config.logo_url} alt="Logo actual" className="w-full h-full object-contain p-4" />
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-[#505095] dark:text-gray-400">cloud_upload</span>
                    <span className="text-xs font-medium text-[#505095] dark:text-gray-400">Haz clic para subir o arrastra un archivo</span>
                    <span className="text-[10px] text-[#505095]/60 dark:text-gray-500 uppercase tracking-widest">PNG, JPG hasta 5MB</span>
                </div>
            )}
          </div>
          {config.logo_url && (
              <button 
                onClick={() => onChange('logo_url', '')}
                className="text-xs text-red-500 hover:text-red-700 font-medium self-end"
              >
                  Eliminar logo
              </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default GeneralSettingsForm;
