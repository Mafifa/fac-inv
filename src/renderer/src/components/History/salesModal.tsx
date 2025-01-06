import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';

interface SaleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleId: number;
  getSaleDetails: (id: number) => Promise<any>;
  isDarkMode: boolean;
}

const SaleDetailModal: React.FC<SaleDetailModalProps> = ({ isOpen, onClose, saleId, getSaleDetails, isDarkMode }) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-VE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl p-6 w-full max-w-2xl m-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Detalles de la Venta</h2>
          <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors duration-200`}>
            <X className="h-6 w-6" />
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className={`animate-spin h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
        ) : error ? (
          <div className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} text-center`}>{error}</div>
        ) : saleDetails ? (
          <div className="space-y-6">
            <div className={`grid grid-cols-2 gap-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID de Venta</p>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{saleDetails.id_venta}</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fecha de Venta</p>
                <p className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{formatDate(saleDetails.fecha_venta)}</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Método de Pago</p>
                <p className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{saleDetails.metodo_pago.toUpperCase()}</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tasa del Dólar</p>
                <p className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{saleDetails.tasa_dolar.toFixed(2)} Bs</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monto</p>
                <p className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{saleDetails.monto.toFixed(2)} {saleDetails.moneda_cambio}</p>
              </div>
            </div>
            <div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Productos</h3>
              <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Producto</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Cantidad</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Precio Unitario</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Subtotal</th>
                  </tr>
                </thead>
                <tbody className={`${isDarkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                  {saleDetails.productos.map((producto: any, index: number) => (
                    <tr key={index} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{producto.nombre}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{producto.cantidad}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>${producto.precio_unitario.toFixed(2)}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>${producto.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right">
              <p className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Total: ${saleDetails.total.toFixed(2)}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SaleDetailModal;

