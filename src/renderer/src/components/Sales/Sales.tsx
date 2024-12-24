import React, { useState } from 'react';
import { useSales } from './useSales';
import { ShoppingCart, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Sales: React.FC = () => {
  const { productos, realizarVenta } = useSales();
  const [carrito, setCarrito] = useState<Array<{ id: number; cantidad: number }>>([]);
  const [tasaDolar, setTasaDolar] = useState<number>(0);

  const agregarAlCarrito = (id: number) => {
    const itemEnCarrito = carrito.find(item => item.id === id);
    if (itemEnCarrito) {
      setCarrito(carrito.map(item =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { id, cantidad: 1 }]);
    }
  };

  const removerDelCarrito = (id: number) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      const producto = productos.find(p => p.id_producto === item.id);
      return total + (producto ? producto.precio_base * item.cantidad : 0);
    }, 0);
  };

  const handleVenta = async () => {
    if (carrito.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }
    if (tasaDolar <= 0) {
      toast.error('Por favor, ingrese una tasa de dólar válida');
      return;
    }
    try {
      await realizarVenta(carrito, tasaDolar);
      setCarrito([]);
      setTasaDolar(0);
      toast.success('Venta realizada con éxito');
    } catch (error) {
      toast.error('Error al realizar la venta');
    }
  };

  return (
    <div className="sales">
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">Sales</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Productos Disponibles</h2>
          <ul className="space-y-2">
            {productos.map(producto => (
              <li key={producto.id_producto} className="flex justify-between items-center">
                <span>{producto.nombre} - ${producto.precio_base}</span>
                <button
                  onClick={() => agregarAlCarrito(producto.id_producto)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Agregar
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Carrito</h2>
          <ul className="space-y-2 mb-4">
            {carrito.map(item => {
              const producto = productos.find(p => p.id_producto === item.id);
              return producto ? (
                <li key={item.id} className="flex justify-between items-center">
                  <span>{producto.nombre} x {item.cantidad}</span>
                  <button
                    onClick={() => removerDelCarrito(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </li>
              ) : null;
            })}
          </ul>
          <div className="flex items-center mb-4">
            <DollarSign className="text-green-500 mr-2" />
            <input
              type="number"
              value={tasaDolar}
              onChange={(e) => setTasaDolar(Number(e.target.value))}
              placeholder="Tasa del dólar"
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="text-xl font-semibold mb-4">
            Total: ${calcularTotal().toFixed(2)}
          </div>
          <button
            onClick={handleVenta}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center"
          >
            <ShoppingCart className="mr-2" />
            Realizar Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;

