import { createStore } from 'redux'
import { TestStore } from '../../../test/utils/test-store'
import { TestingStoreFactory } from '../../../test/utils/types'
import { ReactReduxDataProvider } from '../src/data-provider/react-redux-data-provider'

export const dataProviderFactory: TestingStoreFactory = () => {
  const store = createStore((state: Record<string, unknown> = {}) => state)
  return new TestStore(new ReactReduxDataProvider(store))
}
