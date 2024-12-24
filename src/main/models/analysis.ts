import { getDb } from './db'
import { AnalysisData } from '../../renderer/src/interfaces'

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

