import { assertState, createStore } from '@func-test/utils/Helpers'

import { HasOne } from '@/attributes/field-relations'
import { AttrField, StringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations/has_one_save', () => {
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

  it('inserts a record to the store with "has one" relation', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        userId: 1,
        number: '123-4567-8912',
      },
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' },
      },
    })
  })

  it('generates missing foreign key', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        number: '123-4567-8912',
      },
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' },
      },
    })
  })

  it('can insert a record with missing relational key', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      phones: {},
    })
  })

  it('can insert a record with relational key set to `null`', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      phone: null,
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      phones: {},
    })
  })
})
