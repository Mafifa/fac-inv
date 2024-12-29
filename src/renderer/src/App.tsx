import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Dashboard from './components/Dashboard/dashboard';
import Inventario from './components/Inventory/inventory';
import Ventas from './components/Sales/sales';
import Analisis from './components/Analysis/analysis';
import Historial from './components/History/history';
import Configuracion from './components/Settings/settings';
import { Home, Package, ShoppingCart, BarChart, History, Settings } from 'lucide-react';
import { DolarProvider } from './context/dolarContext';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'inventario', name: 'Inventario', icon: Package },
    { id: 'ventas', name: 'Ventas', icon: ShoppingCart },
    { id: 'historial', name: 'Historial', icon: History },
    { id: 'analisis', name: 'Análisis', icon: BarChart }
  ];

  return (
    <DolarProvider>
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Toaster position="top-center" closeButton duration={2500} richColors />
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Inventario App</h1>
              </div>
              <div className="flex items-center space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <tab.icon className="mr-2 h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="ml-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                  aria-label="Configuración"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'inventario' && <Inventario />}
            {activeTab === 'ventas' && <Ventas />}
            {activeTab === 'analisis' && <Analisis />}
            {activeTab === 'historial' && <Historial />}
          </div>
        </main>
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-md w-full m-4 transform transition-all duration-300 ease-in-out">
              <Configuracion onClose={() => setIsSettingsOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </DolarProvider>
  );
};

export default App;

