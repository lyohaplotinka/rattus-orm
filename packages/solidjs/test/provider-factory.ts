import { TestingStoreFactory } from '@func-test/utils/types'
import { TestStore } from '@func-test/utils/test-store'
import { SolidjsDataProvider } from '../src'

export const dataProviderFactory: TestingStoreFactory = () => {
  return new TestStore(new SolidjsDataProvider())
}
