import { assertState, createStore } from '@func-test/utils/Helpers'

import {
  AttrField,
  BooleanField,
  NumberField,
  StringField,
  UidField,
} from '@/attributes/field-types'
import { Model } from '@/index'
import { mockUid } from '@func-test/utils/mock-uid'

describe('feature/repository/new', () => {
  it('inserts with a models default values', () => {
    class User extends Model {
      static entity = 'users'

      @UidField() id!: string
      @StringField('John Doe') name!: string
      @NumberField(21) age!: number
      @BooleanField(true) active!: boolean
    }

    mockUid(['uid1'])

    const store = createStore()

    store.$repo(User).new()

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe', age: 21, active: true },
      },
    })
  })

  it('throws if a primary key is not capable of being generated', () => {
    class User extends Model {
      static entity = 'users'

      @AttrField() id!: any
      @StringField('John Doe') name!: string
    }

    const store = createStore()

    expect(() => store.$repo(User).new()).toThrow()
  })
})
