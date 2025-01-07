import React, { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import Dashboard from './components/Dashboard/dashboard'
import Inventario from './components/Inventory/inventory'
import Ventas from './components/Sales/sales'
import Analisis from './components/Analysis/analysis'
import Historial from './components/History/history'
import Configuracion from './components/Settings/settings'
import UpdateModal from './components/updateModal'
import { Home, Package, ShoppingCart, BarChart2, History, Settings } from 'lucide-react'
import { useAppContext } from './context/appContext'

interface UpdateInfo {
  version: string
  releaseDate: string
  files: { size: number }[]
}
// interface ProgressInfo {
//   percent: number
//   bytesPerSecond: number
// }

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)

  useEffect(() => {
    // Escuchar el evento 'update-available' desde el preload
    window.api.onUpdateAvailable((info: UpdateInfo) => {
      setUpdateInfo(info)
      if (updateInfo) {
        setIsUpdateModalOpen(true)
      }
    })
  }, [])

  const { config } = useAppContext()

  const modoOscuro = config.modoOscuro

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'inventario', name: 'Inventario', icon: Package },
    { id: 'ventas', name: 'Ventas', icon: ShoppingCart },
    { id: 'historial', name: 'Historial', icon: History },
    { id: 'analisis', name: 'Análisis', icon: BarChart2 }
  ]

  // const handleStartDownload = () => {
  //   window.electron.ipcRenderer.invoke('start-download')
  // }

  // const handleInstallUpdate = () => {
  //   window.electron.ipcRenderer.invoke('quit-and-install')
  // }

  return (
    <div className={`flex flex-col h-screen ${modoOscuro ? 'dark' : ''}`}>
      <div className={`flex-1 ${modoOscuro ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Toaster position="top-center" closeButton duration={2500} richColors />
        <nav className={`${modoOscuro ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className={`text-2xl font-bold ${modoOscuro ? 'text-blue-400' : 'text-blue-600'} tracking-tight`}>VENDIBLE</h1>
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
        <UpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          updateInfo={updateInfo}
        />
      </div>
    </div>
  );
};

export default App;

