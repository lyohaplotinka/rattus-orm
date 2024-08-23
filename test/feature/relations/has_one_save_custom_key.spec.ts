import { assertState, createStore } from '@func-test/utils/Helpers'

import { AttrField, HasOne, StringField } from '@/decorators'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('feature/relations/has_one_save_custom_key', () => {
  beforeEach(() => {
    ModelTestEdition.clearRegistries()
  })

  it('inserts "has one" relation with custom primary key', () => {
    class User extends ModelTestEdition {
      static entity = 'users'

      static primaryKey = 'userId'

      @AttrField() userId!: string
      @StringField('') name!: string

      @HasOne(() => Phone, 'userId')
      phone!: Phone | null
    }

    class Phone extends ModelTestEdition {
      static entity = 'phones'

      @AttrField() id!: number
      @AttrField() userId!: string
      @StringField('') number!: string
    }

    const store = createStore()

    store.$repo(User).save({
      userId: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        number: '123-4567-8912',
      },
    })

    assertState(store, {
      users: {
        1: { userId: 1, name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' },
      },
    })
  })

  it('inserts "has one" relation with custom local key', () => {
    class User extends ModelTestEdition {
      static entity = 'users'

      @AttrField() id!: number
      @AttrField() userId!: string
      @StringField('') name!: string

      @HasOne(() => Phone, 'userId', 'userId')
      phone!: Phone | null
    }

    class Phone extends ModelTestEdition {
      static entity = 'phones'

      @AttrField() id!: number
      @AttrField() userId!: string
      @StringField('') number!: string
    }

    const store = createStore()

    store.$repo(User).save({
      id: 1,
      userId: 2,
      name: 'John Doe',
      phone: {
        id: 1,
        number: '123-4567-8912',
      },
    })

    assertState(store, {
      users: {
        1: { id: 1, userId: 2, name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 2, number: '123-4567-8912' },
      },
    })
  })
})
