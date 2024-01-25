import type { Database } from '@rattus-orm/core'
import type { RattusContext as RattusContextCore } from '@rattus-orm/core/rattus-context'
import { createRattusContext } from '@rattus-orm/core/rattus-context'
import type { RattusOrmInstallerOptions } from '@rattus-orm/core/utils/sharedTypes'
import type { PropsWithChildren } from 'react'
import { createContext, useRef } from 'react'
import React from 'react'

import { ReactSignalsDataProvider } from '../index'

export const RattusContext = createContext<Partial<RattusContextCore>>({ $database: undefined, $databases: undefined })

export function RattusProvider(props: PropsWithChildren<RattusOrmInstallerOptions<Database>>) {
  const rattusContext = useRef(createRattusContext(props, new ReactSignalsDataProvider()))

  return <RattusContext.Provider value={rattusContext.current}>{props.children}</RattusContext.Provider>
}
