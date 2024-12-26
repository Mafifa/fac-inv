import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProductoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (producto: Producto) => void;
  producto?: Producto | null;
}

const ModalProducto: React.FC<ModalProductoProps> = ({ isOpen, onClose, onSave, producto }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className={`bg-white p-6 rounded-lg ${modoAvanzado ? 'w-full max-w-4xl' : 'w-96'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{producto ? 'Editar Producto' : 'Agregar Producto'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className={`${modoAvanzado ? 'grid grid-cols-2 gap-4' : ''}`}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {modoAvanzado ? 'Costo Base' : 'Precio Base'}
            </label>
            <input
              type="number"
              value={costoBase}
              onChange={(e) => setCostoBase(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          {modoAvanzado && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Costos Indirectos</label>
                <input
                  type="number"
                  value={costosIndirectos}
                  onChange={(e) => setCostosIndirectos(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ganancia (%)</label>
                <input
                  type="number"
                  value={gananciaPorcentaje}
                  onChange={(e) => setGananciaPorcentaje(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4 col-span-2">
                <label className="block text-sm font-medium text-gray-700">Precio de Venta Calculado</label>
                <input
                  type="number"
                  value={calcularPrecioVenta().toFixed(2)}
                  readOnly
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descuento (%)</label>
            <input
              type="number"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={modoAvanzado}
              onChange={(e) => setModoAvanzado(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600">Modo Avanzado</span>
          </label>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalProducto;

