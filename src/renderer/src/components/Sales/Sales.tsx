import React, { useState, useCallback, useMemo } from 'react';
import { useVentas } from './useSales';
import { useDolarContext } from '../../context/dolarContext';
import { toast } from 'sonner';

const Ventas: React.FC = () => {
  const { tasasDolar } = useDolarContext();
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
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'dolares' | 'transferencia'>('efectivo');
  const [montoPagado, setMontoPagado] = useState('');
  const [ventaActual, setVentaActual] = useState<number | null>(null);

  const tasaDolarPromedio = useMemo(() => {
    const tasaDolar = (tasasDolar.find(t => t.fuente === 'oficial')?.promedio || 0) +
      (tasasDolar.find(t => t.fuente === 'bitcoin')?.promedio || 0);
    return tasaDolar > 0 ? tasaDolar / 2 : 0;
  }, [tasasDolar]);

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
      const idVenta = await realizarVenta(carrito, tasaDolarPromedio);
      setVentaActual(idVenta);
      setModalPagoVisible(true);
    } catch (error) {
      toast.error('Error al realizar la venta');
    }
  }, [carrito, realizarVenta, tasaDolarPromedio]);

  const handlePago = useCallback(async () => {
    if (!ventaActual) {
      toast.error('Error: No hay venta activa');
      return;
    }

    const total = calcularTotal();
    let montoFinal: number | null = null;
    let monedaCambio = 'VES';

    if (metodoPago === 'efectivo') {
      montoFinal = montoPagado ? parseFloat(montoPagado) : total * tasaDolarPromedio;
      if (montoFinal < total * tasaDolarPromedio) {
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
    } else if (metodoPago === 'transferencia') {
      montoFinal = total * tasaDolarPromedio;
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
  }, [ventaActual, calcularTotal, metodoPago, montoPagado, tasaDolarPromedio, registrarPago, limpiarCarrito]);

  const calcularCambio = useCallback(() => {
    const total = calcularTotal();
    const pagado = parseFloat(montoPagado);
    if (isNaN(pagado)) return 0;
    if (metodoPago === 'efectivo') {
      return pagado - total * tasaDolarPromedio;
    } else if (metodoPago === 'dolares') {
      return (pagado - total) * tasaDolarPromedio;
    }
    return 0;
  }, [calcularTotal, metodoPago, montoPagado, tasaDolarPromedio]);

  return (
    <div className="ventas px-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={filtroBusqueda}
          onChange={handleBusqueda}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="productos">
          <h2 className="text-xl font-semibold mb-2">Productos</h2>
          <div className="border rounded p-2 h-96 overflow-y-auto">
            {productos.map((producto: Producto) => (
              <div key={producto.id_producto} className="flex justify-between items-center mb-2 p-2 hover:bg-gray-100">
                <div>
                  <div className="font-semibold">{producto.nombre}</div>
                  <div className="text-sm text-gray-600">
                    ${producto.precio_base.toFixed(2)} / {(producto.precio_base * tasaDolarPromedio).toFixed(2)} Bs
                  </div>
                </div>
                <button
                  onClick={() => agregarAlCarrito(producto.id_producto)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="bg-gray-300 px-2 py-1 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span>Página {paginaActual} de {totalPaginas}</span>
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="bg-gray-300 px-2 py-1 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div className="carrito">
          <h2 className="text-xl font-semibold mb-2">Carrito</h2>
          <div className="border rounded p-2 h-96 overflow-y-auto">
            {carrito.map(item => {
              const producto = productos.find(p => p.id_producto === item.id);
              return producto ? (
                <div key={item.id} className="flex justify-between items-center mb-2 p-2 hover:bg-gray-100">
                  <div>
                    <div className="font-semibold">{producto.nombre}</div>
                    <div className="text-sm text-gray-600">
                      ${(producto.precio_base * item.cantidad).toFixed(2)} /
                      {(producto.precio_base * item.cantidad * tasaDolarPromedio).toFixed(2)} Bs
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => actualizarCantidadCarrito(item.id, item.cantidad - 1)}
                      className="bg-red-500 text-white px-2 py-1 rounded mr-2 hover:bg-red-600"
                    >
                      -
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidadCarrito(item.id, item.cantidad + 1)}
                      className="bg-green-500 text-white px-2 py-1 rounded ml-2 hover:bg-green-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : null;
            })}
          </div>
          <div className="mt-4">
            <div className="text-xl font-bold mb-2">
              Total: ${calcularTotal().toFixed(2)} / {(calcularTotal() * tasaDolarPromedio).toFixed(2)} Bs
            </div>
            <button
              onClick={handleRealizarVenta}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Realizar Venta
            </button>
          </div>
        </div>
      </div>

      {modalPagoVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Registrar Pago</h2>
            <div className="mb-4">
              <div className="text-lg">Total a pagar:</div>
              <div className="text-2xl font-bold">${calcularTotal().toFixed(2)} / {(calcularTotal() * tasaDolarPromedio).toFixed(2)} Bs</div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Método de pago:</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as 'efectivo' | 'dolares' | 'transferencia')}
                className="w-full p-2 border rounded"
              >
                <option value="efectivo">Efectivo (Bs)</option>
                <option value="dolares">Dólares</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            {metodoPago !== 'transferencia' && (
              <div className="mb-4">
                <label className="block mb-2">Monto pagado ({metodoPago === 'efectivo' ? 'Bs' : '$'}):</label>
                <input
                  type="number"
                  value={montoPagado}
                  onChange={(e) => setMontoPagado(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}
            {metodoPago !== 'transferencia' && (
              <div className="mb-4">
                <div className="text-lg">Cambio:</div>
                <div className="text-2xl font-bold">
                  {metodoPago === 'efectivo'
                    ? `${calcularCambio().toFixed(2)} Bs`
                    : metodoPago === 'dolares'
                      ? `${(calcularCambio() / tasaDolarPromedio).toFixed(2)} $`
                      : 'N/A'
                  }
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setModalPagoVisible(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handlePago}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

