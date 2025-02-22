import type { RattusOrmInstallerOptions } from '@rattus-orm/core/utils/integrationsHelpers'
import { contextBootstrap } from '@rattus-orm/core/utils/integrationsHelpers'
import { RattusReactContext } from '@rattus-orm/core/utils/reactIntegrationHelpers'
import React, { type PropsWithChildren, useMemo } from 'react'

import { ReactMobxDataProvider } from '../data-provider/react-mobx-data-provider'

export function RattusProvider(props: PropsWithChildren<RattusOrmInstallerOptions>) {
  const createdDatabase = useMemo(
    () => contextBootstrap(props, new ReactMobxDataProvider()),
    [props.database, props.plugins, props.customRepositories, props.connection],
  )

  return (
    <RattusReactContext.Provider value={createdDatabase}>
      {props.children}
    </RattusReactContext.Provider>
  )
}

export { reactUseDatabase as useDatabase } from '@rattus-orm/core/utils/reactIntegrationHelpers'
