import { assertState, createStore } from '@func-test/utils/Helpers'

import { AttrField, StringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/repository/insert_composite_key', () => {
  class User extends Model {
    static entity = 'users'

    static primaryKey = ['idA', 'idB']

    @AttrField() idA!: any
    @AttrField() idB!: any
    @StringField('') name!: string
  }

  it('inserts records with a composite key', () => {
    const store = createStore()

    store.$repo(User).insert([
      { idA: 1, idB: 2, name: 'John Doe' },
      { idA: 2, idB: 1, name: 'Jane Doe' },
    ])

    assertState(store, {
      users: {
        '[1,2]': { idA: 1, idB: 2, name: 'John Doe' },
        '[2,1]': { idA: 2, idB: 1, name: 'Jane Doe' },
      },
    })
  })

  it('throws if composite key is incomplete', () => {
    const store = createStore()

    expect(() => {
      store.$repo(User).insert({ idA: 1, name: 'John Doe' })
    }).toThrow()
  })
})
