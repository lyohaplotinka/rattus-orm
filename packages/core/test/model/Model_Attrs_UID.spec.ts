import { mockUid } from '../../../../test/utils/Helpers'

import { UidField } from '../../src/model/decorators/attributes/types/UidField'
import { ModelTestEdition } from '../../shared-utils/testUtils'

describe('unit/model/Model_Attrs_UID', () => {
  it('returns `null` when the model is instantiated', () => {
    class User extends ModelTestEdition {
      static entity = 'users'

      @UidField()
      id!: string
    }

    mockUid(['uid1'])

    expect(new User().id).toBe('uid1')
  })
})
