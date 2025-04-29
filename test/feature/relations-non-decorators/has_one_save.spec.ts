import { assertState, createStore } from '@func-test/utils/Helpers'

import { createHasOneRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/has_one_save', () => {
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
