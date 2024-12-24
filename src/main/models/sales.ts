import { getDb } from './db'
import { Producto } from '../../renderer/src/interfaces'

export async function getProductos(): Promise<Producto[]> {
  const db = await getDb()
  return await db.all('SELECT * FROM productos WHERE activo = 1 AND stock > 0')
}

export async function realizarVenta(carrito: Array<{ id: number; cantidad: number }>, tasaDolar: number): Promise<void> {
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

      await db.run(
        'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
        [item.cantidad, item.id]
      )
    }

    await db.run('COMMIT')
  } catch (error) {
    await db.run('ROLLBACK')
    throw error
  }
}

