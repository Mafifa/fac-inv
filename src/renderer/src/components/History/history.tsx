import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader, Search } from 'lucide-react';
import { useSalesHistory } from './useSalesHistory';
import SaleDetailModal from './salesModal';

const History: React.FC = () => {
  const {
    sales,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
    searchID,
    setSearchID,
    handleSearch,
    getSaleDetails
  } = useSalesHistory(10);

  const [selectedSale, setSelectedSale] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSaleClick = (id: number) => {
    setSelectedSale(id);
    setModalOpen(true);
  };

  const handlePageChange = useCallback((newPage: number) => {
    console.log('Page change requested to:', newPage);
    setCurrentPage(newPage);
  }, [setCurrentPage]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        Historial de Ventas
        {totalItems > 0 && (
          <span className="text-sm ml-2 font-normal">({totalItems} ventas en total)</span>
        )}
      </h2>
      <div className="p-6">
        <div className="mb-4 flex space-x-4">
          <div className="flex items-center">
            <input
              type="text"
              value={searchID}
              onChange={(e) => setSearchID(e.target.value)}
              onKeyPress={handleKeyPress}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar por ID de venta"
            />
            <button
              onClick={handleSearch}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método de Pago</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasa del Dólar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <Loader className="animate-spin inline-block mr-2" />
                    Cargando...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No se encontraron resultados
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr
                    key={sale.id_venta}
                    onClick={() => handleSaleClick(sale.id_venta)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.id_venta}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(sale.fecha_venta)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.metodo_pago.toUpperCase()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.tasa_dolar.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      {selectedSale && (
        <SaleDetailModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          saleId={selectedSale}
          getSaleDetails={getSaleDetails}
        />
      )}
    </div>
  );
};

export default History;

