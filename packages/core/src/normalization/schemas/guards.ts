import { isUnknownRecord } from '@rattus-orm/utils/isUnknownRecord'

import type { NormalizationSchema } from './types'

export const isNormalizationSchema = (value: unknown): value is NormalizationSchema<unknown> => {
  return isUnknownRecord(value) && typeof value.define === 'function' && typeof value.normalize === 'function'
}
