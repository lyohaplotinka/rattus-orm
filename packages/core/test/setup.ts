import { vi } from 'vitest'
import { Model } from '../src'

window.crypto.randomUUID = vi.fn()

beforeEach(() => {
  Model.clearBootedModels()
})
