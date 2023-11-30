import { describe } from 'vitest'
import { PiniaDataProvider } from '../src'
import { createPinia } from 'pinia'
import { createBasicProviderTest } from '@rattus-orm/utils/createBasicProviderTest'

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
