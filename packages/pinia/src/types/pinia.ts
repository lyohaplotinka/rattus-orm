import '@vue/runtime-core'

import type { Database } from '@rattus-orm/core'
import type { Model, Repository } from '@rattus-orm/core'
import type { Pinia, Store } from 'pinia'

export type RattusContext = {
  $database: Database
  $databases: Record<string, Database>
  $repo<M extends typeof Model>(model: M, connection?: string): Repository<InstanceType<M>>
}

interface ComponentCustomPropertiesBase {
  $rattusContext: RattusContext

  $pinia: Pinia
  _pStores?: Record<string, Store>
}

declare module 'vue' {
  interface ComponentCustomProperties extends ComponentCustomPropertiesBase {}
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends ComponentCustomPropertiesBase {}
}
