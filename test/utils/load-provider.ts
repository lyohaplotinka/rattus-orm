import { Constructor } from '@/types'
import { DataProvider } from '@/data/types'

export const loadProvider = async (path: string, exportName: string): Promise<Constructor<DataProvider>> => {
  const result = await import(path)
  const ProviderConstructor = result[exportName]
  return ProviderConstructor as Constructor<DataProvider>
}
