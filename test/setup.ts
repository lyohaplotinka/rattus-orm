import { vi } from 'vitest'

import { Model } from '@/index'

vi.mock('uuid', () => ({
  v1: vi.fn(),
}))

beforeEach(() => {
  Model.clearBootedModels()
})
