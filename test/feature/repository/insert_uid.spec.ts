import { assertState, createStore, mockUid } from '@func-test/utils/Helpers'

import { StringField, UidField } from '@/decorators'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('feature/repository/insert_uid', () => {
  class User extends ModelTestEdition {
    static entity = 'users'

    @UidField() id!: string | null
    @StringField('') name!: string
  }

  it('generates a unique id for a `uid` attribute', () => {
    mockUid(['uid1', 'uid2'])

    const store = createStore()

    store.$repo(User).insert([{ name: 'John Doe' }, { name: 'Jane Doe' }])

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
        uid2: { id: 'uid2', name: 'Jane Doe' },
      },
    })
  })
})
