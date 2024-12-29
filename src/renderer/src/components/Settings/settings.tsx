import React from 'react';
import { X } from 'lucide-react';

interface ConfiguracionProps {
  onClose: () => void;
}

const Configuracion: React.FC<ConfiguracionProps> = ({ onClose }) => {
  return (
    <div className="relative">
      <button onClick={onClose} className="absolute top-0 right-0 p-2">
        <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
      </button>
      <h2 className="text-2xl font-semibold mb-4">Configuración</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Moneda</label>
          <select id="currency" name="currency" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option>USD</option>
            <option>VES</option>
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">Idioma</label>
          <select id="language" name="language" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option>Español</option>
            <option>English</option>
          </select>
        </div>
        {/* Add more configuration options as needed */}
      </div>
      <button
        className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Guardar cambios
      </button>
    </div>
  );
};

export default Configuracion;

