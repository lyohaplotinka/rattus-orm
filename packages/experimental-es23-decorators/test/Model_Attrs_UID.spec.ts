import { mockUid } from '../../../test/utils/Helpers'
import { Model } from '@rattus-orm/core'
import { Uid } from '../src'
import { vi } from 'vitest'
;(globalThis as any).crypto.randomUUID = vi.fn()

describe('unit/model/Model_Attrs_UID', () => {
  it('returns `null` when the model is instantiated', () => {
    class User extends Model {
      static entity = 'users'

      @Uid()
      id!: string
    }

    mockUid(['uid1'])

    expect(new User().id).toBe('uid1')
  })
})
