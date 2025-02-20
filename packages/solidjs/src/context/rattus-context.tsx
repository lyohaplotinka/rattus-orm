import { Database } from '@rattus-orm/core'
import { RattusOrmError } from '@rattus-orm/core/utils/feedback'
import type { RattusOrmInstallerOptions } from '@rattus-orm/core/utils/integrationsHelpers'
import { contextBootstrap } from '@rattus-orm/core/utils/integrationsHelpers'
import type { ParentProps } from 'solid-js'
import { useContext } from 'solid-js'
import { createContext, createMemo } from 'solid-js'

import { SolidjsDataProvider } from '../data-provider/solidjs-data-provider'

export const RattusContext = createContext<Database>({} as Database)

export function RattusProvider(props: ParentProps<RattusOrmInstallerOptions>) {
  const createdDatabase = createMemo(() => contextBootstrap(props, new SolidjsDataProvider()))

  return <RattusContext.Provider value={createdDatabase()}>{props.children}</RattusContext.Provider>
}

export function useDatabase() {
  const context = useContext(RattusContext)
  if (!(context instanceof Database) || !context.isStarted()) {
    throw new RattusOrmError('Database is not valid', 'UseDatabaseHook')
  }

  return context
}
