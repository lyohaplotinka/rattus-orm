import { TestingStoreFactory } from '../../../test/utils/types'
import { VuexDataProvider } from '../src'
import { createStore } from 'vuex'
import { RootState } from '@rattus-orm/core'
import { TestStore } from '../../../test/utils/test-store'

export const dataProviderFactory: TestingStoreFactory = () => {
  const store = createStore<RootState>({})
  return new TestStore(new VuexDataProvider(store))
}
