import { assertState, createStore } from '@func-test/utils/Helpers'

import { createBelongsToRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField, createUidField } from '@/attributes/field-types'
import { Model } from '@/index'
import { mockUid } from '@func-test/utils/mock-uid'

describe('feature/relations-non-decorators/belongs_to_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  

  it('inserts "belongs to" relation with parent having "uid" field as the primary key', () => {
    class User extends Model {
      static entity = 'users'

      public static fields() {
        return {
          id: createAttrField(),
          name: createStringField(''),
        }
      }

      declare id: number
      declare name: string
    }

    class Post extends Model {
      static entity = 'posts'

      public static fields() {
        return {
          id: createUidField(),
          userId: createAttrField(),
          title: createStringField(''),
          author: createBelongsToRelation(this, User, 'userId'),
        }
      }

      declare id: string
      declare userId: number | null
      declare title: string
      declare author: User | null
    }

    mockUid(['uid1'])

    const store = createStore()

    store.$repo(Post).save({
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' },
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        uid1: { id: 'uid1', userId: 1, title: 'Title 01' },
      },
    })
  })

  it('inserts "belongs to" relation with child having "uid" as the owner key', () => {
    class User extends Model {
      static entity = 'users'

      public static fields() {
        return {
          id: createUidField(),
          name: createStringField(''),
        }
      }

      declare id: string
      declare name: string
    }

    class Post extends Model {
      static entity = 'posts'

      public static fields() {
        return {
          id: createUidField(),
          userId: createAttrField(),
          title: createStringField(''),
          author: createBelongsToRelation(this, User, 'userId'),
        }
      }

      declare id: number
      declare userId: number | null
      declare title: string
      declare author: User | null
    }

    mockUid(['uid1', 'uid2'])

    const store = createStore()

    store.$repo(Post).save({
      title: 'Title 01',
      author: { name: 'John Doe' },
    })

    assertState(store, {
      users: {
        uid2: { id: 'uid2', name: 'John Doe' },
      },
      posts: {
        uid1: { id: 'uid1', userId: 'uid2', title: 'Title 01' },
      },
    })
  })
})
