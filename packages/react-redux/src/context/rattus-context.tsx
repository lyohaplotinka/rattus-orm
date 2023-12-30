import type { Database } from '@rattus-orm/core'
import type { RattusContext as RattusContextCore } from '@rattus-orm/core/rattus-context'
import { createRattusContext } from '@rattus-orm/core/rattus-context'
import type { RattusOrmInstallerOptions } from '@rattus-orm/utils/sharedTypes'
import React, { createContext, type PropsWithChildren, useRef } from 'react'
import { Provider } from 'react-redux'
import type { Reducer, Store } from 'redux'

import { ReactReduxDataProvider } from '../data-provider/react-redux-data-provider'

type RattusProviderProps = RattusOrmInstallerOptions<Database> & {
  store: Store
  sideReducers?: Record<string, Reducer>
}

export const RattusContext = createContext<Partial<RattusContextCore>>({ $database: undefined, $databases: undefined })

export function RattusProvider(props: PropsWithChildren<RattusProviderProps>) {
  const rattusContext = useRef(createRattusContext(props, new ReactReduxDataProvider(props.store, props.sideReducers)))

  return (
    <RattusContext.Provider value={rattusContext.current}>
      <Provider store={props.store}>{props.children}</Provider>
    </RattusContext.Provider>
  )
}
