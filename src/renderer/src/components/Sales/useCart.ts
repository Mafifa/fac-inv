import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export interface CartItem {
  id: number
  nombre: string
  precio_base: number
  cantidad: number
  stock: number
}

export const useCart = () => {
  const [carrito, setCarrito] = useState<CartItem[]>([])

  const agregarAlCarrito = useCallback((producto: Omit<CartItem, 'cantidad'>) => {
    setCarrito((prevCarrito) => {
      const itemExistente = prevCarrito.find((item) => item.id === producto.id)
      if (itemExistente) {
        if (itemExistente.cantidad < producto.stock) {
          return prevCarrito.map((item) =>
            item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
          )
        } else {
          toast.error(`No hay más stock disponible de ${producto.nombre}`)
          return prevCarrito
        }
      }
      return [...prevCarrito, { ...producto, cantidad: 1 }]
    })
  }, [])

  const actualizarCantidadCarrito = useCallback((id: number, nuevaCantidad: number) => {
    setCarrito((prevCarrito) =>
      prevCarrito
        .map((item) => {
          if (item.id === id) {
            if (nuevaCantidad > item.stock) {
              toast.error(`No hay suficiente stock de ${item.nombre}`)
              return item
            }
            return { ...item, cantidad: Math.max(0, nuevaCantidad) }
          }
          return item
        })
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
