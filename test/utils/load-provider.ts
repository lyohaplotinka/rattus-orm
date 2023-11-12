import { TestingStoreFactory } from 'test/utils/types'

export const loadProvider = async (path: string, exportName: string): Promise<TestingStoreFactory> => {
  const result = await import(path)
  if (!(exportName in result)) {
    throw new ReferenceError(`"${exportName}" not found in module`)
  }
  return result[exportName]
}
