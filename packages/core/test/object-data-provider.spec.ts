import { createBasicProviderTest } from '@core-shared-utils/createBasicProviderTest'
import { describe } from 'vitest'
import { ObjectDataProvider } from '../src/data/object-data-provider'

describe('object-data-provider', () => {
  const storeFactory = () => {
    const store = {}
    const provider = new ObjectDataProvider()
    return { store, provider }
  }

  createBasicProviderTest({
    name: 'object',
    storeFactory,
    connectionRequired: true,
  })
})
