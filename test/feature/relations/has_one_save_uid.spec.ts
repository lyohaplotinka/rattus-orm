import { assertState, createStore, mockUid } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { HasOne } from '@/decorators'
import { AttrField, StringField, UidField } from '@/attributes/field-types'

describe('feature/relations/has_one_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has one" relation with parent having "uid" field as the primary key', () => {
    class User extends Model {
      static entity = 'users'

      @UidField() id!: string
      @StringField('') name!: string

      @HasOne(() => Phone, 'userId')
      phone!: Phone | null
    }

    class Phone extends Model {
      static entity = 'phones'

      @AttrField() id!: number
      @AttrField() userId!: string
      @StringField('') number!: string
    }

    mockUid(['uid1'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      phone: {
        id: 1,
        number: '123-4567-8912',
      },
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 'uid1', number: '123-4567-8912' },
      },
    })
  })

  it('inserts "has one" relation with child having "uid" as the foreign key', () => {
    class User extends Model {
      static entity = 'users'

      @UidField() id!: string
      @StringField('') name!: string

      @HasOne(() => Phone, 'userId')
      phone!: Phone | null
    }

    class Phone extends Model {
      static entity = 'phones'

      @UidField() id!: string
      @UidField() userId!: string
      @StringField('') number!: string
    }

    mockUid(['uid1', 'uid2'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      phone: {
        number: '123-4567-8912',
      },
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      phones: {
        uid2: { id: 'uid2', userId: 'uid1', number: '123-4567-8912' },
      },
    })
  })

  it('inserts "has one" relation with child having "uid" as foreign key being primary key', () => {
    class User extends Model {
      static entity = 'users'

      @UidField() id!: string
      @StringField('') name!: string

      @HasOne(() => Phone, 'userId')
      phone!: Phone | null
    }

    class Phone extends Model {
      static entity = 'phones'

      static primaryKey = 'userId'

      @UidField() userId!: string
      @StringField('') number!: string
    }

    mockUid(['uid1', 'uid2'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      phone: {
        number: '123-4567-8912',
      },
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      phones: {
        uid1: { userId: 'uid1', number: '123-4567-8912' },
      },
    })
  })
})
