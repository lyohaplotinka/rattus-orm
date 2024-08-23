import { assertInstanceOf, assertModels, createStore, fillState } from '@func-test/utils/Helpers'

import { AttrField, StringField } from '@/decorators'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('feature/repository/retrieve_offset', () => {
  class User extends ModelTestEdition {
    static entity = 'users'

    @AttrField() id!: any
    @StringField('') name!: string
  }

  it('can offset the records', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const users = store.$repo(User).offset(1).get()

    const expected = [
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })
})
