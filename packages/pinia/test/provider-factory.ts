import { TestingStoreFactory } from '../../../test/utils/types'
import { createPinia } from 'pinia'
import { TestStore } from '../../../test/utils/test-store'
import { PiniaDataProvider } from '../src'

export const dataProviderFactory: TestingStoreFactory = () => {
  const piniaInstance = createPinia()
  return new TestStore(new PiniaDataProvider(piniaInstance))
}
