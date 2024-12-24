import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db: any = null

export async function getDb() {
  if (db) return db

  db = await open({
    filename: 'inventory.db',
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
      id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio_base REAL NOT NULL,
      stock INTEGER NOT NULL,
      activo BOOLEAN NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS ventas (
      id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha_venta DATETIME NOT NULL,
      tasa_dolar REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS detalle_ventas (
      id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
      id_venta INTEGER NOT NULL,
      id_producto INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (id_venta) REFERENCES ventas (id_venta),
      FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
    );

    CREATE TABLE IF NOT EXISTS pagos (
      id_pago INTEGER PRIMARY KEY AUTOINCREMENT,
      id_venta INTEGER NOT NULL,
      metodo_pago TEXT NOT NULL,
      monto REAL NOT NULL,
      moneda_cambio TEXT,
      FOREIGN KEY (id_venta) REFERENCES ventas (id_venta)
    );
  `)

  return db
}

