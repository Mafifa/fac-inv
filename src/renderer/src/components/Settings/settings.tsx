import React from 'react';
import { X, DollarSign, Globe, Moon, Sun, Percent } from 'lucide-react';
import { useConfig } from './useSettings';

interface ConfiguracionProps {
  onClose: () => void;
}

interface Config {
  tasaCambioInventario: string;
  tasaPersonalizadaInventario: number | null;
  tasaCambioFacturacion: string;
  tasaPersonalizadaFacturacion: number | null;
  modalidadBolivarParalelo: boolean;
  idioma: 'es' | 'en';
  modoOscuro: boolean;
}

const Configuracion: React.FC<ConfiguracionProps> = ({ onClose }) => {
  const { updateConfig, config } = useConfig()

  const handleChange = async (key: keyof Config, value: any) => {
    updateConfig(key, value)
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Configuración</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ConfigSection
                title="Tasa de Cambio para Inventario"
                icon={<Percent className="h-6 w-6 text-blue-500" />}
              >
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tasaCambioInventario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Seleccionar tasa
                    </label>
                    <select
                      id="tasaCambioInventario"
                      value={config.tasaCambioInventario}
                      onChange={(e) => handleChange('tasaCambioInventario', e.target.value)}
                      disabled={config.modalidadBolivarParalelo}
                      className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="bancoCentral">Banco Central</option>
                      <option value="paralelo">Paralelo</option>
                      <option value="binance">Binance</option>
                      <option value="promedio">Promedio</option>
                      <option value="personalizada">Personalizada</option>
                    </select>
                  </div>
                  <div>
                    {config.tasaCambioInventario === 'personalizada' && (
                      <div>
                        <label htmlFor="tasaPersonalizadaInventario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tasa personalizada
                        </label>
                        <input
                          type="number"
                          id="tasaPersonalizadaInventario"
                          value={config.tasaPersonalizadaInventario || ''}
                          onChange={(e) => handleChange('tasaPersonalizadaInventario', parseFloat(e.target.value))}
                          disabled={config.modalidadBolivarParalelo}
                          className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ingrese tasa personalizada"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </ConfigSection>

              <ConfigSection
                title="Tasa de Cambio para Facturación"
                icon={<Percent className="h-6 w-6 text-green-500" />}
              >
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tasaCambioFacturacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Seleccionar tasa
                    </label>
                    <select
                      id="tasaCambioFacturacion"
                      value={config.tasaCambioFacturacion}
                      onChange={(e) => handleChange('tasaCambioFacturacion', e.target.value)}
                      disabled={config.modalidadBolivarParalelo}
                      className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="bancoCentral">Banco Central</option>
                      <option value="paralelo">Paralelo</option>
                      <option value="binance">Binance</option>
                      <option value="promedio">Promedio</option>
                      <option value="personalizada">Personalizada</option>
                    </select>
                  </div>
                  <div>
                    {config.tasaCambioFacturacion === 'personalizada' && (
                      <div>
                        <label htmlFor="tasaPersonalizadaFacturacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tasa personalizada
                        </label>
                        <input
                          type="number"
                          id="tasaPersonalizadaFacturacion"
                          value={config.tasaPersonalizadaFacturacion || ''}
                          onChange={(e) => handleChange('tasaPersonalizadaFacturacion', parseFloat(e.target.value))}
                          disabled={config.modalidadBolivarParalelo}
                          className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ingrese tasa personalizada"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </ConfigSection>
            </div>

            <div className="space-y-6">

              <ConfigSection
                title="Preferencias de Idioma"
                icon={<Globe className="h-6 w-6 text-purple-500" />}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Idioma</span>
                  <select
                    id="idioma"
                    value={config.idioma}
                    onChange={(e) => handleChange('idioma', e.target.value as 'es' | 'en')}
                    className="px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </ConfigSection>

              <ConfigSection
                title="Apariencia"
                icon={config.modoOscuro ? <Moon className="h-6 w-6 text-yellow-500" /> : <Sun className="h-6 w-6 text-yellow-500" />}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo Oscuro</span>
                  <Toggle
                    enabled={config.modoOscuro}
                    onChange={(value) => handleChange('modoOscuro', value)}
                  />
                </div>
              </ConfigSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfigSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      {children}
    </div>
  );
};

const Toggle: React.FC<{ enabled: boolean; onChange: (value: boolean) => void }> = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      onClick={() => onChange(!enabled)}
    >
      <span className={`${enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}>
        <span className={`${enabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
          } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}>
          <X className="h-3 w-3 text-gray-400" />
        </span>
        <span className={`${enabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
          } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}>
          <DollarSign className="h-3 w-3 text-blue-600" />
        </span>
      </span>
    </button>
  );
};

export default Configuracion;

