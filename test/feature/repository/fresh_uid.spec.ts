import { assertState, createStore, mockUid } from '@func-test/utils/Helpers'

import { StringField, UidField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/uid/fresh_uid', () => {
  class User extends Model {
    static entity = 'users'

    @UidField() id!: string | null
    @StringField('') name!: string
  }

  it('generates unique ids if the model field contains a `uid` attribute', () => {
    mockUid(['uid1', 'uid2'])

    const store = createStore()

    store.$repo(User).fresh([{ name: 'John Doe' }, { name: 'Jane Doe' }])

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
        uid2: { id: 'uid2', name: 'Jane Doe' },
      },
    })
  })
})
