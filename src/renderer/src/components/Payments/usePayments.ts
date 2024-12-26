import { useState, useEffect } from 'react'

export const usePayments = () => {
  const [ventas, setVentas] = useState<Venta[]>([])

  useEffect(() => {
    fetchVentas()
  }, [])

  const fetchVentas = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('get-ventas')
      setVentas(result)
    } catch (error) {
      console.error('Error fetching ventas:', error)
    }
  }

  const registrarPago = async (
    id_venta: number,
    metodo_pago: string,
    monto: number,
    moneda_cambio: string
  ) => {
    try {
      await window.electron.ipcRenderer.invoke(
        'registrar-pago',
        id_venta,
        metodo_pago,
        monto,
        moneda_cambio
      )
      fetchVentas() // Actualizar la lista de ventas después de registrar el pago
    } catch (error) {
      console.error('Error registrando pago:', error)
      throw error
    }
  }

  return { ventas, registrarPago }
}
