import { isUnknownRecord } from '@core-shared-utils/isUnknownRecord'

import type { PackageJsonWithRattusMeta } from './types'

export const isPackageJsonWithRattusMeta = (value: unknown): value is PackageJsonWithRattusMeta => {
  return isUnknownRecord(value) && isUnknownRecord(value.rattusMeta) && typeof value.rattusMeta.title === 'string'
}
