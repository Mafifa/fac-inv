import { getDb } from './db'

export async function getProductosRecientes(
  page: number,
  searchQuery: string | null
): Promise<{ productos: Producto[]; total: number }> {
  const db = await getDb()
  const productosPorPagina = 7
  const offset = (page - 1) * productosPorPagina

  let query = 'SELECT * FROM productos WHERE 1=1'
  let countQuery = 'SELECT COUNT(*) as total FROM productos WHERE 1=1'
  let params: any[] = []

  if (searchQuery) {
    query += ' AND nombre LIKE ?'
    countQuery += ' AND nombre LIKE ?'
    params.push(`%${searchQuery}%`)
  }

  query += ' ORDER BY id_producto DESC LIMIT ? OFFSET ?'
  params.push(productosPorPagina, offset)

  try {
    const productos = await db.all(query, params)
    const { total } = await db.get(countQuery, searchQuery ? [`%${searchQuery}%`] : [])

    return { productos, total }
  } catch (error) {
    console.error('Error al obtener productos:', error)
    throw new Error('Error al obtener productos de la base de datos')
  }
}

export async function addProducto(producto: Producto): Promise<number> {
  const db = await getDb()
  try {
    const result = await db.run(
      'INSERT INTO productos (nombre, precio_base, stock, descuento, activo) VALUES (?, ?, ?, ?, 1)',
      [producto.nombre, producto.precio_base, producto.stock, producto.descuento || 0]
    )
    return result.lastID as number
  } catch (error) {
    console.error('Error al agregar producto:', error)
    throw new Error('Error al agregar producto a la base de datos')
  }
}

export async function updateProducto(producto: Producto): Promise<void> {
  const db = await getDb()
  try {
    await db.run(
      'UPDATE productos SET nombre = ?, precio_base = ?, stock = ?, descuento = ? WHERE id_producto = ?',
      [
        producto.nombre,
        producto.precio_base,
        producto.stock,
        producto.descuento || 0,
        producto.id_producto
      ]
    )
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    throw new Error('Error al actualizar producto en la base de datos')
  }
}

export async function disableProducto(id: number): Promise<void> {
  const db = await getDb()
  try {
    await db.run('UPDATE productos SET activo = 0 WHERE id_producto = ?', [id])
  } catch (error) {
    console.error('Error al deshabilitar producto:', error)
    throw new Error('Error al deshabilitar producto en la base de datos')
  }
}

export async function deleteProducto(id: number): Promise<void> {
  const db = await getDb()
  try {
    await db.run('DELETE FROM productos WHERE id_producto = ?', [id])
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    throw new Error('Error al eliminar producto de la base de datos')
  }
}
