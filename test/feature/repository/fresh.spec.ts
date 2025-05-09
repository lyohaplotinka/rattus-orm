import { assertState, createStore, fillState } from '@func-test/utils/Helpers'

import { AttrField, StringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/repository/fresh', () => {
  class User extends Model {
    static entity = 'users'

    @AttrField() id!: any
    @StringField('') name!: string
  }

  it('inserts a new record to the store', () => {
    const store = createStore()

    store.$repo(User).fresh({ id: 1, name: 'John Doe' })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })

  it('inserts multiple records to the store', () => {
    const store = createStore()

    store.$repo(User).fresh([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ])

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
      },
    })
  })

  it('replaces existing records', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
      },
    })

    store.$repo(User).fresh([
      { id: 3, name: 'Johnny Doe' },
      { id: 4, name: 'David Doe' },
    ])

    assertState(store, {
      users: {
        3: { id: 3, name: 'Johnny Doe' },
        4: { id: 4, name: 'David Doe' },
      },
    })
  })
})
