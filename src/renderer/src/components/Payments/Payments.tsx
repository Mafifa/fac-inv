import React, { useState } from 'react';
import { usePayments } from './usePayments';
import { DollarSign, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const Payments: React.FC = () => {
  const { ventas, registrarPago } = usePayments();
  const [selectedVenta, setSelectedVenta] = useState<number | null>(null);
  const [metodoPago, setMetodoPago] = useState<string>('');
  const [monto, setMonto] = useState<number>(0);
  const [monedaCambio, setMonedaCambio] = useState<string>('');

  const handleRegistrarPago = async () => {
    if (!selectedVenta || !metodoPago || monto <= 0) {
      toast.error('Por favor, complete todos los campos');
      return;
    }

    try {
      await registrarPago(selectedVenta, metodoPago, monto, monedaCambio);
      toast.success('Pago registrado con éxito');
      setSelectedVenta(null);
      setMetodoPago('');
      setMonto(0);
      setMonedaCambio('');
    } catch (error) {
      toast.error('Error al registrar el pago');
    }
  };

  return (
    <div className="payments">
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">Payments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Ventas Pendientes</h2>
          <ul className="space-y-2">
            {ventas.map(venta => (
              <li key={venta.id_venta} className="flex justify-between items-center">
                <span>Venta #{venta.id_venta} - ${venta.total.toFixed(2)}</span>
                <button
                  onClick={() => setSelectedVenta(venta.id_venta)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Seleccionar
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Registrar Pago</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Venta Seleccionada</label>
              <input
                type="text"
                value={selectedVenta ? `Venta #${selectedVenta}` : ''}
                readOnly
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Seleccione un método</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Monto</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(Number(e.target.value))}
                  className="block w-full pl-10 pr-12 border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Moneda de Cambio</label>
              <input
                type="text"
                value={monedaCambio}
                onChange={(e) => setMonedaCambio(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                placeholder="USD, EUR, etc."
              />
            </div>
            <button
              onClick={handleRegistrarPago}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center"
            >
              <CreditCard className="mr-2" />
              Registrar Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;

