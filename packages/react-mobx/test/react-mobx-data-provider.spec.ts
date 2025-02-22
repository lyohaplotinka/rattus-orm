import { createBasicProviderTest } from '@rattus-orm/core/utils/createBasicProviderTest'
import { describe } from 'vitest'
import { ReactMobxDataProvider } from '../src'

describe('react-mobx-data-provider', () => {
  createBasicProviderTest({
    name: 'react-mobx',
    connectionRequired: false,
    storeFactory() {
      const provider = new ReactMobxDataProvider()

      return {
        provider,
        store: {},
      }
    },
  })
})
