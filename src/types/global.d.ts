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

  interface AnalysisData {
    totalFacturadoBolivares: number
    totalFacturadoDolares: number
    productoMasVendido: string
    cantidadProductoMasVendido: number
    promedioVentaDiaria: number
    ventasPorHora: { hora: string; ventas: number }[]
    tasaDolarHistorica: { fecha: string; tasa: number }[]
    ventasPorProducto: { nombre: string; cantidad: number; total: number }[]
    ventasPorDiaSemana: { dia: string; ventas: number }[]
    ventasPorFecha: { fecha: string; ventas: number }[]
    productosMasVendidos: Producto[]
  }

  interface DolarRate {
    fuente: string
    nombre: string
    compra: number | null
    venta: number | null
    promedio: number
    fechaActualizacion: string
  }
  export interface DashboardData {
    totalProducts: number
    lowStockProducts: Array<{ nombre: string; stock: number }>
    topSellingProducts: Array<{ nombre: string; ventas: number }>
    cashInRegister: { bolivares: number; dolares: number }
    totalProductsSold: number
  }

  export interface DailyStats {
    ventas: number
    ventasDiff: number
    ganancia: number
    gananciaDiff: number
    cantidadVentas: number
    cantidadVentasDiff: number
    productosVendidos: number
    productosVendidosDiff: number
  }

  export interface ExchangeRates {
    oficial: number
    paralelo: number
    bitcoin: number
    promedio: number
    fechaActualizacion: string
  }
}

// Esto es necesario para que TypeScript trate este archivo como un módulo
export {}
