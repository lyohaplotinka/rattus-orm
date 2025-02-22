import { TestStore } from '../../../test/utils/test-store'
import { TestingStoreFactory } from '../../../test/utils/types'
import { ReactSignalsDataProvider } from '../src'

export const dataProviderFactory: TestingStoreFactory = () => {
  return new TestStore(new ReactSignalsDataProvider())
}
