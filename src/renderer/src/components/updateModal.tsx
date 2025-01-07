import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface UpdateInfo {
  version: string
  releaseDate: string
  files: { size: number }[]
}

interface UpdateModalProps {
  isOpen: boolean
  onClose: () => void
  updateInfo: UpdateInfo | null
  downloadProgress: number
  downloadSpeed: number
  isDownloading: boolean
  isUpdateDownloaded: boolean
  onStartDownload: () => void
  onInstallUpdate: () => void
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  updateInfo,
  downloadProgress,
  downloadSpeed,
  isDownloading,
  isUpdateDownloaded,
  onStartDownload,
  onInstallUpdate
}) => {
  const [animateProgress, setAnimateProgress] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isDownloading) {
      timer = setTimeout(() => setAnimateProgress(downloadProgress), 100);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [downloadProgress, isDownloading]);

  if (!isOpen) return null

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold dark:text-white">Actualización Disponible</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        {updateInfo && (
          <div className="mb-4">
            <p className="dark:text-gray-300">Versión: {updateInfo.version}</p>
            <p className="dark:text-gray-300">Fecha de lanzamiento: {new Date(updateInfo.releaseDate).toLocaleDateString()}</p>
            <p className="dark:text-gray-300">Tamaño: {formatBytes(updateInfo.files[0]?.size || 0)}</p>
          </div>
        )}
        {isDownloading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${animateProgress}%` }}
              ></div>
            </div>
            <p className="text-sm dark:text-gray-300">
              Descargando: {downloadProgress.toFixed(2)}% - {formatBytes(downloadSpeed)}/s
            </p>
          </div>
        )}
        {!isDownloading && !isUpdateDownloaded && (
          <button
            onClick={onStartDownload}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Descargar Actualización
          </button>
        )}
        {isUpdateDownloaded && (
          <button
            onClick={onInstallUpdate}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
          >
            Instalar y Reiniciar
          </button>
        )}
      </div>
    </div>
  )
}

export default UpdateModal

