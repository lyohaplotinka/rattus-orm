import { vi } from 'vitest'

import { DataProvider, Model } from '@/index'
import testedProviders from './tested-providers.json'
import { loadProvider } from 'test/utils/load-provider'
import { Constructor } from '@/types'

declare global {
  var TestingDataProviderConstructor: Constructor<DataProvider>

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
globalThis.TestingDataProviderConstructor = await loadProvider(provider.path, provider.exportName)

window.crypto.randomUUID = vi.fn()

beforeEach(() => {
  Model.clearBootedModels()
})
