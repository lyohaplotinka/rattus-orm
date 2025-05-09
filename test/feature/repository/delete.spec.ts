import { assertState, createStore, fillState } from '@func-test/utils/Helpers'

import { AttrField, StringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/repository/delete', () => {
  class User extends Model {
    static entity = 'users'

    @AttrField() id!: any
    @StringField('') name!: string
  }

  it('deletes a record specified by the where clause', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    store.$repo(User).where('name', 'Jane Doe').delete()

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })
  })

  it('can delete multiple records specified by the where clause', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    store.$repo(User).where('name', 'Jane Doe').orWhere('name', 'Johnny Doe').delete()

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })

  it('returns an empty array if there are no matching records', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const users = store.$repo(User).where('name', 'No match').delete()

    expect(users).toEqual([])

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })
  })
})
