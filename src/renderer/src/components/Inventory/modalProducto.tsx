import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProductoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (producto: Producto) => void;
  producto: Producto | null;
  isDarkMode: boolean;
}

const ModalProducto: React.FC<ModalProductoProps> = ({ isOpen, onClose, onSave, producto, isDarkMode }) => {
  const [nombre, setNombre] = useState('');
  const [costoBase, setCostoBase] = useState('');
  const [costosIndirectos, setCostosIndirectos] = useState('');
  const [gananciaPorcentaje, setGananciaPorcentaje] = useState('');
  const [stock, setStock] = useState('');
  const [descuento, setDescuento] = useState('');
  const [modoAvanzado, setModoAvanzado] = useState(false);

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setCostoBase(producto.precio_base.toString());
      setStock(producto.stock.toString());
      setDescuento(producto.descuento ? producto.descuento.toString() : '');
    } else {
      setNombre('');
      setCostoBase('');
      setCostosIndirectos('');
      setGananciaPorcentaje('');
      setStock('');
      setDescuento('');
    }
  }, [producto]);

  const calcularPrecioVenta = () => {
    const costoBaseNum = parseFloat(costoBase) || 0;
    const costosIndirectosNum = parseFloat(costosIndirectos) || 0;
    const gananciaPorcentajeNum = parseFloat(gananciaPorcentaje) || 0;
    return (costoBaseNum + costosIndirectosNum) * (1 + gananciaPorcentajeNum / 100);
  };

  const handleSave = () => {
    const nuevoProducto: Producto = {
      id_producto: producto ? producto.id_producto : 0,
      nombre,
      precio_base: modoAvanzado ? calcularPrecioVenta() : parseFloat(costoBase) || 0,
      stock: parseInt(stock) || 0,
      activo: true,
      descuento: parseFloat(descuento) || 0
    };
    onSave(nuevoProducto);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 ${isDarkMode ? 'bg-black' : 'bg-black'} bg-opacity-50 flex justify-center items-center z-50`}>
      <div className={`p-8 rounded-lg ${modoAvanzado ? 'w-full max-w-4xl' : 'w-full max-w-md'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {producto ? 'Editar Producto' : 'Agregar Producto'}
          </h2>
          <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition duration-150 ease-in-out`}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className={`space-y-4 ${modoAvanzado ? 'grid grid-cols-2 gap-4' : ''}`}>
          <div className={modoAvanzado ? 'col-span-2' : ''}>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-700'
                }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {modoAvanzado ? 'Costo Base' : 'Precio Base'}
            </label>
            <input
              type="number"
              value={costoBase}
              onChange={(e) => setCostoBase(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-700'
                }`}
            />
          </div>
          {modoAvanzado && (
            <>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Costos Indirectos</label>
                <input
                  type="number"
                  value={costosIndirectos}
                  onChange={(e) => setCostosIndirectos(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-700'
                    }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ganancia (%)</label>
                <input
                  type="number"
                  value={gananciaPorcentaje}
                  onChange={(e) => setGananciaPorcentaje(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-700'
                    }`}
                />
              </div>
              <div className="col-span-2">
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Precio de Venta Calculado</label>
                <input
                  type="number"
                  value={calcularPrecioVenta().toFixed(2)}
                  readOnly
                  className={`w-full px-3 py-2 border rounded-md shadow-sm ${isDarkMode
                    ? 'bg-gray-600 border-gray-500 text-gray-200'
                    : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}
                />
              </div>
            </>
          )}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-700'
                }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Descuento (%)</label>
            <input
              type="number"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-700'
                }`}
            />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={modoAvanzado}
              onChange={(e) => setModoAvanzado(e.target.checked)}
              className={`rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2 ${isDarkMode ? 'bg-gray-700' : 'bg-white'
                }`}
            />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Modo Avanzado</span>
          </label>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-md transition duration-150 ease-in-out ${isDarkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalProducto;

