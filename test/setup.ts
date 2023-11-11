import { vi } from 'vitest'

import { Model } from '@/index'

window.crypto.randomUUID = vi.fn()

beforeEach(() => {
  Model.clearBootedModels()
})
