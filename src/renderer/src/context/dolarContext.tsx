import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';

interface DolarContextType {
  tasasDolar: DolarRate[];
  promedio: number;
  isLoading: boolean;
  error: string | null;
}

const DolarContext = createContext<DolarContextType | undefined>(undefined);

export const DolarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasasDolar, setTasasDolar] = useState<DolarRate[]>([]);
  const [promedio, setPromedio] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasas = async () => {
      try {
        const result = await window.electron.ipcRenderer.invoke('get-tasas');
        if (Array.isArray(result)) {
          setTasasDolar(result);
          const oficial = result.find((tasa) => tasa.fuente === 'oficial')?.promedio || 0
          const bitcoin = result.find((tasa) => tasa.fuente === 'bitcoin')?.promedio || 0
          const promedio = (oficial + bitcoin) / 2
          setPromedio(() => promedio > 0 ? promedio : 0)
        } else if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        setError('Error al obtener las tasas de dólar');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasas();
  }, []);

  return (
    <DolarContext.Provider value={{ tasasDolar, promedio, isLoading, error }}>
      {children}
    </DolarContext.Provider>
  );
};

export const useDolarContext = () => {
  const context = useContext(DolarContext);
  if (context === undefined) {
    throw new Error('useDolarContext must be used within a DolarProvider');
  }
  return context;
};