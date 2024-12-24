import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Dashboard from './components/Dashboard/Dashboard';
import Inventory from './components/Inventory/Inventory';
import Sales from './components/Sales/Sales';
import Payments from './components/Payments/Payments';
import Analysis from './components/Analysis/Analysis';
import { Home, Package, ShoppingCart, CreditCard, BarChart } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'sales', name: 'Sales', icon: ShoppingCart },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'analysis', name: 'Analysis', icon: BarChart },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster position="top-right" />
      <nav className="w-64 bg-white shadow-lg">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-semibold text-blue-600">Inventory App</h1>
        </div>
        <ul className="mt-6">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium ${activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                  }`}
              >
                <tab.icon className="mr-3 h-6 w-6" />
                {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'sales' && <Sales />}
        {activeTab === 'payments' && <Payments />}
        {activeTab === 'analysis' && <Analysis />}
      </main>
    </div>
  );
};

export default App;