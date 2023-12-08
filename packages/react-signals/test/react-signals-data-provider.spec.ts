import { describe } from 'vitest'
import { ReactSignalsDataProvider } from '../src'
import { createBasicProviderTest } from '@rattus-orm/utils/createBasicProviderTest'

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
