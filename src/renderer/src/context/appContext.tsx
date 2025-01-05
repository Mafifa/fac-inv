import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Config {
  tasaCambioInventario: string;
  tasaPersonalizadaInventario: number | null;
  tasaCambioFacturacion: string;
  tasaPersonalizadaFacturacion: number | null;
  modalidadBolivarParalelo: boolean;
  idioma: 'es' | 'en';
  modoOscuro: boolean;
}

export interface AppContextType {
  tasasDolar: DolarRate[];
  isLoading: boolean;
  error: string | null;
  config: Config;
  updateConfig: (key: keyof Config, value: any) => Promise<void>;
  getTasaCambio: (tipo: 'inventario' | 'facturacion') => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasasDolar, setTasasDolar] = useState<DolarRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<Config>({
    tasaCambioInventario: 'promedio',
    tasaPersonalizadaInventario: null,
    tasaCambioFacturacion: 'promedio',
    tasaPersonalizadaFacturacion: null,
    modalidadBolivarParalelo: false,
    idioma: 'es',
    modoOscuro: false,
  });

  useEffect(() => {
    const fetchTasasDolar = async () => {
      try {
        const tasas = await window.electron.ipcRenderer.invoke('get-tasas');
        if ('error' in tasas) {
          throw new Error(tasas.error);
        }
        setTasasDolar(tasas);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching tasas dolar:', err);
        setError('Error al obtener las tasas del dólar');
        setIsLoading(false);
      }
    };

    const loadConfig = async () => {
      try {
        const allConfig = await window.electron.ipcRenderer.invoke('get-all-config');
        setConfig(allConfig);
      } catch (err) {
        console.error('Error loading config:', err);
        setError('Error al cargar la configuración');
      }
    };

    fetchTasasDolar();
    loadConfig();
  }, []);

  const updateConfig = async (key: keyof Config, value: any) => {
    try {
      const success = await window.electron.ipcRenderer.invoke('set-config', key, value);
      if (success) {
        setConfig(prevConfig => ({ ...prevConfig, [key]: value }));
      } else {
        throw new Error('Failed to update config');
      }
    } catch (err) {
      console.error('Error updating config:', err);
      setError('Error al actualizar la configuración');
    }
  };

  const getTasaCambio = (tipo: 'inventario' | 'facturacion') => {
    const tasaConfig = tipo === 'inventario' ? config.tasaCambioInventario : config.tasaCambioFacturacion;
    const tasaPersonalizada = tipo === 'inventario' ? config.tasaPersonalizadaInventario : config.tasaPersonalizadaFacturacion;

    // Si Bolivar paralelo esta activado
    if (config.modalidadBolivarParalelo) {
      return tasasDolar.find(t => t.fuente === 'paralelo')?.promedio || 0;
    }

    switch (tasaConfig) {
      case 'bancoCentral':
        return tasasDolar.find(t => t.fuente === 'oficial')?.promedio || 0;
      case 'paralelo':
        return tasasDolar.find(t => t.fuente === 'paralelo')?.promedio || 0;
      case 'binance':
        return tasasDolar.find(t => t.fuente === 'bitcoin')?.promedio || 0;
      case 'promedio':
        return tasasDolar.reduce((sum, t) => sum + t.promedio, 0) / tasasDolar.length;
      case 'personalizada':
        return tasaPersonalizada || 0;
      default:
        return 0;
    }
  };

  return (
    <AppContext.Provider value={{ tasasDolar, isLoading, error, config, updateConfig, getTasaCambio }}>
      {children}
    </AppContext.Provider>
  );
};

