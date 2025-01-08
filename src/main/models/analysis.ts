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

  const ventasPorDiaSemana = await db.all(`
    SELECT 
      CASE CAST(strftime('%w', v.fecha_venta) AS INTEGER)
        WHEN 0 THEN 'Domingo'
        WHEN 1 THEN 'Lunes'
        WHEN 2 THEN 'Martes'
        WHEN 3 THEN 'Miércoles'
        WHEN 4 THEN 'Jueves'
        WHEN 5 THEN 'Viernes'
        WHEN 6 THEN 'Sábado'
      END as dia,
      SUM(dv.subtotal / v.tasa_dolar) as ventas
    FROM detalle_ventas dv
    JOIN ventas v ON dv.id_venta = v.id_venta
    GROUP BY strftime('%w', v.fecha_venta)
    ORDER BY strftime('%w', v.fecha_venta)
  `)

  const ventasPorFecha = await db.all(`
    SELECT 
      DATE(v.fecha_venta) as fecha,
      SUM(dv.subtotal / v.tasa_dolar) as ventas
    FROM detalle_ventas dv
    JOIN ventas v ON dv.id_venta = v.id_venta
    GROUP BY DATE(v.fecha_venta)
    ORDER BY fecha
    LIMIT 30
  `)

  const productosMasVendidos = (await db.all(`
    SELECT 
      p.nombre,
      SUM(dv.cantidad) as cantidad,
      SUM(dv.subtotal / v.tasa_dolar) as total
    FROM detalle_ventas dv
    JOIN productos p ON dv.id_producto = p.id_producto
    JOIN ventas v ON dv.id_venta = v.id_venta
    GROUP BY dv.id_producto
    ORDER BY cantidad DESC
    LIMIT 5
  `)) as Producto[]

  return {
    totalFacturadoBolivares: totalFacturado.totalBolivares || 0,
    totalFacturadoDolares: totalFacturado.totalDolares || 0,
    productoMasVendido: productoMasVendido?.nombre || 'N/A',
    cantidadProductoMasVendido: productoMasVendido?.total_vendido || 0,
    promedioVentaDiaria: promedioVenta.promedio || 0,
    ventasPorHora,
    tasaDolarHistorica,
    ventasPorProducto,
    ventasPorDiaSemana,
    ventasPorFecha,
    productosMasVendidos
  }
}
