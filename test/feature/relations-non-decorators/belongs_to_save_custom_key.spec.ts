import { assertState, createStore } from '@func-test/utils/Helpers'

import { createBelongsToRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/belongs_to_save_custome_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "belongs to" relation with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      public static fields() {
        return {
          userId: createAttrField(this),
          name: createStringField(this, ''),
        }
      }

      declare userId: number
      declare name: string
    }

    class Post extends Model {
      static entity = 'posts'

      public static fields() {
        return {
          id: createAttrField(this),
          userId: createAttrField(this),
          title: createStringField(this, ''),
          author: createBelongsToRelation(this, User, 'userId'),
        }
      }

      declare id: string
      declare userId: number | null
      declare title: string
      declare author: User | null
    }

    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      title: 'Title 01',
      author: { userId: 1, name: 'John Doe' },
    })

    assertState(store, {
      users: {
        1: { userId: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
      },
    })
  })

  it('inserts "belongs to" relation with custom owner key', () => {
    class User extends Model {
      static entity = 'users'

      public static fields() {
        return {
          id: createAttrField(this),
          userId: createAttrField(this),
          name: createStringField(this, ''),
        }
      }

      declare id: number
      declare userId: number
      declare name: string
    }

    class Post extends Model {
      static entity = 'posts'

      public static fields() {
        return {
          id: createAttrField(this),
          userId: createAttrField(this),
          title: createStringField(this, ''),
          author: createBelongsToRelation(this, User, 'userId', 'userId'),
        }
      }

      declare id: string
      declare userId: number | null
      declare title: string
      declare author: User | null
    }

    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      title: 'Title 01',
      author: { id: 1, userId: 1, name: 'John Doe' },
    })

    assertState(store, {
      users: {
        1: { id: 1, userId: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
      },
    })
  })
})
