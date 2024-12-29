import { getDb } from './db'

export async function getSalesHistory(offset: number, limit: number) {
  const db = await getDb()
  const salesHistory = await db.all(
    `
    SELECT v.id_venta, v.fecha_venta, v.total, p.metodo_pago
    FROM ventas v
    JOIN pagos p ON v.id_venta = p.id_venta
    ORDER BY v.fecha_venta DESC
    LIMIT ? OFFSET ?
  `,
    limit,
    offset
  )
  return salesHistory
}

export async function getTotalSalesCount() {
  const db = await getDb()
  const result = await db.get('SELECT COUNT(*) as count FROM ventas')
  return result.count
}

export async function getSaleDetails(id: number) {
  const db = await getDb()
  const saleDetails = await db.get(
    `
    SELECT v.id_venta, v.fecha_venta, v.total, v.tasa_dolar, p.metodo_pago
    FROM ventas v
    JOIN pagos p ON v.id_venta = p.id_venta
    WHERE v.id_venta = ?
  `,
    id
  )

  const productos = await db.all(
    `
    SELECT p.nombre, dv.cantidad, dv.precio_unitario
    FROM detalle_ventas dv
    JOIN productos p ON dv.id_producto = p.id_producto
    WHERE dv.id_venta = ?
  `,
    id
  )

  return { ...saleDetails, productos }
}
