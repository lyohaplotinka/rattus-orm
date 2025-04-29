import { assertState, createStore } from '@func-test/utils/Helpers'

import { createHasManyRelation } from '@/attributes/field-relations'
import {
  createAttrField,
  createStringField,
  createUidField,
} from '@/attributes/field-types'
import { Model } from '@/index'
import { mockUid } from '@func-test/utils/mock-uid'

describe('feature/relations-non-decorators/has_many_insert_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has many" relation with parent having "uid" field as the primary key', () => {
    class User extends Model {
      static entity = 'users'

      public static fields() {
        return {
          id: createUidField(this),
          name: createStringField(this, ''),
          posts: createHasManyRelation(this, Post, 'userId'),
        }
      }

      declare id: string
      declare name: string
      declare posts: Post[]
    }

    class Post extends Model {
      static entity = 'posts'

      public static fields() {
        return {
          id: createAttrField(this),
          userId: createAttrField(this),
          title: createStringField(this, ''),
        }
      }

      declare id: number
      declare userId: number
      declare title: string
    }

    mockUid(['uid1'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' },
      ],
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 'uid1', title: 'Title 01' },
        2: { id: 2, userId: 'uid1', title: 'Title 02' },
      },
    })
  })

  it('inserts "has many" relation with child having "uid" as the foreign key', () => {
    class User extends Model {
      static entity = 'users'


      public static fields() {
        return {
          id: createUidField(this),
          name: createStringField(this, ''),
          posts: createHasManyRelation(this, Post, 'userId'),
        }
      }

      declare id: string
      declare name: string
      declare posts: Post[]
    }

    class Post extends Model {
      static entity = 'posts'

      public static fields() {
        return {
          id: createAttrField(this),
          userId: createUidField(this),
          title: createStringField(this, ''),
        }
      }

      declare id: number
      declare userId: string
      declare title: string
    }

    mockUid(['uid1', 'uid2', 'uid3'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' },
      ],
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 'uid1', title: 'Title 01' },
        2: { id: 2, userId: 'uid1', title: 'Title 02' },
      },
    })
  })
})

