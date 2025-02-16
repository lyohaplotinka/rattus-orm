import { type RattusOrmInstallerOptions, RattusReactContext } from '@rattus-orm/core/utils/integrationsHelpers'
import { contextBootstrap } from '@rattus-orm/core/utils/integrationsHelpers'
import React, { type PropsWithChildren, useMemo } from 'react'
import { Provider } from 'react-redux'
import type { Reducer, Store } from 'redux'

import { ReactReduxDataProvider } from '../data-provider/react-redux-data-provider'

type RattusProviderProps = RattusOrmInstallerOptions & {
  store: Store
  sideReducers?: Record<string, Reducer>
}

export function RattusProvider(props: PropsWithChildren<RattusProviderProps>) {
  const createdDatabase = useMemo(
    () => contextBootstrap(props, new ReactReduxDataProvider(props.store, props.sideReducers)),
    [props.connection, props.database, props.customRepositories, props.store, props.sideReducers],
  )

  return (
    <RattusReactContext.Provider value={createdDatabase}>
      <Provider store={props.store}>{props.children}</Provider>
    </RattusReactContext.Provider>
  )
}

export { reactUseDatabase as useDatabase } from '@rattus-orm/core/utils/integrationsHelpers'
