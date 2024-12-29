import { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

interface SaleItem {
  id_venta: number
  fecha_venta: string
  total: number
  metodo_pago: string
}

interface SaleDetail {
  id_venta: number
  fecha_venta: string
  total: number
  metodo_pago: string
  tasa_dolar: number
  productos: {
    nombre: string
    cantidad: number
    precio_unitario: number
  }[]
}

export const useSalesHistory = (itemsPerPage: number = 10) => {
  const [sales, setSales] = useState<SaleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchSales()
  }, [currentPage, itemsPerPage])

  const fetchSales = async () => {
    try {
      setLoading(true)
      const result = await ipcRenderer.invoke('get-sales-history', currentPage, itemsPerPage)
      setSales(result.sales)
      setTotalPages(Math.ceil(result.totalCount / itemsPerPage))
      setError(null)
    } catch (err) {
      setError('Error al cargar el historial de ventas')
    } finally {
      setLoading(false)
    }
  }

  const getSaleDetails = async (id: number): Promise<SaleDetail> => {
    try {
      const result = await ipcRenderer.invoke('get-sale-details', id)
      return result
    } catch (err) {
      throw new Error('Error al cargar los detalles de la venta')
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return { sales, loading, error, fetchSales, getSaleDetails, currentPage, totalPages, goToPage }
}
