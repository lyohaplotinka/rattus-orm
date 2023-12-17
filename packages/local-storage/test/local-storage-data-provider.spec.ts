import { beforeEach, describe } from 'vitest'
import { createBasicProviderTest } from '@rattus-orm/utils/createBasicProviderTest'
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
