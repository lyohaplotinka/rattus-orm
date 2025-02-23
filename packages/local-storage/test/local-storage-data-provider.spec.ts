import { createBasicProviderTest } from '@rattus-orm/core/utils/createBasicProviderTest'
import { beforeEach, describe } from 'vitest'
import { LocalStorageDataProvider } from '../src'

describe('local-storage-data-provider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  createBasicProviderTest({
    name: 'react-signals',
    connectionRequired: false,
    storeFactory() {
      const provider = new LocalStorageDataProvider()

      return {
        provider,
        store: null,
      }
    },
  })
})
