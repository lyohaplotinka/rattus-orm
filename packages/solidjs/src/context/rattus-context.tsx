import type { RattusOrmInstallerOptions } from '@rattus-orm/core'
import type { RattusContext as RattusContextCore } from '@rattus-orm/core/utils/rattus-context'
import { createRattusContext } from '@rattus-orm/core/utils/rattus-context'
import type { ParentProps } from 'solid-js'
import { createContext } from 'solid-js'

import { SolidjsDataProvider } from '../data-provider/solidjs-data-provider'

export const RattusContext = createContext<Partial<RattusContextCore>>({ $database: undefined, $databases: undefined })

export function RattusProvider(props: ParentProps<RattusOrmInstallerOptions>) {
  const rattusContext = createRattusContext(props, new SolidjsDataProvider())

  return <RattusContext.Provider value={rattusContext}>{props.children}</RattusContext.Provider>
}
