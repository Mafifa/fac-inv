import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Dashboard from './components/Dashboard/dashboard';
import Inventario from './components/Inventory/inventory';
import Ventas from './components/Sales/sales';
import Pagos from './components/Payments/payments';
import Analisis from './components/Analysis/analysis';
import { Home, Package, ShoppingCart, CreditCard, BarChart } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'inventario', name: 'Inventario', icon: Package },
    { id: 'ventas', name: 'Ventas', icon: ShoppingCart },
    { id: 'pagos', name: 'Pagos', icon: CreditCard },
    { id: 'analisis', name: 'Análisis', icon: BarChart },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Toaster position="top-right" />
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-semibold text-blue-600">Inventario App</h1>
              </div>
            </div>
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <tab.icon className="mr-1 h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'inventario' && <Inventario />}
        {activeTab === 'ventas' && <Ventas />}
        {activeTab === 'pagos' && <Pagos />}
        {activeTab === 'analisis' && <Analisis />}
      </main>
    </div>
  );
};

export default App;

