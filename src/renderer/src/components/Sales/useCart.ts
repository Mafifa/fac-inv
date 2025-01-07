import { useState, useCallback } from 'react'

export interface CartItem {
  id: number
  nombre: string
  precio_base: number
  cantidad: number
}

export const useCart = () => {
  const [carrito, setCarrito] = useState<CartItem[]>([])

  const agregarAlCarrito = useCallback((producto: Omit<CartItem, 'cantidad'>) => {
    setCarrito((prevCarrito) => {
      const itemExistente = prevCarrito.find((item) => item.id === producto.id)
      if (itemExistente) {
        return prevCarrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      return [...prevCarrito, { ...producto, cantidad: 1 }]
    })
  }, [])

  const actualizarCantidadCarrito = useCallback((id: number, nuevaCantidad: number) => {
    setCarrito((prevCarrito) =>
      prevCarrito
        .map((item) => (item.id === id ? { ...item, cantidad: Math.max(0, nuevaCantidad) } : item))
        .filter((item) => item.cantidad > 0)
    )
  }, [])

  const limpiarCarrito = useCallback(() => {
    setCarrito([])
  }, [])

  const calcularTotal = useCallback(() => {
    return carrito.reduce((total, item) => total + item.precio_base * item.cantidad, 0)
  }, [carrito])

  return {
    carrito,
    agregarAlCarrito,
    actualizarCantidadCarrito,
    limpiarCarrito,
    calcularTotal
  }
}
