import { TestingStoreFactory } from '@func-test/utils/types'
import { VuexDataProvider } from '../src'
import { createStore } from 'vuex'
import { TestStore } from '@func-test/utils/test-store'
import { SerializedStorage } from '@rattus-orm/core'

export const dataProviderFactory: TestingStoreFactory = () => {
  const store = createStore<SerializedStorage>({})
  return new TestStore(new VuexDataProvider(store))
}
