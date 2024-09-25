import { assertModels, createStore, fillState } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { HasMany } from '@/decorators'
import { StringField, AttrField } from '@/attributes/field-types'

describe('feature/relations/lazy_loads/lazy_eager_load', () => {
  class User extends Model {
    static entity = 'users'

    @AttrField() id!: number
    @StringField('') name!: string

    @HasMany(() => Post, 'userId')
    posts!: Post[]
  }

  class Post extends Model {
    static entity = 'posts'

    @AttrField() id!: number
    @AttrField() userId!: number
    @StringField('') title!: string
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
