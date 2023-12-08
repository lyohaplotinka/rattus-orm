import { TestingStoreFactory } from '../../../test/utils/types'
import { TestStore } from '../../../test/utils/test-store'
import { ReactSignalsDataProvider } from '../src'

export const dataProviderFactory: TestingStoreFactory = () => {
  return new TestStore(new ReactSignalsDataProvider())
}
