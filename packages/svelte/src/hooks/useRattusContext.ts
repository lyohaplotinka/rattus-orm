import { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import { getContext } from 'svelte'

import { rattusContextKey } from './const'

export function useRattusContext(): RattusContext {
  const context = getContext(rattusContextKey)
  if (!(context instanceof RattusContext)) {
    throw new Error('[useRattusContext] context is not initialized. Did you use <RattusProvider>?')
  }

  return context
}
