import { isInitializedContext } from '@rattus-orm/core/utils/integrationsHelpers'
import type { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import { getContext } from 'svelte'

import { rattusContextKey } from './const'

export function useRattusContext(): RattusContext {
  const context = getContext(rattusContextKey)
  if (!isInitializedContext(context)) {
    throw new Error('[useRattusContext] context is not initialized. Did you use <RattusProvider>?')
  }

  return context
}
