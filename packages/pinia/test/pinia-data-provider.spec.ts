import { createBasicProviderTest } from '@rattus-orm/core/utils/createBasicProviderTest'
import { createPinia } from 'pinia'
import { describe } from 'vitest'
import { PiniaDataProvider } from '../src'

describe('pinia-data-provider', () => {
  createBasicProviderTest({
    name: 'pinia',
    connectionRequired: false,
    storeFactory() {
      const store = createPinia()
      const provider = new PiniaDataProvider(store)

      return {
        provider,
        store,
      }
    },
  })
})
