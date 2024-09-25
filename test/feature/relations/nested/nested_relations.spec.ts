import { assertState, createStore } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { HasMany, BelongsTo } from '@/decorators'
import { StringField, AttrField } from '@/attributes/field-types'

describe('feature/relations/nested/nested_relations', () => {
  class User extends Model {
    static entity = 'users'

    @AttrField() id!: number
    @StringField('') name!: string

    @HasMany(() => Follower, 'userId')
    followers!: Follower[]
  }

  class Follower extends Model {
    static entity = 'followers'

    @AttrField() id!: number
    @AttrField() userId!: number
  }

  class Post extends Model {
    static entity = 'posts'

    @AttrField() id!: number
    @AttrField() userId!: number | null
    @StringField('') title!: string

    @BelongsTo(() => User, 'userId')
    author!: User | null
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
