import { TestingStoreFactory } from '../../../test/utils/types'
import { VuexDataProvider } from '../src'
import { createStore } from 'vuex'
import { TestStore } from '../../../test/utils/test-store'
import { SerializedStorage } from '@rattus-orm/utils'

export const dataProviderFactory: TestingStoreFactory = () => {
  const store = createStore<SerializedStorage>({})
  return new TestStore(new VuexDataProvider(store))
}
