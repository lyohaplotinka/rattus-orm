import { createStore, fillState } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { AttrField, StringField } from '@/decorators'

describe('feature/repository/destroy_composite_key', () => {
  class User extends Model {
    static entity = 'users'

    static primaryKey = ['idA', 'idB']

    @AttrField() idA!: any
    @AttrField() idB!: any
    @StringField('') name!: string
  }

  it('throws if the model has composite key', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    expect(() => store.$repo(User).destroy(2)).toThrow()
  })
})
