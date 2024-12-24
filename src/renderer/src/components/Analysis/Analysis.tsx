import React from 'react';
import { useAnalysis } from './useAnalysis';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { RefreshCw } from 'lucide-react';

const Analysis: React.FC = () => {
  const { analysisData, isLoading, error, refreshData } = useAnalysis();

  if (isLoading) {
    return <div className="text-center py-10">Cargando datos de análisis...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={refreshData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          <RefreshCw className="inline-block mr-2" size={16} />
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="analysis">
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">Análisis</h1>
      <button
        onClick={refreshData}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        <RefreshCw className="inline-block mr-2" size={16} />
        Actualizar datos
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Resumen de Ventas</h2>
          <ul className="space-y-2">
            <li>Total Facturado (Bs): {analysisData.totalFacturadoBolivares.toFixed(2)}</li>
            <li>Total Facturado ($): {analysisData.totalFacturadoDolares.toFixed(2)}</li>
            <li>Producto Más Vendido: {analysisData.productoMasVendido} ({analysisData.cantidadProductoMasVendido} unidades)</li>
            <li>Promedio de Venta Diaria ($): {analysisData.promedioVentaDiaria.toFixed(2)}</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Ventas por Hora</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analysisData.ventasPorHora}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#8884d8" name="Ventas ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Tasa del Dólar Histórica</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analysisData.tasaDolarHistorica}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tasa" stroke="#82ca9d" name="Tasa del Dólar" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Top 10 Productos Más Vendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analysisData.ventasPorProducto} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nombre" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#8884d8" name="Cantidad Vendida" />
              <Bar dataKey="total" fill="#82ca9d" name="Total Vendido ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analysis;

