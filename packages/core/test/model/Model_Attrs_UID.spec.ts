import { mockUid } from '../../../../test/utils/Helpers'

import { Model } from '@/model/Model'
import { UidField } from '../../src/attributes/types/decorators/UidField'

describe('unit/model/Model_Attrs_UID', () => {
  it('returns `null` when the model is instantiated', () => {
    class User extends Model {
      static entity = 'users'

      @UidField()
      id!: string
    }

    mockUid(['uid1'])

    expect(new User().id).toBe('uid1')
  })
})
