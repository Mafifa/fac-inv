import { useState, useCallback, useEffect } from 'react'

export const useVentas = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [carrito, setCarrito] = useState<Array<{ id: number; cantidad: number }>>([])
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

  const agregarAlCarrito = useCallback((id: number) => {
    setCarrito((prevCarrito) => {
      const itemExistente = prevCarrito.find((item) => item.id === id)
      if (itemExistente) {
        return prevCarrito.map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      return [...prevCarrito, { id, cantidad: 1 }]
    })
  }, [])

  const actualizarCantidadCarrito = useCallback((id: number, nuevaCantidad: number) => {
    setCarrito((prevCarrito) =>
      prevCarrito
        .map((item) => (item.id === id ? { ...item, cantidad: Math.max(0, nuevaCantidad) } : item))
        .filter((item) => item.cantidad > 0)
    )
  }, [])

  const realizarVenta = useCallback(
    async (carritoActual: Array<{ id: number; cantidad: number }>, tasaDolar: number) => {
      try {
        const idVenta = await window.electron.ipcRenderer.invoke(
          'realizar-venta',
          carritoActual,
          tasaDolar
        )
        return idVenta
      } catch (error) {
        console.error('Error realizando venta:', error)
        throw error
      }
    },
    []
  )

  const registrarPago = useCallback(
    async (
      idVenta: number,
      metodoPago: string,
      montoPagado: number | null,
      monedaCambio: string
    ) => {
      try {
        await window.electron.ipcRenderer.invoke(
          'registrar-pago',
          idVenta,
          metodoPago,
          montoPagado,
          monedaCambio
        )
      } catch (error) {
        console.error('Error registrando pago:', error)
        throw error
      }
    },
    []
  )

  const limpiarCarrito = useCallback(() => {
    setCarrito([])
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
    carrito,
    paginaActual,
    totalPaginas,
    filtroBusqueda,
    buscarProductos,
    agregarAlCarrito,
    actualizarCantidadCarrito,
    realizarVenta,
    registrarPago,
    limpiarCarrito,
    cambiarPagina
  }
}
