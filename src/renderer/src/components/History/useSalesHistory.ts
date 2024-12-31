import { useState, useEffect, useCallback } from 'react'

interface SaleItem {
  id_venta: number
  fecha_venta: string
  tasa_dolar: number
  total: number
  metodo_pago: string
}

interface SaleDetail extends SaleItem {
  monto: number
  moneda_cambio: string
  productos: {
    nombre: string
    cantidad: number
    precio_unitario: number
    subtotal: number
  }[]
}

export const useSalesHistory = (itemsPerPage: number = 10) => {
  const [sales, setSales] = useState<SaleItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchID, setSearchID] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)

  const fetchSales = useCallback(
    async (page: number, search: string) => {
      setIsLoading(true)
      setError(null)
      try {
        console.log('Fetching sales for page:', page, 'search:', search)
        const result = await window.electron.ipcRenderer.invoke(
          'get-sales-history',
          page,
          itemsPerPage,
          search
        )
        console.log('Received result:', result)
        setSales(result.sales)
        setTotalItems(result.totalCount)
        setTotalPages(Math.max(1, Math.ceil(result.totalCount / itemsPerPage)))
      } catch (err) {
        console.error('Error fetching sales:', err)
        setError('Error al cargar el historial de ventas')
      } finally {
        setIsLoading(false)
      }
    },
    [itemsPerPage]
  )

  useEffect(() => {
    console.log('Effect triggered. Current page:', currentPage, 'Search ID:', searchID)
    fetchSales(currentPage, searchID)
  }, [currentPage, searchID, fetchSales])

  const handleSearch = useCallback(() => {
    console.log('Handling search. Search ID:', searchID)
    setCurrentPage(1)
    fetchSales(1, searchID)
  }, [fetchSales, searchID])

  const handlePageChange = useCallback(
    (newPage: number) => {
      console.log('Changing page to:', newPage)
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage)
      }
    },
    [totalPages]
  )

  const getSaleDetails = async (id: number): Promise<SaleDetail> => {
    try {
      const result = await window.electron.ipcRenderer.invoke('get-sale-details', id)
      return result
    } catch (err) {
      console.error('Error fetching sale details:', err)
      throw new Error('Error al cargar los detalles de la venta')
    }
  }

  return {
    sales,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage: handlePageChange,
    searchID,
    setSearchID,
    handleSearch,
    getSaleDetails
  }
}
