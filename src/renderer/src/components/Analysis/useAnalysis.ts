import { useState, useEffect } from 'react'

interface RenderAnalysisData extends AnalysisData {
  maxVentasDiarias: number
}

const initialAnalysisData: RenderAnalysisData = {
  totalFacturadoBolivares: 0,
  totalFacturadoDolares: 0,
  productoMasVendido: '',
  cantidadProductoMasVendido: 0,
  promedioVentaDiaria: 0,
  ventasPorHora: [],
  tasaDolarHistorica: [],
  ventasPorProducto: [],
  ventasPorDiaSemana: [],
  ventasPorFecha: [], // Estar pendiente de que las fechas sean por mes
  productosMasVendidos: [],
  maxVentasDiarias: 0
}

export const useAnalysis = () => {
  const [analysisData, setAnalysisData] = useState<RenderAnalysisData>(initialAnalysisData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalysisData()
  }, [])

  const fetchAnalysisData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await window.electron.ipcRenderer.invoke('get-analysis-data')
      const maxVentasDiarias = Math.max(
        ...result.ventasPorFecha.map((item: { ventas: number }) => item.ventas)
      )
      setAnalysisData({ ...result, maxVentasDiarias })
    } catch (error) {
      console.error('Error fetching analysis data:', error)
      setError('Error al cargar los datos de análisis')
    } finally {
      setIsLoading(false)
    }
  }

  return { analysisData, isLoading, error, refreshData: fetchAnalysisData }
}
