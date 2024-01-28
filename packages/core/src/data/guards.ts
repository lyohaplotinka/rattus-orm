import { isUnknownRecord } from '../../shared-utils/isUnknownRecord'
import type { DataProvider, UnionToArray } from '../../shared-utils/sharedTypes'

export const DataProviderKeys: UnionToArray<keyof DataProvider> = [
  'registerConnection',
  'dump',
  'restore',
  'registerModule',
  'getModuleState',
  'hasModule',
  'save',
  'insert',
  'replace',
  'update',
  'delete',
  'flush',
]

export const isDataProvider = (value: unknown): value is DataProvider => {
  return isUnknownRecord(value) && DataProviderKeys.every((key) => typeof value[key] === 'function')
}
