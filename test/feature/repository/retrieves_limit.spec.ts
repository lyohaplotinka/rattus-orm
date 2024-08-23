import { assertInstanceOf, assertModels, createStore, fillState } from '@func-test/utils/Helpers'

import { AttrField, StringField } from '@/decorators'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('feature/repository/retrieve_limit', () => {
  class User extends ModelTestEdition {
    static entity = 'users'

    @AttrField() id!: any
    @StringField('') name!: string
  }

  it('can limit the records', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const users = store.$repo(User).limit(2).get()

    const expected = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })
})
