import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'

export const useInventario = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [totalProductos, setTotalProductos] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const isMounted = useRef(true)

  const fetchProductos = useCallback(async (page: number, search: string) => {
    if (!isMounted.current) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await window.electron.ipcRenderer.invoke(
        'get-productos-recientes',
        page,
        search || null
      )
      if (isMounted.current) {
        setProductos(result.productos)
        setTotalProductos(result.total)
      }
    } catch (error) {
      console.error('Error fetching productos:', error)
      if (isMounted.current) {
        setError('Error al cargar los productos. Por favor, intente de nuevo.')
        toast.error('Error al cargar los productos')
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    fetchProductos(paginaActual, busqueda)
    return () => {
      isMounted.current = false
    }
  }, [fetchProductos, paginaActual, busqueda])

  const addProducto = useCallback(
    async (producto: Producto) => {
      try {
        await window.electron.ipcRenderer.invoke('add-producto', producto)
        setPaginaActual(1)
        setBusqueda('')
        fetchProductos(1, '')
        toast.success('Producto agregado exitosamente')
      } catch (error) {
        console.error('Error adding producto:', error)
        toast.error('Error al agregar el producto')
      }
    },
    [fetchProductos]
  )

  const updateProducto = useCallback(
    async (producto: Producto) => {
      try {
        await window.electron.ipcRenderer.invoke('update-producto', producto)
        fetchProductos(paginaActual, busqueda)
        toast.success('Producto actualizado exitosamente')
      } catch (error) {
        console.error('Error updating producto:', error)
        toast.error('Error al actualizar el producto')
      }
    },
    [fetchProductos, paginaActual, busqueda]
  )

  const disableProducto = useCallback(
    async (id: number) => {
      try {
        await window.electron.ipcRenderer.invoke('disable-producto', id)
        fetchProductos(paginaActual, busqueda)
        toast.success('Producto deshabilitado exitosamente')
      } catch (error) {
        console.error('Error disabling producto:', error)
        toast.error('Error al deshabilitar el producto')
      }
    },
    [fetchProductos, paginaActual, busqueda]
  )

  const deleteProducto = useCallback(
    async (id: number) => {
      try {
        await window.electron.ipcRenderer.invoke('delete-producto', id)
        fetchProductos(paginaActual, busqueda)
        toast.success('Producto eliminado exitosamente')
      } catch (error) {
        console.error('Error deleting producto:', error)
        toast.error('Error al eliminar el producto')
      }
    },
    [fetchProductos, paginaActual, busqueda]
  )

  const searchProductos = useCallback((query: string) => {
    setBusqueda(query)
    setPaginaActual(1)
  }, [])

  const changePage = useCallback((newPage: number) => {
    setPaginaActual(newPage)
  }, [])

  return {
    productos,
    totalProductos,
    paginaActual,
    setPaginaActual: changePage,
    busqueda,
    addProducto,
    updateProducto,
    disableProducto,
    deleteProducto,
    searchProductos,
    isLoading,
    error
  }
}
