import { useState, useEffect } from 'react'

export const useSales = () => {
  const [productos, setProductos] = useState<Producto[]>([])

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('get-productos-venta')
      setProductos(result)
    } catch (error) {
      console.error('Error fetching productos para venta:', error)
    }
  }

  const realizarVenta = async (
    carrito: Array<{ id: number; cantidad: number }>,
    tasaDolar: number
  ) => {
    try {
      await window.electron.ipcRenderer.invoke('realizar-venta', carrito, tasaDolar)
      fetchProductos() // Actualizar la lista de productos después de la venta
    } catch (error) {
      console.error('Error realizando venta:', error)
      throw error
    }
  }

  return { productos, realizarVenta }
}
