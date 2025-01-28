import { getDb } from './db'

function formatearFechaLocal(fechaISO: string | Date): string {
  // Asegurar que la entrada sea un objeto Date
  const fecha = typeof fechaISO === 'string' ? new Date(fechaISO) : fechaISO

  // Obtener los componentes de la fecha local
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  const horas = String(fecha.getHours()).padStart(2, '0')
  const minutos = String(fecha.getMinutes()).padStart(2, '0')
  const segundos = String(fecha.getSeconds()).padStart(2, '0')

  return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`
}

export async function updateTasaDolar(tasas: DolarRate[]) {
  const db = await getDb()
  const currentDate = new Date()

  tasas.forEach(async (tasa) => {
    try {
      await db.run(`INSERT INTO tasas_dolar (fuente, tasa, fecha_actualizacion) VALUES (?, ?, ?)`, [
        tasa.fuente,
        tasa.promedio,
        formatearFechaLocal(currentDate)
      ])
    } catch (error) {
      db.run(`ROLLBACK`)
      throw error
    }
  })
}

export async function getTasasDolar(): Promise<TasaDolar[]> {
  const db = await getDb()
  const tasas = await db.all(`
      WITH ranked_fechas AS (
    SELECT 
      fuente,
      fecha_actualizacion,
      ROW_NUMBER() OVER (
        PARTITION BY fuente
        ORDER BY fecha_actualizacion DESC
      ) AS rn
    FROM tasas_dolar
  ),
  ultimas_14_fechas AS (
    SELECT 
      fuente,
      fecha_actualizacion
    FROM ranked_fechas
    WHERE rn <= 14
  ),
  ultimos_registros AS (
    SELECT 
      t1.id,
      t1.fuente,
      t1.tasa,
      t1.fecha_actualizacion,
      ROW_NUMBER() OVER (
        PARTITION BY t1.fuente, t1.fecha_actualizacion
        ORDER BY t1.id DESC
      ) AS rn
    FROM tasas_dolar t1
    JOIN ultimas_14_fechas t2
      ON t1.fuente = t2.fuente
      AND t1.fecha_actualizacion = t2.fecha_actualizacion
  )
  SELECT 
    id,
    fuente,
    tasa,
    fecha_actualizacion
  FROM ultimos_registros
  WHERE rn = 1
  ORDER BY fuente, fecha_actualizacion DESC;
    `)
  return tasas
}
