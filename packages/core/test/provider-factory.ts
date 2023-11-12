import { TestingStoreFactory } from '../../../test/utils/types'
import { ObjectDataProvider } from '../src/data/object-data-provider'
import { TestStore } from '../../../test/utils/test-store'

export const dataProviderFactory: TestingStoreFactory = () => {
  return new TestStore(new ObjectDataProvider())
}
