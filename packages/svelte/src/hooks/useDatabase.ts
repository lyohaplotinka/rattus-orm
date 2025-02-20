import { Database } from '@rattus-orm/core'
import { RattusOrmError } from '@rattus-orm/core/utils/feedback'
import { getContext } from 'svelte'

import { rattusContextKey } from './const'

export function useDatabase(): Database {
  const context = getContext(rattusContextKey)
  if (!(context instanceof Database) || !context.isStarted()) {
    throw new RattusOrmError('Database is not valid', 'UseDatabaseHook')
  }

  return context
}
