import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';

interface SaleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleId: number;
  getSaleDetails: (id: number) => Promise<any>;
}

const SaleDetailModal: React.FC<SaleDetailModalProps> = ({ isOpen, onClose, saleId, getSaleDetails }) => {
  const [saleDetails, setSaleDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSaleDetails();
    }
  }, [isOpen, saleId]);

  const fetchSaleDetails = async () => {
    try {
      setLoading(true);
      const details = await getSaleDetails(saleId);
      setSaleDetails(details);
      setError(null);
    } catch (err) {
      setError('Error al cargar los detalles de la venta');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Detalles de la Venta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : saleDetails ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">ID de Venta</p>
                <p className="text-lg font-semibold">{saleDetails.id_venta}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de Venta</p>
                <p className="text-lg">

                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Método de Pago</p>
                <p className="text-lg">{saleDetails.metodo_pago}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tasa del Dólar</p>
                <p className="text-lg">{saleDetails.tasa_dolar.toFixed(2)} Bs</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Productos</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {saleDetails.productos.map((producto: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.cantidad}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${producto.precio_unitario.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(producto.cantidad * producto.precio_unitario).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">Total: ${saleDetails.total.toFixed(2)}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SaleDetailModal;

