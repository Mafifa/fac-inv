import { useState, useEffect } from 'react'

const initialAnalysisData: AnalysisData = {
  totalFacturadoBolivares: 0,
  totalFacturadoDolares: 0,
  productoMasVendido: '',
  cantidadProductoMasVendido: 0,
  promedioVentaDiaria: 0,
  ventasPorHora: [],
  tasaDolarHistorica: [],
  ventasPorProducto: []
}

export const useAnalysis = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData>(initialAnalysisData)
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
      setAnalysisData(result)
    } catch (error) {
      console.error('Error fetching analysis data:', error)
      setError('Error al cargar los datos de análisis')
    } finally {
      setIsLoading(false)
    }
  }

  return { analysisData, isLoading, error, refreshData: fetchAnalysisData }
}
