import React from 'react';
import { useAnalysis } from './useAnalysis';
import { useAppContext } from '../../context/appContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { RefreshCw, ShoppingCart, TrendingUp, Calendar, Package } from 'lucide-react';

const Analysis: React.FC = () => {
  const { analysisData, isLoading, error, refreshData } = useAnalysis();
  const { config } = useAppContext();
  const isDarkMode = config.modoOscuro;

  if (isLoading) {
    return <div className={`text-center py-10 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cargando datos de análisis...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className={`mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
        <button
          onClick={refreshData}
          className={`px-4 py-2 rounded transition duration-300 ${isDarkMode
            ? 'bg-blue-700 text-white hover:bg-blue-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          <RefreshCw className="inline-block mr-2" size={16} />
          Intentar de nuevo
        </button>
      </div>
    );
  }

  const theme = {
    background: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-gray-200' : 'text-gray-800',
    title: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    chartColors: isDarkMode
      ? ['#60A5FA', '#34D399', '#FBBF24', '#F87171']
      : ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
  };

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatNumber = (value: number) => value.toFixed(0);

  const SummaryCard: React.FC<{ title: string; value: string; icon: React.ElementType; description?: string }> = ({ title, value, icon: Icon, description }) => (
    <div className={`${theme.background} p-6 rounded-lg shadow-md flex flex-col justify-between`}>
      <div className="flex items-center mb-2">
        <Icon className={`h-8 w-8 ${theme.title} mr-3`} />
        <div>
          <h3 className={`text-lg font-semibold ${theme.text}`}>{title}</h3>
          <p className={`text-2xl font-bold ${theme.title}`}>{value}</p>
        </div>
      </div>
      {description && <p className={`text-sm ${theme.text} mt-2`}>{description}</p>}
    </div>
  );

  const renderCalendarHeatmap = () => {
    const blueShades = [
      'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300',
      'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
      'bg-blue-800', 'bg-blue-900'
    ];

    const getColor = (sales: number) => {
      if (sales === 0) return isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
      const intensity = Math.min(Math.floor((sales / analysisData.maxVentasDiarias) * 10), 9);
      return blueShades[intensity];
    };

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const calendarDays: Array<{ date: Date; sales: number }> = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const salesData = analysisData.ventasPorFecha.find(item => item.fecha === dateStr);
      calendarDays.push({
        date: new Date(d),
        sales: salesData ? salesData.ventas : 0
      });
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`aspect-square relative rounded-md overflow-hidden ${getColor(day.sales)}`}
            title={`${day.date.toLocaleDateString()}: $${day.sales.toFixed(2)}`}
          >
            <span className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${day.sales > 0 ? (isDarkMode ? 'text-white' : 'text-gray-800') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
              }`}>
              {day.date.getDate()}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const formatHour = (hour: string) => {
    const hourNum = parseInt(hour, 10);
    if (hourNum === 0) return '12 AM';
    if (hourNum === 12) return '12 PM';
    return hourNum > 12 ? `${hourNum - 12} PM` : `${hourNum} AM`;
  };

  return (
    <div className={`analysis px-6 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={refreshData}
          className={`px-4 py-2 rounded transition duration-300 ${isDarkMode
            ? 'bg-blue-700 text-white hover:bg-blue-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          <RefreshCw className="inline-block mr-2" size={16} />
          Actualizar datos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <SummaryCard
          title="Producto Más Vendido"
          value={analysisData.productoMasVendido}
          icon={ShoppingCart}
          description={`${formatNumber(analysisData.cantidadProductoMasVendido)} unidades`}
        />
        <SummaryCard
          title="Promedio de Venta Diaria"
          value={formatCurrency(analysisData.promedioVentaDiaria)}
          icon={TrendingUp}
          description="Últimos 30 días"
        />
        <SummaryCard
          title="Total Productos Vendidos"
          value={formatNumber(analysisData.cantidadProductoMasVendido)}
          icon={Package}
          description="Unidades totales"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`${theme.background} p-6 rounded-lg shadow-md`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme.title}`}>Ventas por Hora</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analysisData.ventasPorHora}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey="hora"
                stroke={theme.text}
                tickFormatter={formatHour}
              />
              <YAxis stroke={theme.text} tickFormatter={formatCurrency} />
              <Tooltip
                contentStyle={{ backgroundColor: isDarkMode ? '#4B5563' : '#FFFFFF', borderColor: isDarkMode ? '#6B7280' : '#E5E7EB' }}
                labelStyle={{ color: isDarkMode ? '#E5E7EB' : '#374151' }}
                formatter={(value: number) => [formatCurrency(value), 'Ventas']}
                labelFormatter={(label) => `Hora: ${formatHour(label)}`}
              />
              <Legend />
              <Bar dataKey="ventas" fill={theme.chartColors[0]} name="Ventas ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={`${theme.background} p-6 rounded-lg shadow-md`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme.title}`}>Tasa del Dólar Histórica</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analysisData.tasaDolarHistorica}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="fecha" stroke={theme.text} />
              <YAxis stroke={theme.text} tickFormatter={formatNumber} />
              <Tooltip
                contentStyle={{ backgroundColor: isDarkMode ? '#4B5563' : '#FFFFFF', borderColor: isDarkMode ? '#6B7280' : '#E5E7EB' }}
                labelStyle={{ color: isDarkMode ? '#E5E7EB' : '#374151' }}
                formatter={(value: number) => [formatNumber(value), 'Tasa del Dólar']}
              />
              <Legend />
              <Line type="monotone" dataKey="tasa" stroke={theme.chartColors[1]} name="Tasa del Dólar" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`${theme.background} p-6 rounded-lg shadow-md`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme.title}`}>Ventas por Día de la Semana</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analysisData.ventasPorDiaSemana}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="dia" stroke={theme.text} />
              <YAxis stroke={theme.text} tickFormatter={formatCurrency} />
              <Tooltip
                contentStyle={{ backgroundColor: isDarkMode ? '#4B5563' : '#FFFFFF', borderColor: isDarkMode ? '#6B7280' : '#E5E7EB' }}
                labelStyle={{ color: isDarkMode ? '#E5E7EB' : '#374151' }}
                formatter={(value: number) => [formatCurrency(value), 'Ventas']}
              />
              <Legend />
              <Bar dataKey="ventas" fill={theme.chartColors[2]} name="Ventas ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={`${theme.background} p-6 rounded-lg shadow-md`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme.title}`}>Calendario de Ventas</h2>
          <div className="flex items-center justify-center mb-4">
            <Calendar className={`h-8 w-8 ${theme.title} mr-2`} />
            <span className={`text-lg ${theme.text}`}>Intensidad de Ventas por Día</span>
          </div>
          <div className="mt-4">
            {renderCalendarHeatmap()}
          </div>
        </div>
      </div>

      <div className={`${theme.background} p-6 rounded-lg shadow-md`}>
        <h2 className={`text-xl font-semibold mb-4 ${theme.title}`}>Productos Más Vendidos</h2>
        {analysisData.productosMasVendidos && analysisData.productosMasVendidos.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analysisData.productosMasVendidos} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis type="number" stroke={theme.text} />
              <YAxis dataKey="nombre" type="category" stroke={theme.text} width={150} />
              <Tooltip
                contentStyle={{ backgroundColor: isDarkMode ? '#4B5563' : '#FFFFFF', borderColor: isDarkMode ? '#6B7280' : '#E5E7EB' }}
                labelStyle={{ color: isDarkMode ? '#E5E7EB' : '#374151' }}
                formatter={(value: number) => [formatNumber(value), 'Unidades']}
              />
              <Legend />
              <Bar dataKey="cantidad" fill={theme.chartColors[3]} name="Unidades vendidas" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className={`text-center ${theme.text}`}>No hay datos disponibles</p>
        )}
      </div>
    </div>
  );
};

export default Analysis;

