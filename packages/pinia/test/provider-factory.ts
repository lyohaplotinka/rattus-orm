import { TestStore } from '@func-test/utils/test-store'
import { TestingStoreFactory } from '@func-test/utils/types'
import { createPinia } from 'pinia'
import { PiniaDataProvider } from '../src'

export const dataProviderFactory: TestingStoreFactory = () => {
  const piniaInstance = createPinia()
  return new TestStore(new PiniaDataProvider(piniaInstance))
}
