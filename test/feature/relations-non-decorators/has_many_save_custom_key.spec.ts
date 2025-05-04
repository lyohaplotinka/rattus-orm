import { assertState, createStore } from '@func-test/utils/Helpers'

import { createHasManyRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/has_many_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has many" relation with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      public static fields() {
        return {
          userId: createAttrField(),
          name: createStringField(''),
          posts: createHasManyRelation(() => Post, 'userId'),
        }
      }

      declare userId: string
      declare name: string
      declare posts: Post[]
    }

    class Post extends Model {
      static entity = 'posts'

      public static fields() {
        return {
          id: createAttrField(),
          userId: createAttrField(),
          title: createStringField(''),
        }
      }

      declare id: number
      declare userId: number
      declare title: string
    }

    const store = createStore()

    store.$repo(User).save({
      userId: 1,
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' },
      ],
    })

    assertState(store, {
      users: {
        1: { userId: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
      },
    })
  })

  it('inserts "has many" relation with custom local key', () => {
    class User extends Model {
      static entity = 'users'

      public static fields() {
        return {
          id: createAttrField(),
          userId: createAttrField(),
          name: createStringField(''),
          posts: createHasManyRelation(() => Post, 'userId', 'userId'),
        }
      }

      declare id: number
      declare userId: number
      declare name: string
      declare posts: Post[]
    }

    class Post extends Model {
      static entity = 'posts'

      public static fields() {
        return {
          id: createAttrField(),
          userId: createAttrField(),
          title: createStringField(''),
        }
      }

      declare id: number
      declare userId: string
      declare title: string
    }

    const store = createStore()

    store.$repo(User).save({
      id: 1,
      userId: 2,
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' },
      ],
    })

    assertState(store, {
      users: {
        1: { id: 1, userId: 2, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 2, title: 'Title 01' },
        2: { id: 2, userId: 2, title: 'Title 02' },
      },
    })
  })
})
