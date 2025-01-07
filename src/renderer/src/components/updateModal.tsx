import React from 'react'
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
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  updateInfo,
}) => {
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
      </div>
    </div>
  )
}

export default UpdateModal

