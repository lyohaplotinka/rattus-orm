import type { RattusOrmInstallerOptions } from '@rattus-orm/core'
import type { RattusContext as RattusContextCore } from '@rattus-orm/core/utils/rattus-context'
import { createRattusContext } from '@rattus-orm/core/utils/rattus-context'
import type { PropsWithChildren } from 'react'
import { createContext, useRef } from 'react'
import React from 'react'

import { ReactSignalsDataProvider } from '../index'

export const RattusContext = createContext<Partial<RattusContextCore>>({})

export function RattusProvider(props: PropsWithChildren<RattusOrmInstallerOptions>) {
  const rattusContext = useRef(createRattusContext(props, new ReactSignalsDataProvider()))

  return <RattusContext.Provider value={rattusContext.current}>{props.children}</RattusContext.Provider>
}
