import { TestStore } from '@func-test/utils/test-store'
import { TestingStoreFactory } from '@func-test/utils/types'
import { createStore } from 'redux'
import { ReactReduxDataProvider } from '../src'

export const dataProviderFactory: TestingStoreFactory = () => {
  const store = createStore((state: Record<string, unknown> = {}) => state)
  return new TestStore(new ReactReduxDataProvider(store))
}
