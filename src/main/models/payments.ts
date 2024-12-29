import { getDb } from './db'

export async function getVentas(): Promise<Venta[]> {
  const db = await getDb()
  return await db.all(`
    SELECT v.id_venta, SUM(dv.subtotal) as total
    FROM ventas v
    JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
    LEFT JOIN pagos p ON v.id_venta = p.id_venta
    WHERE p.id_pago IS NULL
    GROUP BY v.id_venta
  `)
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
