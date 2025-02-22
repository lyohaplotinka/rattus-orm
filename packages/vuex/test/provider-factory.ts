import { TestStore } from '@func-test/utils/test-store'
import { TestingStoreFactory } from '@func-test/utils/types'
import { SerializedStorage } from '@rattus-orm/core'
import { createStore } from 'vuex'
import { VuexDataProvider } from '../src'

export const dataProviderFactory: TestingStoreFactory = () => {
  const store = createStore<SerializedStorage>({})
  return new TestStore(new VuexDataProvider(store))
}
