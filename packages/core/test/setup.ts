import { vi } from 'vitest'
import { Model } from '../src'

// @ts-ignore
window.crypto.randomUUID = vi.fn()

beforeEach(() => {
  Model.clearBootedModels()
})
