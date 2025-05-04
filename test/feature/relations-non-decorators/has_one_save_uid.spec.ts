import { assertState, createStore } from '@func-test/utils/Helpers'

import { createHasOneRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField, createUidField } from '@/attributes/field-types'
import { Model } from '@/index'
import { mockUid } from '@func-test/utils/mock-uid'

describe('feature/relations-non-decorators/has_one_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has one" relation with parent having "uid" field as the primary key', () => {
    class User extends Model {
      static entity = 'users'

      public static fields() {
        return {
          id: createUidField(),
          name: createStringField(''),
          phone: createHasOneRelation(() => Phone, 'userId'),
        }
      }

      declare id: string
      declare name: string
      declare phone: Phone | null
    }

    class Phone extends Model {
      static entity = 'phones'

      public static fields() {
        return {
          id: createAttrField(),
          userId: createAttrField(),
          number: createStringField(''),
        }
      }

      declare id: number
      declare userId: string
      declare number: string
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

      public static fields() {
        return {
          id: createUidField(),
          name: createStringField(''),
          phone: createHasOneRelation(() => Phone, 'userId'),
        }
      }

      declare id: string
      declare name: string
      declare phone: Phone | null
    }

    class Phone extends Model {
      static entity = 'phones'

      public static fields() {
        return {
          id: createUidField(),
          userId: createUidField(),
          number: createStringField(''),
        }
      }

      declare id: string
      declare userId: string
      declare number: string
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

      public static fields() {
        return {
          id: createUidField(),
          name: createStringField(''),
          phone: createHasOneRelation(() => Phone, 'userId'),
        }
      }

      declare id: string
      declare name: string
      declare phone: Phone | null
    }

    class Phone extends Model {
      static entity = 'phones'

      static primaryKey = 'userId'

      public static fields() {
        return {
          userId: createUidField(),
          number: createStringField(''),
        }
      }

      declare userId: string
      declare number: string
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
