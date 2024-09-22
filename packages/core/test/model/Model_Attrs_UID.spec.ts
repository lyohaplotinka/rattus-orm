import { mockUid } from '../../../../test/utils/Helpers'

import { UidField } from '../../src/attributes/decorators/attributes/types/UidField'
import { Model } from '@/model/Model'

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
