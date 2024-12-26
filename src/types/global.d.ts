// src/types/global.d.ts

declare global {
  interface Error {
    code?: number // Ejemplo: agregar una propiedad opcional a la interfaz Error global
    message: string
  }

  export interface Producto {
    id_producto: number
    nombre: string
    precio_base: number
    stock: number
    activo: boolean
    descuento?: number
  }

  export interface Venta {
    id_venta: number
    total: number
  }

  export interface DetalleVenta {
    id_detalle: number
    id_venta: number
    id_producto: number
    cantidad: number
    precio_unitario: number
    subtotal: number
  }

  export interface Pago {
    id_pago: number
    id_venta: number
    metodo_pago: string
    monto: number
    moneda_cambio: string
  }

  export interface AnalysisData {
    totalFacturadoBolivares: number
    totalFacturadoDolares: number
    productoMasVendido: string
    cantidadProductoMasVendido: number
    promedioVentaDiaria: number
    ventasPorHora: Array<{ hora: string; ventas: number }>
    tasaDolarHistorica: Array<{ fecha: string; tasa: number }>
    ventasPorProducto: Array<{ nombre: string; cantidad: number; total: number }>
  }
}

// Esto es necesario para que TypeScript trate este archivo como un módulo
export {}
