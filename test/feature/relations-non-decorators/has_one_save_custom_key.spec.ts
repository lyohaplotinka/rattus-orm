import { assertState, createStore } from '@func-test/utils/Helpers'

import { createHasOneRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/has_one_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has one" relation with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      public static fields() {
        return {
          userId: createAttrField(this),
          name: createStringField(this, ''),
          phone: createHasOneRelation(this, Phone, 'userId'),
        }
      }

      declare userId: string
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
      declare userId: string
      declare number: string
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
    class User extends Model {
      static entity = 'users'

      public static fields() {
        return {
          id: createAttrField(this),
          userId: createAttrField(this),
          name: createStringField(this, ''),
          phone: createHasOneRelation(this, Phone, 'userId', 'userId'),
        }
      }

      declare id: number
      declare userId: string
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
      declare userId: string
      declare number: string
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
