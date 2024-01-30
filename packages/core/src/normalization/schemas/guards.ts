import { isUnknownRecord } from '@core-shared-utils/isUnknownRecord'

import { isFunction } from '@/support/utils'

import type { NormalizationSchema } from './types'

export const isNormalizationSchema = (value: unknown): value is NormalizationSchema<unknown> => {
  return isUnknownRecord(value) && typeof isFunction(value.define) && isFunction(value.normalize)
}
