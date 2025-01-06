import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalOfertaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (producto: Producto) => void;
  producto: Producto | null;
  isDarkMode: boolean;
}

const ModalOferta: React.FC<ModalOfertaProps> = ({ isOpen, onClose, onSave, producto, isDarkMode }) => {
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
  const [precioOferta, setPrecioOferta] = useState(0);

  useEffect(() => {
    if (producto) {
      setDescuentoPorcentaje(producto.descuento || 0);
      setPrecioOferta(producto.precio_base * (1 - (producto.descuento || 0) / 100));
    }
  }, [producto]);

  const calcularPrecioOferta = (precioVenta: number, descuento: number) => {
    return precioVenta * (1 - descuento / 100);
  };

  const calcularOfertaMinimaYDescuento = (costoBase: number, precioVenta: number) => {
    const gananciaMinimaPorcentaje = 0.2;
    const precioOfertaMinimo = costoBase * (1 + gananciaMinimaPorcentaje);
    const maximoDescuento = ((precioVenta - precioOfertaMinimo) / precioVenta) * 100;
    return {
      precioOfertaMinimo,
      maximoDescuento
    };
  };

  const handleDescuentoChange = (descuento: number) => {
    setDescuentoPorcentaje(descuento);
    if (producto) {
      setPrecioOferta(calcularPrecioOferta(producto.precio_base, descuento));
    }
  };

  const handlePrecioOfertaChange = (precio: number) => {
    setPrecioOferta(precio);
    if (producto) {
      setDescuentoPorcentaje(((producto.precio_base - precio) / producto.precio_base) * 100);
    }
  };

  const handleSave = () => {
    if (producto) {
      const productoActualizado: Producto = {
        ...producto,
        descuento: descuentoPorcentaje
      };
      onSave(productoActualizado);
      onClose();
    }
  };

  if (!isOpen || !producto) return null;

  const { precioOfertaMinimo, maximoDescuento } = calcularOfertaMinimaYDescuento(producto.precio_base * 0.7, producto.precio_base);

  return (
    <div className={`fixed inset-0 ${isDarkMode ? 'bg-black' : 'bg-black'} bg-opacity-50 flex justify-center items-center z-50`}>
      <div className={`p-8 rounded-lg w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Crear Oferta</h2>
          <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition duration-150 ease-in-out`}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Producto</label>
            <input
              type="text"
              value={producto.nombre}
              readOnly
              className={`w-full px-3 py-2 border rounded-md shadow-sm ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-gray-100 border-gray-300 text-gray-700'
                }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Precio Original</label>
            <input
              type="number"
              value={producto.precio_base.toFixed(2)}
              readOnly
              className={`w-full px-3 py-2 border rounded-md shadow-sm ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-gray-100 border-gray-300 text-gray-700'
                }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Descuento (%)</label>
            <input
              type="number"
              value={descuentoPorcentaje}
              onChange={(e) => handleDescuentoChange(Number(e.target.value))}
              max={maximoDescuento}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-700'
                }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Precio de Oferta</label>
            <input
              type="number"
              value={precioOferta.toFixed(2)}
              onChange={(e) => handlePrecioOfertaChange(Number(e.target.value))}
              min={precioOfertaMinimo}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-700'
                }`}
            />
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Precio mínimo recomendado: ${precioOfertaMinimo.toFixed(2)}</p>
            <p>Descuento máximo recomendado: {maximoDescuento.toFixed(2)}%</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-md transition duration-150 ease-in-out ${isDarkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            Guardar Oferta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalOferta;

