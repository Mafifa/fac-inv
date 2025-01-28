import React, { useState } from 'react'
import { Toaster } from 'sonner'
import Dashboard from './components/Dashboard/Dashboard'
import Inventario from './components/Inventory/Inventory'
import Ventas from './components/Sales/Sales'
import Analisis from './components/Analysis/Analysis'
import Historial from './components/History/history'
import Configuracion from './components/Settings/settings'
import { Home, Package, ShoppingCart, BarChart2, History, Settings, RefreshCw } from 'lucide-react'
import { useAppContext } from './context/appContext'

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const { config, updateTasasDolar } = useAppContext()

  const modoOscuro = config.modoOscuro

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'inventario', name: 'Inventario', icon: Package },
    { id: 'ventas', name: 'Ventas', icon: ShoppingCart },
    { id: 'historial', name: 'Historial', icon: History },
    { id: 'analisis', name: 'Análisis', icon: BarChart2 }
  ]

  const handleUpdater = async () => {
    await updateTasasDolar()
    await window.electron.ipcRenderer.invoke('update-tasas')
  }

  return (
    <div className={`flex flex-col h-screen ${modoOscuro ? 'dark' : ''}`}>
      <div className={`flex-1 ${modoOscuro ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Toaster position="top-center" closeButton duration={2500} richColors />
        <nav className={`${modoOscuro ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className={`text-2xl font-bold ${modoOscuro ? 'text-blue-400' : 'text-blue-600'} tracking-tight`}>VENDIBLE 1.0.3</h1>
              </div>
              <div className="flex items-center space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${activeTab === tab.id
                      ? modoOscuro
                        ? 'bg-blue-900 text-blue-200'
                        : 'bg-blue-50 text-blue-700 shadow-sm'
                      : modoOscuro
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <tab.icon className="mr-2 h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className={`ml-2 p-2 rounded-full ${modoOscuro
                    ? 'bg-blue-700 text-white hover:bg-blue-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out`}
                  aria-label="Configuración"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className={`flex-1 overflow-y-auto p-6 sm:p-8 ${modoOscuro ? 'text-white' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'inventario' && <Inventario />}
            {activeTab === 'ventas' && <Ventas />}
            {activeTab === 'analisis' && <Analisis />}
            {activeTab === 'historial' && <Historial />}
          </div>
        </main>
        {isSettingsOpen && (
          <Configuracion
            onClose={() => setIsSettingsOpen(false)}
          />
        )}

        {/* Botón flotante para actualizar tasas */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleUpdater}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={`p-3 rounded-full shadow-lg transition-all duration-200 ease-in-out ${modoOscuro
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-blue-500 text-white hover:bg-blue-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            aria-label="Actualizar tasas del dólar"
          >
            <RefreshCw className="h-6 w-6" />
          </button>

          {showTooltip && (
            <div
              className={`absolute bottom-full right-0 mb-2 p-2 rounded shadow-lg ${modoOscuro ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}
              style={{
                width: '200px',
                transform: 'translateX(16px)'
              }}
            >
              <p className="font-semibold mb-1">Actualizar tasas del dólar</p>
              <p className="text-sm">Las tasas se actualizan automáticamente cada 30 minutos. Haz clic para actualizar manualmente.</p>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 transform rotate-45 translate-y-1/2 ${modoOscuro ? 'bg-gray-800' : 'bg-white'
                  }`}
                style={{
                  right: '12px'
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

