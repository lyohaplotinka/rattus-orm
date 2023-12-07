import { RattusContext as RattusContextCore } from '@rattus-orm/core/rattus-context'
import type { RattusOrmInstallerOptions } from '@rattus-orm/utils/sharedTypes'
import type { PropsWithChildren } from 'react'
import { createContext, useRef } from 'react'
import React from 'react'

import { ReactSignalsDataProvider } from '../data-provider/react-signals-data-provider'

function createRattusContext(connectionName: string): RattusContextCore {
  const dataProvider = new ReactSignalsDataProvider()
  const context = new RattusContextCore(dataProvider)
  context.createDatabase(connectionName, true)

  return context
}

export const RattusContext = createContext<Partial<RattusContextCore>>({ $database: undefined, $databases: undefined })

export function RattusProvider({ connection = 'entities', children }: PropsWithChildren<RattusOrmInstallerOptions>) {
  const rattusContext = useRef(createRattusContext(connection))

  return <RattusContext.Provider value={rattusContext.current}>{children}</RattusContext.Provider>
}
