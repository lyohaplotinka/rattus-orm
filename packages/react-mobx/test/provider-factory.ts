import { TestingStoreFactory } from '@func-test/utils/types'
import { TestStore } from '@func-test/utils/test-store'
import { ReactMobxDataProvider } from '../src'

export const dataProviderFactory: TestingStoreFactory = () => {
  return new TestStore(new ReactMobxDataProvider())
}
