import { vi } from 'vitest'

import { loadProvider } from '@func-test/utils/load-provider'
import { TestingStoreFactory } from '@func-test/utils/types'
import { loadPackagesMeta } from '@scripts/utils.mjs'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

declare global {
  var testingStoreFactory: TestingStoreFactory

  interface ImportMeta {
    env: {
      PACKAGE_NAME: string
    }
  }
}

const testedProviders = loadPackagesMeta()
const packageName = import.meta.env.PACKAGE_NAME
if (!(packageName in testedProviders)) {
  throw new Error(`Unknown package "${packageName}"`)
}
const meta = testedProviders[packageName]
const testProvider = meta.testProvider
if (typeof testProvider === 'boolean') {
  throw new Error('Test provider is not configured in meta')
}
globalThis.testingStoreFactory = await loadProvider(testProvider.path, testProvider.exportName)

window.crypto.randomUUID = vi.fn()

beforeEach(() => {
  ModelTestEdition.clearBootedModels()
})
