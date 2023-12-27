import { TestingStoreFactory } from '../../../test/utils/types'
import { TestStore } from '../../../test/utils/test-store'
import { ReactReduxDataProvider } from '../src/data-provider/react-redux-data-provider'
import { createStore } from 'redux'

export const dataProviderFactory: TestingStoreFactory = () => {
  const store = createStore((state: Record<string, unknown> = {}) => state)
  return new TestStore(new ReactReduxDataProvider(store))
}
