import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'

export async function getDb() {
  const userDataPath = app.getPath('userData')
  const dbFolderPath = path.join(userDataPath, 'db')
  const dbFilePath = path.join(dbFolderPath, 'inventory.db')

  // Create the db folder if it doesn't exist
  if (!fs.existsSync(dbFolderPath)) {
    fs.mkdirSync(dbFolderPath, { recursive: true })
  }

  const db = await open({
    filename: dbFilePath,
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
      id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio_base REAL NOT NULL,
      stock INTEGER NOT NULL,
      activo BOOLEAN NOT NULL DEFAULT 1,
      descuento REAL DEFAULT 0
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
