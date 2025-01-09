import React, { useState, useCallback } from 'react';
import { useSales } from './useSales';
import { useCart, CartItem } from './useCart';
import { useAppContext } from '../../context/appContext';
import { toast } from 'sonner';
import { Search, ShoppingCart, Plus, Minus, X, RefreshCw } from 'lucide-react';

const Ventas: React.FC = () => {
  const { getTasaCambio, config } = useAppContext();
  const isDarkMode = config.modoOscuro;
  const {
    productos,
    paginaActual,
    totalPaginas,
    filtroBusqueda,
    isLoading,
    buscarProductos,
    cambiarPagina,
    refrescarProductos
  } = useSales();

  const {
    carrito,
    agregarAlCarrito,
    actualizarCantidadCarrito,
    limpiarCarrito,
    calcularTotal
  } = useCart();

  const [modalPagoVisible, setModalPagoVisible] = useState(false);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'dolares' | 'transferencia' | 'punto'>('efectivo');
  const [montoPagado, setMontoPagado] = useState('');

  const handleBusqueda = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    buscarProductos(e.target.value);
  }, [buscarProductos]);

  const handleAgregarAlCarrito = useCallback((producto: Producto) => {
    agregarAlCarrito({
      id: producto.id_producto,
      nombre: producto.nombre,
      precio_base: producto.precio_base,
      stock: producto.stock
    });
  }, [agregarAlCarrito]);

  const handleRealizarVenta = useCallback(() => {
    if (carrito.length === 0) {
      toast.warning('El carrito está vacío');
      return;
    }
    setModalPagoVisible(true);
  }, [carrito]);

  const handlePago = useCallback(async () => {
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
      // Realizar la venta
      const ventaData = carrito.map(item => ({ id: item.id, cantidad: item.cantidad }));
      const idVenta = await window.electron.ipcRenderer.invoke(
        'realizar-venta',
        ventaData,
        getTasaCambio('facturacion')
      );

      // Registrar el pago
      await window.electron.ipcRenderer.invoke(
        'registrar-pago',
        idVenta,
        metodoPago,
        montoFinal,
        monedaCambio
      );

      toast.success('Venta realizada y pago registrado con éxito');
      setModalPagoVisible(false);
      setMontoPagado('');
      limpiarCarrito();
      refrescarProductos(); // Refrescar productos después de una venta exitosa
    } catch (error) {
      toast.error('Error al realizar la venta o registrar el pago');
    }
  }, [carrito, calcularTotal, metodoPago, montoPagado, getTasaCambio, limpiarCarrito, refrescarProductos]);

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
  }, [calcularTotal, metodoPago, montoPagado, getTasaCambio]);

  const handleRefresh = useCallback(() => {
    refrescarProductos();
    toast.success('Productos actualizados');
  }, [refrescarProductos]);

  return (
    <div className={`ventas ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} -mt-2`}>
      <div className="mb-4 flex justify-between items-center">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filtroBusqueda}
            onChange={handleBusqueda}
            className={`w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
          />
          <Search className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={`p-2 rounded-full ${isDarkMode
            ? 'bg-gray-700 hover:bg-gray-600'
            : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Actualizar productos"
        >
          <RefreshCw size={20} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Productos</h2>
          <div className="h-[calc(100vh-300px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <RefreshCw size={40} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} animate-spin`} />
              </div>
            ) : (
              productos.map((producto) => (
                <div key={producto.id_producto} className={`flex justify-between items-center mb-4 p-3 rounded-lg transition duration-150 ease-in-out ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                  <div>
                    <div className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{producto.nombre}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      ${producto.precio_base.toFixed(2)} / {(producto.precio_base * getTasaCambio('facturacion')).toFixed(2)} Bs
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Stock: {producto.stock}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAgregarAlCarrito(producto)}
                    disabled={producto.stock === 0}
                    className={`bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out flex items-center ${producto.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <Plus size={18} className="mr-1" />
                    Agregar
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1 || isLoading}
              className={`px-4 py-2 rounded-lg disabled:opacity-50 transition duration-150 ease-in-out ${isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
                }`}
            >
              Anterior
            </button>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Página {paginaActual} de {totalPaginas}</span>
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas || isLoading}
              className={`px-4 py-2 rounded-lg disabled:opacity-50 transition duration-150 ease-in-out ${isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
                }`}
            >
              Siguiente
            </button>
          </div>
        </div>

        <div className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-semibold mb-4 flex items-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            <ShoppingCart className="mr-2" /> Carrito
          </h2>
          <div className="h-[calc(100vh-400px)] overflow-y-auto mb-4">
            {carrito.map((item: CartItem) => (
              <div key={item.id} className={`flex justify-between items-center mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                <div>
                  <div className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{item.nombre}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    ${(item.precio_base * item.cantidad).toFixed(2)} /
                    {(item.precio_base * item.cantidad * getTasaCambio('facturacion')).toFixed(2)} Bs
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => actualizarCantidadCarrito(item.id, item.cantidad - 1)}
                    className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition duration-150 ease-in-out"
                  >
                    <Minus size={18} />
                  </button>
                  <span className={`mx-3 font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{item.cantidad}</span>
                  <button
                    onClick={() => actualizarCantidadCarrito(item.id, item.cantidad + 1)}
                    disabled={item.cantidad >= item.stock}
                    className={`bg-green-500 text-white p-1 rounded-full hover:bg-green-600 transition duration-150 ease-in-out ${item.cantidad >= item.stock ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className={`border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
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
          <div className={`p-8 rounded-lg max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Registrar Pago</h2>
              <button
                onClick={() => setModalPagoVisible(false)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-6">
              <div className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total a pagar:</div>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                ${calcularTotal().toFixed(2)} / {(calcularTotal() * getTasaCambio('facturacion')).toFixed(2)} Bs
              </div>
            </div>
            <div className="mb-6">
              <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Método de pago:</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as 'efectivo' | 'dolares' | 'transferencia' | 'punto')}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  }`}
              >
                <option value="efectivo">Efectivo (Bs)</option>
                <option value="punto">Punto</option>
                <option value="dolares">Dólares</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            {(metodoPago === 'efectivo' || metodoPago === 'dolares') && (
              <div className="mb-6">
                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Monto pagado ({metodoPago === 'efectivo' ? 'Bs' : '$'}):
                </label>
                <input
                  type="number"
                  value={montoPagado}
                  onChange={(e) => setMontoPagado(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    }`}
                />
              </div>
            )}
            {metodoPago === 'efectivo' && montoPagado && (
              <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cambio:</div>
                <div className={`text-xl ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {calcularCambio().bolivares.toFixed(2)} Bs
                </div>
              </div>
            )}
            {metodoPago === 'dolares' && montoPagado && (
              <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cambio:</div>
                <div className={`text-xl ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  ${calcularCambio().dolares.toFixed(2)} / {calcularCambio().bolivares.toFixed(2)} Bs
                </div>
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalPagoVisible(false)}
                className={`px-6 py-3 rounded-lg transition duration-150 ease-in-out ${isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                  }`}
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

