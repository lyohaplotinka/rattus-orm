import { TestingStoreFactory } from '@func-test/utils/types'
import { TestStore } from '@func-test/utils/test-store'
import { LocalStorageDataProvider } from '../src'
import { afterEach } from 'vitest'

// due to localStorage limitations, we're not clearing storage after these tests
const DO_NOT_CLEAR_LS_TESTS: string[] = ['can eager load morph one relation for user']
afterEach((context) => {
  if (DO_NOT_CLEAR_LS_TESTS.includes(context.task.name)) {
    return
  }
  localStorage.clear()
})

export const dataProviderFactory: TestingStoreFactory = () => {
  return new TestStore(new LocalStorageDataProvider())
}
