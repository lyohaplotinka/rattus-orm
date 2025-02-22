import { TestStore } from '../../../test/utils/test-store'
import { TestingStoreFactory } from '../../../test/utils/types'
import { ObjectDataProvider } from '../src/data/object-data-provider'

export const dataProviderFactory: TestingStoreFactory = () => {
  return new TestStore(new ObjectDataProvider())
}
