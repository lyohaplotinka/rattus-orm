import { Database } from '@rattus-orm/core'
import type { PiniaPlugin } from 'pinia'

import { PiniaDataProvider } from '../data-provider/pinia-data-provider'

export const rattusOrmPiniaPlugin = (connectionName = 'entities'): PiniaPlugin => {
  return (context) => {
    const { pinia } = context

    const database = new Database().setDataProvider(new PiniaDataProvider(pinia)).setConnection(connectionName)

    const plugin = {
      $database: database,
      $repo: database.getRepository.bind(database),
    }

    return () => plugin
  }
}
