import React from 'react';
import { useDashboard } from './useDashboard';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { totalSales, totalProducts, lowStockProducts, topSellingProducts } = useDashboard();

  return (
    <div className="dashboard">
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-blue-500 mr-4" />
            <div>
              <p className="text-gray-500">Total Sales</p>
              <p className="text-2xl font-semibold">${totalSales.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Package className="h-10 w-10 text-green-500 mr-4" />
            <div>
              <p className="text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <ShoppingCart className="h-10 w-10 text-yellow-500 mr-4" />
            <div>
              <p className="text-gray-500">Low Stock Products</p>
              <p className="text-2xl font-semibold">{lowStockProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <TrendingUp className="h-10 w-10 text-purple-500 mr-4" />
            <div>
              <p className="text-gray-500">Top Selling Product</p>
              <p className="text-2xl font-semibold">{topSellingProducts[0]?.name || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Top Selling Products</h2>
        <ul>
          {topSellingProducts.map((product, index) => (
            <li key={product.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span>{index + 1}. {product.name}</span>
              <span className="text-gray-500">{product.sales} sales</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
