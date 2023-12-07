import type { RattusContext } from '@rattus-orm/core/rattus-context'
import type { Pinia, Store } from 'pinia'

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
