import type { RattusOrmInstallerOptions } from '@rattus-orm/core/utils/integrationsHelpers'
import { contextBootstrap } from '@rattus-orm/core/utils/integrationsHelpers'
import React, { createContext, type PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import type { Reducer, Store } from 'redux'

import { ReactReduxDataProvider } from '../data-provider/react-redux-data-provider'

type RattusProviderProps = RattusOrmInstallerOptions & {
  store: Store
  sideReducers?: Record<string, Reducer>
}

export const RattusContext = createContext<undefined>(undefined)

export function RattusProvider(props: PropsWithChildren<RattusProviderProps>) {
  contextBootstrap(props, new ReactReduxDataProvider(props.store, props.sideReducers))

  return (
    <RattusContext.Provider value={undefined}>
      <Provider store={props.store}>{props.children}</Provider>
    </RattusContext.Provider>
  )
}
