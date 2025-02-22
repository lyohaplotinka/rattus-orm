import { createBasicProviderTest } from '@rattus-orm/core/utils/createBasicProviderTest'
import { describe } from 'vitest'
import { ReactSignalsDataProvider } from '../src'

describe('react-signals-data-provider', () => {
  createBasicProviderTest({
    name: 'react-signals',
    connectionRequired: false,
    storeFactory() {
      const provider = new ReactSignalsDataProvider()

      return {
        provider,
        store: null,
      }
    },
  })
})
