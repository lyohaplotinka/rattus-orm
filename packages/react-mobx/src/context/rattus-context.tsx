import type { RattusOrmInstallerOptions } from '@rattus-orm/core'
import type { RattusContext as RattusContextCore } from '@rattus-orm/core/utils/rattus-context'
import { createRattusContext } from '@rattus-orm/core/utils/rattus-context'
import React, { createContext, type PropsWithChildren, useRef } from 'react'

import { ReactMobxDataProvider } from '../data-provider/react-mobx-data-provider'

export const RattusContext = createContext<Partial<RattusContextCore>>({ $database: undefined, $databases: undefined })

export function RattusProvider(props: PropsWithChildren<RattusOrmInstallerOptions>) {
  const rattusContext = useRef(createRattusContext(props, new ReactMobxDataProvider()))

  return <RattusContext.Provider value={rattusContext.current}>{props.children}</RattusContext.Provider>
}
