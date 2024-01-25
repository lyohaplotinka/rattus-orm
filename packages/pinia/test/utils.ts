import { ComputedRef, isRef } from 'vue'
import { isUnknownRecord } from '@rattus-orm/utils/isUnknownRecord'

export const isComputed = (value: unknown): value is ComputedRef<any> => {
  return isUnknownRecord(value) && isRef(value) && !!value.effect
}