import { TestStore } from '@func-test/utils/test-store'
import { TestingStoreFactory } from '@func-test/utils/types'
import { ReactMobxDataProvider } from '../src'

export const dataProviderFactory: TestingStoreFactory = () => {
  return new TestStore(new ReactMobxDataProvider())
}
