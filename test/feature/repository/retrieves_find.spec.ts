import { assertInstanceOf, assertModel, assertModels, createStore, fillState } from '@func-test/utils/Helpers'

import { AttrField, StringField } from '@/decorators'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('feature/repository/retrieves_find', () => {
  class User extends ModelTestEdition {
    static entity = 'users'

    @AttrField() id!: any
    @StringField('') name!: string
  }

  it('can find a record by id', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const user = store.$repo(User).find(2)!

    expect(user).toBeInstanceOf(User)
    assertModel(user, { id: 2, name: 'Jane Doe' })
  })

  it('returns `null` if the record is not found', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const user = store.$repo(User).find(4)

    expect(user).toBe(null)
  })

  it('can find records by ids', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const users = store.$repo(User).find([1, 3])

    expect(users.length).toBe(2)
    assertInstanceOf(users, User)
    assertModels(users, [
      { id: 1, name: 'John Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])
  })
})
