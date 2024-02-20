import { isInitializedContext } from '@rattus-orm/core/utils/integrationsHelpers'
import { useContext } from 'react'

import { RattusContext } from '../context/rattus-context'

export function useRattusContext() {
  const context = useContext(RattusContext)
  if (!isInitializedContext(context)) {
    throw new Error('[useRattusContext] context is not initialized. Did you use <RattusProvider>?')
  }

  return context
}
