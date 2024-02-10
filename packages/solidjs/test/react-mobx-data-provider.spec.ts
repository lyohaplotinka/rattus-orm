import { describe } from 'vitest'
import { createBasicProviderTest } from '@rattus-orm/core/utils/createBasicProviderTest'
import { SolidjsDataProvider } from '../src/data-provider/solidjs-data-provider'

describe('solidjs-data-provider', () => {
  createBasicProviderTest({
    name: 'solidjs',
    connectionRequired: false,
    storeFactory() {
      const provider = new SolidjsDataProvider()

      return {
        provider,
        store: {},
      }
    },
  })
})
