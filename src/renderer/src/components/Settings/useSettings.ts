import { useAppContext, AppContextType } from '../../context/appContext'

export const useConfig = (): Pick<AppContextType, 'config' | 'updateConfig' | 'getTasaCambio'> => {
  const { config, updateConfig, getTasaCambio } = useAppContext()
  return { config, updateConfig, getTasaCambio }
}
