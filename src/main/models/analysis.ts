import { getDb } from './db'

export async function getAnalysisData(): Promise<AnalysisData> {
  const db = await getDb()

  const totalFacturado = await db.get(`
    SELECT 
      SUM(dv.subtotal) as totalBolivares,
      SUM(dv.subtotal / v.tasa_dolar) as totalDolares
    FROM detalle_ventas dv
    JOIN ventas v ON dv.id_venta = v.id_venta
  `)

  const productoMasVendido = await db.get(`
    SELECT p.nombre, SUM(dv.cantidad) as total_vendido
    FROM detalle_ventas dv
    JOIN productos p ON dv.id_producto = p.id_producto
    GROUP BY dv.id_producto
    ORDER BY total_vendido DESC
    LIMIT 1
  `)

  const promedioVenta = await db.get(`
    SELECT AVG(total_diario) as promedio
    FROM (
      SELECT SUM(dv.subtotal / v.tasa_dolar) as total_diario
      FROM detalle_ventas dv
      JOIN ventas v ON dv.id_venta = v.id_venta
      GROUP BY DATE(v.fecha_venta)
    )
  `)

  const ventasPorHora = await db.all(`
    SELECT 
      strftime('%H', v.fecha_venta) as hora,
      SUM(dv.subtotal / v.tasa_dolar) as ventas
    FROM detalle_ventas dv
    JOIN ventas v ON dv.id_venta = v.id_venta
    GROUP BY hora
    ORDER BY hora
  `)

  const tasaDolarHistorica = await db.all(`
    SELECT 
      DATE(fecha_venta) as fecha,
      AVG(tasa_dolar) as tasa
    FROM ventas
    GROUP BY DATE(fecha_venta)
    ORDER BY fecha
  `)

  const ventasPorProducto = await db.all(`
    SELECT 
      p.nombre,
      SUM(dv.cantidad) as cantidad,
      SUM(dv.subtotal) as total
    FROM detalle_ventas dv
    JOIN productos p ON dv.id_producto = p.id_producto
    GROUP BY dv.id_producto
    ORDER BY total DESC
    LIMIT 10
  `)

  return {
    totalFacturadoBolivares: totalFacturado.totalBolivares || 0,
    totalFacturadoDolares: totalFacturado.totalDolares || 0,
    productoMasVendido: productoMasVendido?.nombre || 'N/A',
    cantidadProductoMasVendido: productoMasVendido?.total_vendido || 0,
    promedioVentaDiaria: promedioVenta.promedio || 0,
    ventasPorHora,
    tasaDolarHistorica,
    ventasPorProducto
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const db = await getDb()

  const totalSales = await db.get(`
    SELECT SUM(dv.subtotal) as total
    FROM detalle_ventas dv
    JOIN ventas v ON dv.id_venta = v.id_venta
    WHERE DATE(v.fecha_venta) = DATE('now')
  `)

  const totalProducts = await db.get(`
    SELECT COUNT(*) as total FROM productos WHERE activo = 1
  `)

  const lowStockProducts = await db.all(`
    SELECT nombre, stock
    FROM productos
    WHERE stock < 10 AND activo = 1
    ORDER BY stock ASC
    LIMIT 5
  `)

  const topSellingProducts = await db.all(`
    SELECT p.nombre, SUM(dv.cantidad) as ventas
    FROM detalle_ventas dv
    JOIN productos p ON dv.id_producto = p.id_producto
    JOIN ventas v ON dv.id_venta = v.id_venta
    WHERE DATE(v.fecha_venta) = DATE('now')
    GROUP BY dv.id_producto
    ORDER BY ventas DESC
    LIMIT 5
  `)

  const dailyFacturation = await db.get(`
    SELECT 
      SUM(dv.subtotal) as bolivares,
      SUM(dv.subtotal / v.tasa_dolar) as dolares
    FROM detalle_ventas dv
    JOIN ventas v ON dv.id_venta = v.id_venta
    WHERE DATE(v.fecha_venta) = DATE('now')
  `)

  const cashInRegister = await db.get(`
    SELECT 
      SUM(CASE WHEN p.moneda_cambio = 'VES' THEN p.monto ELSE p.monto * v.tasa_dolar END) as bolivares,
      SUM(CASE WHEN p.moneda_cambio = 'USD' THEN p.monto ELSE p.monto / v.tasa_dolar END) as dolares
    FROM pagos p
    JOIN ventas v ON p.id_venta = v.id_venta
    WHERE DATE(v.fecha_venta) = DATE('now')
  `)

  const totalProductsSold = await db.get(`
    SELECT SUM(dv.cantidad) as total
    FROM detalle_ventas dv
    JOIN ventas v ON dv.id_venta = v.id_venta
    WHERE DATE(v.fecha_venta) = DATE('now')
  `)

  return {
    totalSales: totalSales.total || 0,
    totalProducts: totalProducts.total || 0,
    lowStockProducts: lowStockProducts || [],
    topSellingProducts: topSellingProducts || [],
    dailyFacturation: {
      bolivares: dailyFacturation?.bolivares || 0,
      dolares: dailyFacturation?.dolares || 0
    },
    cashInRegister: {
      bolivares: cashInRegister?.bolivares || 0,
      dolares: cashInRegister?.dolares || 0
    },
    totalProductsSold: totalProductsSold.total || 0
  }
}
