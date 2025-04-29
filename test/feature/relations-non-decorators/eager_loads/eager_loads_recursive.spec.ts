import { assertModel, createStore, fillState } from '@func-test/utils/Helpers'

import { createBelongsToRelation, createHasOneRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/eager_loads_recursive', () => {
  class User extends Model {
    static entity = 'users'

    public static fields() {
      return {
        id: createAttrField(),
        name: createStringField(''),
        phone: createHasOneRelation(this, Phone, 'userId'),
      }
    }

    declare id: number
    declare name: string
    declare phone: Phone
  }

  class Phone extends Model {
    static entity = 'phones'

    public static fields() {
      return {
        id: createAttrField(),
        userId: createAttrField(),
        number: createStringField(''),
        user: createBelongsToRelation(this, User, 'userId'),
      }
    }

    declare id: number
    declare userId: number
    declare number: string
    declare user: User
  }

  it('eager loads all relations recursively', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' },
      },
    })

    const user = store.$repo(User).withAllRecursive().first()!

    expect(user.phone.user).toBeInstanceOf(User)
    expect(user.phone.user.phone).toBeInstanceOf(Phone)
    expect(user.phone.user.phone.user).toBeInstanceOf(User)
    assertModel(user.phone.user.phone.user, {
      id: 1,
      name: 'John Doe',
    })
  })

  it('eager loads all relations with a given recursion limit', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' },
      },
    })

    const user = store.$repo(User).withAllRecursive(1).first()!

    expect(user.phone.user).toBeInstanceOf(User)
    assertModel(user.phone.user, {
      id: 1,
      name: 'John Doe',
    })
  })
})
