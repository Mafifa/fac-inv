import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/appContext'

export const useDashboard = () => {
  const { tasasDolar } = useAppContext()
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    lowStockProducts: [],
    topSellingProducts: [],
    cashInRegister: { bolivares: 0, dolares: 0 },
    totalProductsSold: 0
  })

  // Actualizar el tipo DailyStats
  const initialDailyStats: DailyStats = {
    ventas: 0,
    ventasDiff: 0,
    ganancia: 0,
    gananciaDiff: 0,
    cantidadVentas: 0,
    cantidadVentasDiff: 0,
    productosVendidos: 0,
    productosVendidosDiff: 0
  }

  // En la función useDashboard
  const [dailyStats, setDailyStats] = useState<DailyStats>(initialDailyStats)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await window.electron.ipcRenderer.invoke('get-dashboard-data')
        setDashboardData(result)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    const fetchDailyStats = async () => {
      try {
        const result = await window.electron.ipcRenderer.invoke('get-daily-stats')
        setDailyStats(result)
      } catch (error) {
        console.error('Error fetching daily stats:', error)
      }
    }

    fetchDashboardData()
    fetchDailyStats()
    // Actualizar cada 30 minutos
    const interval = setInterval(
      () => {
        fetchDashboardData()
        fetchDailyStats()
      },
      30 * 60 * 1000
    )

    return () => clearInterval(interval)
  }, [])

  const getExchangeRates = (): ExchangeRates => {
    const oficial = tasasDolar.find((tasa) => tasa.fuente === 'oficial')?.promedio || 0
    const paralelo = tasasDolar.find((tasa) => tasa.fuente === 'paralelo')?.promedio || 0
    const bitcoin = tasasDolar.find((tasa) => tasa.fuente === 'bitcoin')?.promedio || 0
    const promedio = (bitcoin + oficial) / 2
    const fechaActualizacion = tasasDolar[0]?.fechaActualizacion || ''

    return { oficial, paralelo, bitcoin, promedio, fechaActualizacion }
  }

  return {
    ...dashboardData,
    exchangeRates: getExchangeRates(),
    dailyStats
  }
}
