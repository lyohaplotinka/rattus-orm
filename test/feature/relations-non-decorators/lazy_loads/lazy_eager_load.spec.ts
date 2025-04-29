import { assertModels, createStore, fillState } from '@func-test/utils/Helpers'

import { createHasManyRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/lazy_loads/lazy_eager_load', () => {
  class User extends Model {
    static entity = 'users'

    public static fields() {
      return {
        id: createAttrField(),
        name: createStringField(''),
        posts: createHasManyRelation(this, Post, 'userId'),
      }
    }

    declare id: number
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

  it('can lazy eager load relations', async () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
      },
    })

    const userRepo = store.$repo(User)

    const users = userRepo.all()

    assertModels(users, [{ id: 1, name: 'John Doe' }])

    userRepo.with('posts').load(users)

    assertModels(users, [
      {
        id: 1,
        name: 'John Doe',
        posts: [
          { id: 1, userId: 1, title: 'Title 01' },
          { id: 2, userId: 1, title: 'Title 02' },
        ],
      },
    ])
  })
})
