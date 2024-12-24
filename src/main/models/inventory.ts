import { getDb } from './db'
import { Producto } from '../../renderer/src/interfaces'

export async function getProductos(): Promise<Producto[]> {
  const db = await getDb()
  return await db.all('SELECT * FROM productos WHERE activo = 1')
}

export async function addProducto(producto: Producto): Promise<void> {
  const db = await getDb()
  await db.run(
    'INSERT INTO productos (nombre, precio_base, stock) VALUES (?, ?, ?)',
    [producto.nombre, producto.precio_base, producto.stock]
  )
}

export async function updateProducto(producto: Producto): Promise<void> {
  const db = await getDb()
  await db.run(
    'UPDATE productos SET nombre = ?, precio_base = ?, stock = ? WHERE id_producto = ?',
    [producto.nombre, producto.precio_base, producto.stock, producto.id_producto]
  )
}

export async function disableProducto(id: number): Promise<void> {
  const db = await getDb()
  await db.run('UPDATE productos SET activo = 0 WHERE id_producto = ?', [id])
}

