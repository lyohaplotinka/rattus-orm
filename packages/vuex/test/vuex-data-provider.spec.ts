import { describe } from 'vitest'
import { createStore, Store } from 'vuex'
import { VuexDataProvider } from '../src'
import { SerializedStorage } from '@rattus-orm/core'
import { createBasicProviderTest } from '@rattus-orm/core/utils/createBasicProviderTest'

describe('vuex-data-provider', () => {
  const storeFactory = () => {
    const store = createStore<SerializedStorage>({})
    const provider = new VuexDataProvider(store)
    return { store, provider }
  }

  createBasicProviderTest<Store<SerializedStorage>>({
    name: 'vuex',
    storeFactory,
    connectionRequired: true,
  })
})
