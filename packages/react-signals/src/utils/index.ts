import { RattusContext } from '@rattus-orm/core/utils/rattus-context'

export const isInitializedContext = (value: unknown): value is RattusContext => {
  return value instanceof RattusContext
}
