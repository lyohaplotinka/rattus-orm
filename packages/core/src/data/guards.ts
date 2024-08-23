import { isFunction } from '@/support/utils'

import { isUnknownRecord } from '../../shared-utils/isUnknownRecord'
import type { DataProvider } from './types'

export const DataProviderKeys: Array<keyof DataProvider> = [
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
  return isUnknownRecord(value) && DataProviderKeys.every((key) => isFunction(value[key]))
}
