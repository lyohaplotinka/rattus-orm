import { createStore, fillState } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { HasMany, BelongsTo } from '@/decorators'
import { AttrField } from '@/attributes/field-types'

describe('feature/relations/nested/nested_revive', () => {
  class User extends Model {
    static entity = 'users'

    @AttrField() id!: number

    @HasMany(() => Post, 'userId')
    posts!: Post[]
  }

  class Post extends Model {
    static entity = 'posts'

    @AttrField() id!: number
    @AttrField() userId!: number | null

    @BelongsTo(() => User, 'userId')
    author!: User | null

    @HasMany(() => Comment, 'postId')
    comments!: Comment[]
  }

  class Comment extends Model {
    static entity = 'comments'

    @AttrField() id!: number
    @AttrField() postId!: number
    @AttrField() userId!: number

    @BelongsTo(() => User, 'userId')
    author!: User | null
  }

  it('can revive a complex nested schema', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1 },
        2: { id: 2 },
        3: { id: 3 },
        4: { id: 4 },
      },
      posts: {
        1: { id: 1, userId: 2 },
        2: { id: 2, userId: 2 },
        3: { id: 3, userId: 1 },
        4: { id: 4, userId: 1 },
      },
      comments: {
        1: { id: 1, postId: 4, userId: 4 },
        2: { id: 2, postId: 1, userId: 2 },
        3: { id: 3, postId: 2, userId: 3 },
        4: { id: 4, postId: 4, userId: 3 },
        5: { id: 5, postId: 2, userId: 1 },
      },
    })

    const schema = [
      {
        id: 2,
        posts: [
          {
            id: 4,
            comments: [{ id: 2 }],
          },
          {
            id: 3,
            comments: [
              {
                id: 1,
                author: { id: 4 },
              },
            ],
          },
        ],
      },
      {
        id: 1,
        posts: [{ id: 1 }, { id: 2 }],
      },
    ]

    const users = store.$repo(User).revive(schema)

    expect(users.length).toBe(2)
    expect(users[0].id).toBe(2)
    expect(users[1].id).toBe(1)
    expect(users[0].posts.length).toBe(2)
    expect(users[0].posts[0].comments.length).toBe(1)
    expect(users[0].posts[0].comments[0].id).toBe(2)
    expect(users[0].posts[1].comments.length).toBe(1)
    expect(users[0].posts[1].comments[0].id).toBe(1)
  })
})
