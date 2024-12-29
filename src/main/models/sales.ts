import { getDb } from './db'

const PRODUCTOS_POR_PAGINA = 8

export async function getProductos(
  pagina: number,
  busqueda: string
): Promise<{ productos: Producto[]; totalPaginas: number }> {
  const db = await getDb()
  const offset = (pagina - 1) * PRODUCTOS_POR_PAGINA

  let query = 'SELECT * FROM productos WHERE activo = 1 AND stock > 0'
  let countQuery = 'SELECT COUNT(*) as total FROM productos WHERE activo = 1 AND stock > 0'
  const params: any[] = []

  if (busqueda) {
    query += ' AND nombre LIKE ?'
    countQuery += ' AND nombre LIKE ?'
    params.push(`%${busqueda}%`)
  }

  query += ' ORDER BY nombre LIMIT ? OFFSET ?'
  params.push(PRODUCTOS_POR_PAGINA, offset)

  const productos = await db.all(query, params)
  const { total } = await db.get(countQuery, busqueda ? [`%${busqueda}%`] : [])

  const totalPaginas = Math.ceil(total / PRODUCTOS_POR_PAGINA)

  return { productos, totalPaginas }
}

export async function realizarVenta(
  carrito: Array<{ id: number; cantidad: number }>,
  tasaDolar: number
): Promise<number> {
  const db = await getDb()
  await db.run('BEGIN TRANSACTION')

  try {
    const { lastID } = await db.run(
      'INSERT INTO ventas (fecha_venta, tasa_dolar) VALUES (datetime("now"), ?)',
      [tasaDolar]
    )

    for (const item of carrito) {
      const producto = await db.get('SELECT * FROM productos WHERE id_producto = ?', [item.id])
      if (!producto) throw new Error(`Producto no encontrado: ${item.id}`)

      await db.run(
        'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [lastID, item.id, item.cantidad, producto.precio_base, producto.precio_base * item.cantidad]
      )

      await db.run('UPDATE productos SET stock = stock - ? WHERE id_producto = ?', [
        item.cantidad,
        item.id
      ])
    }

    await db.run('COMMIT')
    return lastID
  } catch (error) {
    await db.run('ROLLBACK')
    throw error
  }
}

export async function registrarPago(
  id_venta: number,
  metodo_pago: string,
  monto: number,
  moneda_cambio: string
): Promise<void> {
  const db = await getDb()
  await db.run(
    'INSERT INTO pagos (id_venta, metodo_pago, monto, moneda_cambio) VALUES (?, ?, ?, ?)',
    [id_venta, metodo_pago, monto, moneda_cambio]
  )
}
