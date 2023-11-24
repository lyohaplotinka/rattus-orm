import { Database } from '@rattus-orm/core'
import type { PiniaPluginContext } from 'pinia'

import { PiniaDataProvider } from '../data-provider/pinia-data-provider'

export function rattusOrmPiniaPlugin(context: PiniaPluginContext) {
  const { pinia } = context

  const database = new Database().setDataProvider(new PiniaDataProvider(pinia)).setConnection('entities')

  const plugin = {
    $database: database,
    $repo: database.getRepository.bind(database),
  }

  return () => plugin
}
