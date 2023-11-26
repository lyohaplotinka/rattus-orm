import { vi } from 'vitest'

import { Model } from '@/index'
import testedProviders from '../scripts/packagesMeta.json'
import { loadProvider } from 'test/utils/load-provider'
import { TestingStoreFactory } from 'test/utils/types'

declare global {
  var testingStoreFactory: TestingStoreFactory

  interface ImportMeta {
    env: {
      PACKAGE_NAME: string
    }
  }
}

const packageName = import.meta.env.PACKAGE_NAME
if (!(packageName in testedProviders)) {
  throw new Error(`Unknown package "${packageName}"`)
}
const provider = testedProviders[packageName]
globalThis.testingStoreFactory = await loadProvider(provider.path, provider.exportName)

window.crypto.randomUUID = vi.fn()

beforeEach(() => {
  Model.clearBootedModels()
})
