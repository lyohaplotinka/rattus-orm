import { createStore, fillState } from '@func-test/utils/Helpers'

import type { Query } from '@/index'
import { Model } from '@/index'
import { HasOne } from '@/attributes/field-relations'
import { StringField, AttrField } from '@/attributes/field-types'

describe('feature/relations/constraints/constraints', () => {
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

    @HasOne(() => Type, 'phoneId')
    type!: Type | null
  }

  class Type extends Model {
    static entity = 'types'

    @AttrField() id!: number
    @AttrField() phoneId!: number
    @StringField('') name!: string
  }

  it('can add constraints to the relationship query', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      phones: {
        1: { id: 1, userId: 1, number: '123' },
        2: { id: 2, userId: 2, number: '345' },
        3: { id: 3, userId: 3, number: '789' },
      },
    })

    const users = store
      .$repo(User)
      .with('phone', (query: Query) => {
        query.where('number', '345')
      })
      .get()

    expect(users[0].phone).toBe(null)
    expect(users[1].phone!.number).toBe('345')
    expect(users[2].phone).toBe(null)
  })

  it('can load nested relationships', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      phones: {
        1: { id: 1, userId: 1, number: '123' },
        2: { id: 2, userId: 2, number: '345' },
        3: { id: 3, userId: 3, number: '789' },
      },
      types: {
        1: { id: 1, phoneId: 1, name: 'iPhone' },
        2: { id: 2, phoneId: 2, name: 'Android' },
      },
    })

    const users = store
      .$repo(User)
      .with('phone', (query: Query) => {
        query.with('type')
      })
      .get()

    expect(users[0].phone!.type!.id).toBe(1)
    expect(users[1].phone!.type!.id).toBe(2)
    expect(users[2].phone!.type).toBe(null)
  })
})
