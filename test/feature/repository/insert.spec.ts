import { assertState, createStore } from '@func-test/utils/Helpers'

import { AttrField, StringField } from '@/decorators'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('feature/repository/insert', () => {
  class User extends ModelTestEdition {
    static entity = 'users'

    @AttrField() id!: any
    @StringField('') name!: string
  }

  it('inserts a record to the store', () => {
    const store = createStore()

    store.$repo(User).insert({ id: 1, name: 'John Doe' })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })

  it('inserts records to the store', () => {
    const store = createStore()

    store.$repo(User).insert([
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

  it('does nothing if the given data is an empty array', () => {
    const store = createStore()

    store.$repo(User).insert([])
    assertState(store, { users: {} })
  })
})
