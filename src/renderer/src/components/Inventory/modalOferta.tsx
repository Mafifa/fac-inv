import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalOfertaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (producto: Producto) => void;
  producto: Producto | null;
}

const ModalOferta: React.FC<ModalOfertaProps> = ({ isOpen, onClose, onSave, producto }) => {
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
    const gananciaMinimaPorcentaje = 0.2; // 20% de ganancia mínima
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Crear Oferta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Producto</label>
          <input
            type="text"
            value={producto.nombre}
            readOnly
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Precio Original</label>
          <input
            type="number"
            value={producto.precio_base.toFixed(2)}
            readOnly
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descuento (%)</label>
          <input
            type="number"
            value={descuentoPorcentaje}
            onChange={(e) => handleDescuentoChange(Number(e.target.value))}
            max={maximoDescuento}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Precio de Oferta</label>
          <input
            type="number"
            value={precioOferta.toFixed(2)}
            onChange={(e) => handlePrecioOfertaChange(Number(e.target.value))}
            min={precioOfertaMinimo}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4 text-sm text-gray-600">
          <p>Precio mínimo recomendado: ${precioOfertaMinimo.toFixed(2)}</p>
          <p>Descuento máximo recomendado: {maximoDescuento.toFixed(2)}%</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Guardar Oferta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalOferta;

