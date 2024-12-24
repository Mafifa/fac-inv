export interface Producto {
  id_producto: number;
  nombre: string;
  precio_base: number;
  stock: number;
  activo: boolean;
}

export interface Venta {
  id_venta: number;
  total: number;
}

export interface DetalleVenta {
  id_detalle: number;
  id_venta: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Pago {
  id_pago: number;
  id_venta: number;
  metodo_pago: string;
  monto: number;
  moneda_cambio: string;
}

export interface AnalysisData {
  totalFacturadoBolivares: number;
  totalFacturadoDolares: number;
  productoMasVendido: string;
  cantidadProductoMasVendido: number;
  promedioVentaDiaria: number;
  ventasPorHora: Array<{ hora: string; ventas: number }>;
  tasaDolarHistorica: Array<{ fecha: string; tasa: number }>;
  ventasPorProducto: Array<{ nombre: string; cantidad: number; total: number }>;
}

