import { isUnknownRecord } from '@rattus-orm/utils/isUnknownRecord'

import type { RattusContextType } from '../context/rattus-context'

export const isInitializedContext = (value: unknown): value is RattusContextType => {
  return (
    isUnknownRecord(value) &&
    value.$database !== undefined &&
    isUnknownRecord(value.$databases) &&
    typeof value.$repo === 'function'
  )
}
