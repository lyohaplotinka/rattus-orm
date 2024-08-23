import { vi } from 'vitest'
import { ModelTestEdition } from '../shared-utils/testUtils'

// @ts-ignore
window.crypto.randomUUID = vi.fn()

beforeEach(() => {
  ModelTestEdition.clearBootedModels()
})
