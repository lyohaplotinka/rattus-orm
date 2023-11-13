import { assertInstanceOf, assertModels, createStore, fillState } from 'test/utils/Helpers'

import { Attr, Model, Str } from '@/index'

describe('feature/repository/retrieves_all', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('retrieves all records from the store', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const users = store.$repo(User).all()

    const expected = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ]

    expect(users).toHaveLength(3)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })
})
