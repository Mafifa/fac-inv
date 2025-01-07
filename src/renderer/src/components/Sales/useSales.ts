import { useState, useCallback, useEffect } from 'react'

export interface Producto {
  id_producto: number
  nombre: string
  precio_base: number
}

export const useSales = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [filtroBusqueda, setFiltroBusqueda] = useState('')

  const obtenerProductos = useCallback(async (pagina: number, busqueda: string) => {
    try {
      const result = await window.electron.ipcRenderer.invoke(
        'get-productos-venta',
        pagina,
        busqueda
      )
      setProductos(result.productos)
      setTotalPaginas(result.totalPaginas)
    } catch (error) {
      console.error('Error fetching productos para venta:', error)
    }
  }, [])

  useEffect(() => {
    obtenerProductos(paginaActual, filtroBusqueda)
  }, [paginaActual, filtroBusqueda, obtenerProductos])

  const buscarProductos = useCallback((query: string) => {
    setFiltroBusqueda(query)
    setPaginaActual(1)
  }, [])

  const cambiarPagina = useCallback(
    (nuevaPagina: number) => {
      if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        setPaginaActual(nuevaPagina)
      }
    },
    [totalPaginas]
  )

  return {
    productos,
    paginaActual,
    totalPaginas,
    filtroBusqueda,
    buscarProductos,
    cambiarPagina
  }
}
