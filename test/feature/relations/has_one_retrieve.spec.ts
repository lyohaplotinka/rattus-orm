import { assertModel, createStore, fillState } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { HasOne } from '@/attributes/field-relations'
import { AttrField, StringField } from '@/attributes/field-types'

describe('feature/relations/has_one_retrieve', () => {
  class User extends Model {
    static entity = 'users'

    @AttrField() id!: number
    @StringField('') name!: string

    @HasOne(() => Phone, 'userId')
    phone!: Phone | null
  }

  class Phone extends Model {
    static entity = 'phones'

    @AttrField() id!: number
    @AttrField() userId!: number
    @StringField('') number!: string
  }

  it('can eager load has one relation', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' },
      },
    })

    const user = store.$repo(User).with('phone').first()!

    expect(user).toBeInstanceOf(User)
    expect(user.phone).toBeInstanceOf(Phone)
    assertModel(user, {
      id: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        userId: 1,
        number: '123-4567-8912',
      },
    })
  })

  it('can eager load missing relation as `null`', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      phones: {},
    })

    const user = store.$repo(User).with('phone').first()!

    expect(user).toBeInstanceOf(User)
    assertModel(user, {
      id: 1,
      name: 'John Doe',
      phone: null,
    })
  })
})
