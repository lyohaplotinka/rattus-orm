import { assertModel, createStore, fillState } from '@func-test/utils/Helpers'

import { AttrField, BelongsTo, HasOne, StringField } from '@/decorators'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('feature/relations/eager_loads_recursive', () => {
  class User extends ModelTestEdition {
    static entity = 'users'

    @AttrField() id!: number
    @StringField('') name!: string

    @HasOne(() => Phone, 'userId')
    phone!: Phone
  }

  class Phone extends ModelTestEdition {
    static entity = 'phones'

    @AttrField() id!: number
    @AttrField() userId!: number
    @StringField('') number!: string

    @BelongsTo(() => User, 'userId')
    user!: User
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
      phone: null,
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
      phone: null,
    })
  })
})
