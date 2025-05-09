import { assertInstanceOf, assertModels, createStore, fillState } from '@func-test/utils/Helpers'

import { AttrField, NumberField, StringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/repository/retrieves_where', () => {
  class User extends Model {
    static entity = 'users'

    @AttrField() id!: any
    @StringField('') name!: string
    @NumberField(0) age!: number
  }

  it('can filter query by `or where` clause', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })

    const users = store.$repo(User).where('name', 'John Doe').orWhere('age', 30).get()

    const expected = [
      { id: 1, name: 'John Doe', age: 40 },
      { id: 2, name: 'Jane Doe', age: 30 },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('the "or where" clause can be used alone', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })

    const users = store.$repo(User).orWhere('age', 30).get()

    const expected = [{ id: 2, name: 'Jane Doe', age: 30 }]

    expect(users).toHaveLength(1)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })
})
