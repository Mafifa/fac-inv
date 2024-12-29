import { getDb } from './db'

export async function getDashboardData(): Promise<DashboardData> {
  const db = await getDb()

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
    totalProducts: totalProducts.total || 0,
    lowStockProducts: lowStockProducts || [],
    topSellingProducts: topSellingProducts || [],
    cashInRegister: {
      bolivares: cashInRegister?.bolivares || 0,
      dolares: cashInRegister?.dolares || 0
    },
    totalProductsSold: totalProductsSold.total || 0
  }
}

export async function getDailyStats(): Promise<DailyStats> {
  const db = await getDb()

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const getStats = async (date: string) => {
    const ventas = await db.get(
      `
      SELECT SUM(dv.subtotal) as total
      FROM detalle_ventas dv
      JOIN ventas v ON dv.id_venta = v.id_venta
      WHERE DATE(v.fecha_venta) = ?
    `,
      [date]
    )

    const cantidadVentas = await db.get(
      `
      SELECT COUNT(*) as total
      FROM ventas
      WHERE DATE(fecha_venta) = ?
    `,
      [date]
    )

    const costoVentas = await db.get(
      `
      SELECT SUM(p.precio_base * dv.cantidad) as total
      FROM detalle_ventas dv
      JOIN productos p ON dv.id_producto = p.id_producto
      JOIN ventas v ON dv.id_venta = v.id_venta
      WHERE DATE(v.fecha_venta) = ?
    `,
      [date]
    )

    const productosVendidos = await db.get(
      `
      SELECT SUM(dv.cantidad) as total
      FROM detalle_ventas dv
      JOIN ventas v ON dv.id_venta = v.id_venta
      WHERE DATE(v.fecha_venta) = ?
    `,
      [date]
    )

    return {
      ventas: ventas.total || 0,
      cantidadVentas: cantidadVentas.total || 0,
      costoVentas: costoVentas.total || 0,
      productosVendidos: productosVendidos.total || 0
    }
  }

  const statsToday = await getStats(today)
  const statsYesterday = await getStats(yesterday)

  const calcularPorcentajeDiferencia = (hoy: number, ayer: number) => {
    if (ayer === 0) return hoy > 0 ? 100 : 0
    return ((hoy - ayer) / ayer) * 100
  }

  return {
    ventas: statsToday.ventas,
    ventasDiff: calcularPorcentajeDiferencia(statsToday.ventas, statsYesterday.ventas),
    ganancia: statsToday.ventas - statsToday.costoVentas,
    gananciaDiff: calcularPorcentajeDiferencia(
      statsToday.ventas - statsToday.costoVentas,
      statsYesterday.ventas - statsYesterday.costoVentas
    ),
    cantidadVentas: statsToday.cantidadVentas,
    cantidadVentasDiff: calcularPorcentajeDiferencia(
      statsToday.cantidadVentas,
      statsYesterday.cantidadVentas
    ),
    productosVendidos: statsToday.productosVendidos,
    productosVendidosDiff: calcularPorcentajeDiferencia(
      statsToday.productosVendidos,
      statsYesterday.productosVendidos
    )
  }
}
