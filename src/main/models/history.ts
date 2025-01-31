import { getDb } from './db'

export async function getSalesHistory(offset: number, limit: number, searchId: string | null) {
  const db = await getDb()

  let query = `
    WITH numbered_sales AS (
      SELECT 
        v.id_venta, 
        v.fecha_venta, 
        v.tasa_dolar,
        SUM(dv.subtotal) AS total, 
        p.metodo_pago,
        ROW_NUMBER() OVER (ORDER BY v.fecha_venta DESC, v.id_venta DESC) AS row_num
      FROM ventas v
      JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
      JOIN pagos p ON v.id_venta = p.id_venta
  `

  const params: any[] = []

  if (searchId !== null && searchId.trim() !== '') {
    query += ' WHERE CAST(v.id_venta AS TEXT) LIKE ?'
    params.push(`%${searchId}%`)
  }

  query += `
      GROUP BY v.id_venta, v.fecha_venta, v.tasa_dolar, p.metodo_pago
    )
    SELECT 
      id_venta, 
      fecha_venta, 
      tasa_dolar,
      total,
      metodo_pago
    FROM numbered_sales
    WHERE row_num > ? AND row_num <= ?
    ORDER BY row_num ASC
  `

  // Ajustamos el offset para que coincida con el rango paginado
  params.push(offset, offset + limit)

  const salesHistory = await db.all(query, ...params)
  return salesHistory
}

export async function getTotalSalesCount(searchId: string | null) {
  const db = await getDb()

  let query = `
    SELECT COUNT(DISTINCT v.id_venta) AS count 
    FROM ventas v
  `

  const params: any[] = []

  if (searchId !== null && searchId.trim() !== '') {
    query += ' WHERE CAST(v.id_venta AS TEXT) LIKE ?'
    params.push(`%${searchId}%`)
  }

  const result = await db.get(query, ...params)
  return result.count
}

export async function getSaleDetails(id: number) {
  const db = await getDb()

  const saleDetails = await db.get(
    `
    SELECT 
      v.id_venta, 
      v.fecha_venta, 
      v.tasa_dolar,
      SUM(dv.subtotal) AS total, 
      p.metodo_pago, 
      p.monto, 
      p.moneda_cambio
    FROM ventas v
    JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
    JOIN pagos p ON v.id_venta = p.id_venta
    WHERE v.id_venta = ?
    GROUP BY v.id_venta, v.fecha_venta, v.tasa_dolar, p.metodo_pago, p.monto, p.moneda_cambio
  `,
    id
  )

  const productos = await db.all(
    `
    SELECT 
      p.nombre, 
      dv.cantidad, 
      dv.precio_unitario, 
      dv.subtotal
    FROM detalle_ventas dv
    JOIN productos p ON dv.id_producto = p.id_producto
    WHERE dv.id_venta = ?
  `,
    id
  )

  return { ...saleDetails, productos }
}
