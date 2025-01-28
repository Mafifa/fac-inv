import https from 'https'

function convertToVenezuelaTime(dateString: string): string {
  const date = new Date(dateString)
  const venezuelaTime = new Date(date.getTime() - 4 * 60 * 60 * 1000) // UTC-4
  return venezuelaTime.toLocaleString('es-VE', { timeZone: 'America/Caracas' })
}

export async function fetchTasas(): Promise<DolarRate[]> {
  return new Promise((resolve, reject) => {
    const url = 'https://ve.dolarapi.com/v1/dolares'
    const options = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
      },
      timeout: 10000
    }

    const req = https.get(url, options, (res) => {
      let data = ''

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP Status Code: ${res.statusCode}`))
        return
      }

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const jsonData: DolarRate[] = JSON.parse(data)
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            const updatedData = jsonData.map((rate) => ({
              ...rate,
              fechaActualizacion: convertToVenezuelaTime(rate.fechaActualizacion)
            }))
            resolve(updatedData)
          } else {
            reject(new Error('La respuesta no contiene datos válidos'))
          }
        } catch (error) {
          reject(error)
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.on('timeout', () => {
      req.abort()
      reject(new Error('Timeout'))
    })
  })
}

export function setupDolarApiHandler(ipcMain: Electron.IpcMain) {
  ipcMain.handle('get-tasas', async () => {
    try {
      return await fetchTasas()
    } catch (error) {
      console.error('Error al obtener las tasas:', error)
      return { error: `No se pudo obtener las tasas: ${(error as Error).message}` }
    }
  })
}
