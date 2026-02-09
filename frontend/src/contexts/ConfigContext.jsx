import { createContext, useContext, useState, useEffect } from 'react';
import configService from '../services/configService';

const ConfigContext = createContext();

export function useConfig() {
  return useContext(ConfigContext);
}

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const data = await configService.getConfig();
      setConfig(data);
    } catch (error) {
      console.error('Error loading site config:', error);
      // Fallback to minimal defaults if API fails
      setConfig({
        store_name: 'Tienda',
        logo_url: ''
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const value = {
    config,
    loading,
    refreshConfig: fetchConfig
  };

  // We could show a loading spinner here for the whole app, 
  // but it might be better to render children and let them handle partial loading
  // or show a default skeleton. For now, we render children even if loading.
  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}
