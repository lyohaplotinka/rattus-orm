import { assertModel, createStore, fillState } from '@func-test/utils/Helpers'

import { createHasOneRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/has_one_retrieve', () => {
  class User extends Model {
    static entity = 'users'

    public static fields() {
      return {
        id: createAttrField(this),
        name: createStringField(this, ''),
        phone: createHasOneRelation(this, Phone, 'userId'),
      }
    }

    declare id: number
    declare name: string
    declare phone: Phone | null
  }

  class Phone extends Model {
    static entity = 'phones'

    public static fields() {
      return {
        id: createAttrField(this),
        userId: createAttrField(this),
        number: createStringField(this, ''),
      }
    }

    declare id: number
    declare userId: number
    declare number: string
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
