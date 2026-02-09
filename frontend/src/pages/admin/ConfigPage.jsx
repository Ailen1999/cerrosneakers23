import { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import configService from '../../services/configService';
import GeneralSettingsForm from '../../components/admin/config/GeneralSettingsForm';
import ContactSettingsForm from '../../components/admin/config/ContactSettingsForm';
import FinanceSettingsForm from '../../components/admin/config/FinanceSettingsForm';

import { toast } from 'react-hot-toast';

function ConfigPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalConfig, setOriginalConfig] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await configService.getConfig();
      setConfig(data);
      setOriginalConfig(JSON.stringify(data));
    } catch (error) {
      toast.error('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await configService.updateConfig(config);
      setOriginalConfig(JSON.stringify(config));
      toast.success('Configuración guardada correctamente');
      
      // Update browser tab title if store name changed (immediate feedback)
      if (document.title !== config.store_name) {
          document.title = config.store_name; 
      }
      
    } catch (error) {
      toast.error('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (originalConfig) {
      setConfig(JSON.parse(originalConfig));
      toast.success('Cambios descartados');
    }
  };

  const hasChanges = originalConfig !== JSON.stringify(config);

  if (loading) {
    return (
      <MainLayout pageTitle="Configuración">
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Configuración">
      <div className="flex flex-col gap-8 w-full max-w-[800px] mx-auto pb-20">
        {/* PageHeading */}
        <div className="mb-2">
          <h2 className="text-[#0e0e1b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Configuración General</h2>
          <p className="text-[#505095] dark:text-[#a0a0c0] text-base font-normal leading-normal mt-2">Administra la información básica y preferencias de tu tienda.</p>
        </div>

        <div className="space-y-12">
          <GeneralSettingsForm config={config} onChange={handleChange} />
          <ContactSettingsForm config={config} onChange={handleChange} />
          <FinanceSettingsForm config={config} onChange={handleChange} />


          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-4 py-8 border-t border-[#e8e8f3] dark:border-white/10 mt-8">
            <button 
              onClick={handleDiscard}
              disabled={!hasChanges || saving}
              className={`px-6 h-12 rounded-lg text-sm font-bold transition-colors ${
                !hasChanges ? 'text-gray-300 cursor-not-allowed' : 'text-[#505095] hover:bg-gray-200/50 dark:hover:bg-white/5'
              }`}
            >
              Descartar cambios
            </button>
            <button 
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`px-8 h-12 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center gap-2 ${
                !hasChanges || saving
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed shadow-none'
                  : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20'
              }`}
            >
              {saving ? (
                <>
                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                   Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">save</span>
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ConfigPage;
