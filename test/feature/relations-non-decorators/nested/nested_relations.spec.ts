import { assertState, createStore } from '@func-test/utils/Helpers'

import { createBelongsToRelation, createHasManyRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/nested/nested_relations', () => {
  class User extends Model {
    static entity = 'users'

    public static fields() {
      return {
        id: createAttrField(),
        name: createStringField(''),
        followers: createHasManyRelation(this, Follower, 'userId'),
      }
    }

    declare id: number
    declare name: string
    declare followers: Follower[]
  }

  class Follower extends Model {
    static entity = 'followers'

    public static fields() {
      return {
        id: createAttrField(),
        userId: createAttrField(),
      }
    }

    declare id: number
    declare userId: number
  }

  class Post extends Model {
    static entity = 'posts'

    public static fields() {
      return {
        id: createAttrField(),
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

  it('inserts a nested relations with missing foreign key', () => {
    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: {
        id: 1,
        name: 'John Doe',
        followers: [{ id: 1 }, { id: 2 }],
      },
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      followers: {
        1: { id: 1, userId: 1 },
        2: { id: 2, userId: 1 },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
      },
    })
  })
})
