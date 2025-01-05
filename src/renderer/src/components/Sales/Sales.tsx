import React, { useState, useCallback } from 'react';
import { useVentas } from './useSales';
import { useAppContext } from '../../context/appContext';
import { toast } from 'sonner';
import { Search, ShoppingCart, Plus, Minus, X } from 'lucide-react';

const Ventas: React.FC = () => {
  const { getTasaCambio } = useAppContext();
  const {
    productos,
    carrito,
    paginaActual,
    totalPaginas,
    filtroBusqueda,
    buscarProductos,
    agregarAlCarrito,
    actualizarCantidadCarrito,
    realizarVenta,
    registrarPago,
    limpiarCarrito,
    cambiarPagina
  } = useVentas();

  const [modalPagoVisible, setModalPagoVisible] = useState(false);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'dolares' | 'transferencia' | 'punto'>('efectivo');
  const [montoPagado, setMontoPagado] = useState('');
  const [ventaActual, setVentaActual] = useState<number | null>(null);

  const calcularTotal = useCallback(() => {
    return carrito.reduce((total, item) => {
      const producto = productos.find(p => p.id_producto === item.id);
      return total + (producto ? producto.precio_base * item.cantidad : 0);
    }, 0);
  }, [carrito, productos]);

  const handleBusqueda = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    buscarProductos(e.target.value);
  }, [buscarProductos]);

  const handleRealizarVenta = useCallback(async () => {
    if (carrito.length === 0) {
      toast.warning('El carrito está vacío');
      return;
    }
    try {
      const idVenta = await realizarVenta(carrito, getTasaCambio('facturacion'));
      setVentaActual(idVenta);
      setModalPagoVisible(true);
    } catch (error) {
      toast.error('Error al realizar la venta');
    }
  }, [carrito, realizarVenta, getTasaCambio('facturacion')]);

  const handlePago = useCallback(async () => {
    if (!ventaActual) {
      toast.error('Error: No hay venta activa');
      return;
    }

    const total = calcularTotal();
    let montoFinal: number | null = null;
    let monedaCambio = 'VES';

    if (metodoPago === 'efectivo') {
      montoFinal = montoPagado ? parseFloat(montoPagado) : total * getTasaCambio('facturacion');
      if (montoFinal < total * getTasaCambio('facturacion')) {
        toast.error('El monto pagado es insuficiente');
        return;
      }
    } else if (metodoPago === 'dolares') {
      montoFinal = montoPagado ? parseFloat(montoPagado) : total;
      monedaCambio = 'USD';
      if (montoFinal < total) {
        toast.error('El monto pagado es insuficiente');
        return;
      }
    } else if (metodoPago === 'transferencia' || metodoPago === 'punto') {
      montoFinal = total * getTasaCambio('facturacion');
    }

    try {
      await registrarPago(ventaActual, metodoPago, montoFinal, monedaCambio);
      toast.success('Pago registrado con éxito');
      setModalPagoVisible(false);
      setMontoPagado('');
      setVentaActual(null);
      limpiarCarrito();
    } catch (error) {
      toast.error('Error al registrar el pago');
    }
  }, [ventaActual, calcularTotal, metodoPago, montoPagado, getTasaCambio('facturacion'), registrarPago, limpiarCarrito]);

  const calcularCambio = useCallback(() => {
    const total = calcularTotal();
    const pagado = parseFloat(montoPagado);
    if (isNaN(pagado)) return { bolivares: 0, dolares: 0 };

    if (metodoPago === 'efectivo') {
      const cambioBolivares = pagado - (total * getTasaCambio('facturacion'));
      return { bolivares: cambioBolivares, dolares: 0 };
    } else if (metodoPago === 'dolares') {
      const cambioDolares = pagado - total;
      return {
        bolivares: cambioDolares * getTasaCambio('facturacion'),
        dolares: cambioDolares
      };
    }
    return { bolivares: 0, dolares: 0 };
  }, [calcularTotal, metodoPago, montoPagado, getTasaCambio('facturacion')]);

  return (
    <div className="ventas bg-gray-100 -mt-2">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filtroBusqueda}
            onChange={handleBusqueda}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Productos</h2>
          <div className="h-[calc(100vh-300px)] overflow-y-auto">
            {productos.map((producto) => (
              <div key={producto.id_producto} className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out">
                <div>
                  <div className="font-semibold text-gray-800">{producto.nombre}</div>
                  <div className="text-sm text-gray-600">
                    ${producto.precio_base.toFixed(2)} / {(producto.precio_base * getTasaCambio('facturacion')).toFixed(2)} Bs
                  </div>
                </div>
                <button
                  onClick={() => agregarAlCarrito(producto.id_producto)}
                  className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out flex items-center"
                >
                  <Plus size={18} className="mr-1" />
                  Agregar
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition duration-150 ease-in-out"
            >
              Anterior
            </button>
            <span className="text-gray-600">Página {paginaActual} de {totalPaginas}</span>
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition duration-150 ease-in-out"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <ShoppingCart className="mr-2" /> Carrito
          </h2>
          <div className="h-[calc(100vh-400px)] overflow-y-auto mb-4">
            {carrito.map(item => {
              const producto = productos.find(p => p.id_producto === item.id);
              return producto ? (
                <div key={item.id} className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">{producto.nombre}</div>
                    <div className="text-sm text-gray-600">
                      ${(producto.precio_base * item.cantidad).toFixed(2)} /
                      {(producto.precio_base * item.cantidad * getTasaCambio('facturacion')).toFixed(2)} Bs
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => actualizarCantidadCarrito(item.id, item.cantidad - 1)}
                      className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition duration-150 ease-in-out"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="mx-3 font-semibold">{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidadCarrito(item.id, item.cantidad + 1)}
                      className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600 transition duration-150 ease-in-out"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ) : null;
            })}
          </div>
          <div className="border-t pt-4">
            <div className="text-2xl font-bold mb-4 text-gray-800">
              Total: ${calcularTotal().toFixed(2)} / {(calcularTotal() * getTasaCambio('facturacion')).toFixed(2)} Bs
            </div>
            <button
              onClick={handleRealizarVenta}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-150 ease-in-out text-lg font-semibold"
            >
              Realizar Venta
            </button>
          </div>
        </div>
      </div>

      {modalPagoVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Registrar Pago</h2>
              <button
                onClick={() => setModalPagoVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-6">
              <div className="text-lg text-gray-600">Total a pagar:</div>
              <div className="text-3xl font-bold text-gray-800">
                ${calcularTotal().toFixed(2)} / {(calcularTotal() * getTasaCambio('facturacion')).toFixed(2)} Bs
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-gray-700">Método de pago:</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as 'efectivo' | 'dolares' | 'transferencia' | 'punto')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="efectivo">Efectivo (Bs)</option>
                <option value="punto">Punto</option>
                <option value="dolares">Dólares</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            {(metodoPago === 'efectivo' || metodoPago === 'dolares') && (
              <div className="mb-6">
                <label className="block mb-2 text-gray-700">
                  Monto pagado ({metodoPago === 'efectivo' ? 'Bs' : '$'}):
                </label>
                <input
                  type="number"
                  value={montoPagado}
                  onChange={(e) => setMontoPagado(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {metodoPago === 'efectivo' && montoPagado && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-700 mb-2">Cambio:</div>
                <div className="text-xl text-gray-800">
                  {calcularCambio().bolivares.toFixed(2)} Bs
                </div>
              </div>
            )}
            {metodoPago === 'dolares' && montoPagado && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-700 mb-2">Cambio:</div>
                <div className="text-xl text-gray-800">
                  ${calcularCambio().dolares.toFixed(2)} / {calcularCambio().bolivares.toFixed(2)} Bs
                </div>
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalPagoVisible(false)}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition duration-150 ease-in-out"
              >
                Cancelar
              </button>
              <button
                onClick={handlePago}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;

