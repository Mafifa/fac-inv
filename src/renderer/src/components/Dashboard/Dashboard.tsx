import React from 'react';
import { useDashboard } from './useDashboard';
import { DollarSign, ShoppingCart, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Package, ShoppingBag, BarChart2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const {
    totalProducts,
    lowStockProducts,
    topSellingProducts,
    cashInRegister,
    totalProductsSold,
    exchangeRates,
    dailyStats
  }: DashboardData & { exchangeRates: ExchangeRates, dailyStats: DailyStats } = useDashboard();

  const CardWrapper: React.FC<{ children: React.ReactNode, className?: string, accentColor?: string }> = ({ children, className, accentColor }) => (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className={`h-1 ${accentColor}`}></div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="dashboard bg-gray-100 p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Sección: Tasas del Dólar */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tasas del Dólar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Paralelo', value: exchangeRates.paralelo, icon: DollarSign, accentColor: 'bg-blue-500' },
            { title: 'Banco Central', value: exchangeRates.oficial, icon: DollarSign, accentColor: 'bg-green-500' },
            { title: 'Binance', value: exchangeRates.bitcoin, icon: DollarSign, accentColor: 'bg-yellow-500' },
            { title: 'Promedio', value: exchangeRates.promedio, icon: DollarSign, accentColor: 'bg-purple-500' },
          ].map((rate, index) => (
            <CardWrapper key={index} accentColor={rate.accentColor}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">{rate.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{rate.value.toFixed(2)} Bs</p>
                </div>
                <rate.icon className={`h-8 w-8 ${rate.accentColor.replace('bg-', 'text-')}`} />
              </div>
            </CardWrapper>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">Última actualización: {exchangeRates.fechaActualizacion}</p>
      </section>

      {/* Sección: Facturación del Día */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Facturación del Día</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardWrapper accentColor="bg-emerald-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Cantidad en caja (Bs)</p>
                <p className="text-2xl font-bold text-gray-800">{cashInRegister.bolivares.toFixed(2)} Bs</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500" />
            </div>
          </CardWrapper>
          <CardWrapper accentColor="bg-sky-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Cantidad en caja ($)</p>
                <p className="text-2xl font-bold text-gray-800">${cashInRegister.dolares.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-sky-500" />
            </div>
          </CardWrapper>
        </div>
      </section>

      {/* Sección: Inventario y Ventas */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inventario y Ventas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardWrapper accentColor="bg-indigo-500">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-gray-500">Total de productos vendidos</p>
              <ShoppingCart className="h-6 w-6 text-indigo-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalProductsSold}</p>
          </CardWrapper>
          <CardWrapper accentColor="bg-teal-500" className="h-full">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-gray-500">Productos más vendidos</p>
              <TrendingUp className="h-6 w-6 text-teal-500" />
            </div>
            <ul className="space-y-2">
              {topSellingProducts.map((product, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-gray-700">{product.nombre}</span>
                  <span className="font-semibold text-gray-800">{product.ventas} ventas</span>
                </li>
              ))}
            </ul>
          </CardWrapper>
          <CardWrapper accentColor="bg-amber-500" className="h-full">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-gray-500">Productos con poco stock</p>
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <ul className="space-y-2">
              {lowStockProducts.map((product, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-gray-700">{product.nombre}</span>
                  <span className="font-semibold text-gray-800">Stock: {product.stock}</span>
                </li>
              ))}
            </ul>
          </CardWrapper>
        </div>
      </section>

      {/* Información Crucial */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Información Crucial</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Ventas del día', value: dailyStats.ventas, diff: dailyStats.ventasDiff, icon: ShoppingBag, accentColor: 'bg-blue-500' },
            { title: 'Ganancia estimada', value: dailyStats.ganancia, diff: dailyStats.gananciaDiff, icon: DollarSign, accentColor: 'bg-green-500' },
            { title: 'Cantidad de ventas', value: dailyStats.cantidadVentas, diff: dailyStats.cantidadVentasDiff, icon: BarChart2, accentColor: 'bg-purple-500' },
            { title: 'Productos vendidos', value: dailyStats.productosVendidos, diff: dailyStats.productosVendidosDiff, icon: Package, accentColor: 'bg-orange-500' },
          ].map((stat, index) => (
            <CardWrapper key={index} accentColor={stat.accentColor}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <stat.icon className={`h-6 w-6 ${stat.accentColor.replace('bg-', 'text-')}`} />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {stat.title.includes('Ventas') || stat.title.includes('Ganancia') ? `$${stat.value.toFixed(2)}` : stat.value}
              </p>
              <p className={`text-sm ${stat.diff >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-2`}>
                {stat.diff >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                {Math.abs(stat.diff).toFixed(2)}% vs ayer
              </p>
            </CardWrapper>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

