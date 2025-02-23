import { Model } from '@/index'
import { vi } from 'vitest'

window.crypto.randomUUID = vi.fn()

beforeEach(() => {
  Model.clearBootedModels()
})
