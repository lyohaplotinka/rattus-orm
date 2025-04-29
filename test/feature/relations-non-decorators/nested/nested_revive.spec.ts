import { createStore, fillState } from '@func-test/utils/Helpers'

import { createBelongsToRelation, createHasManyRelation } from '@/attributes/field-relations'
import { createAttrField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/nested/nested_revive', () => {
  class User extends Model {
    static entity = 'users'

    public static fields() {
      return {
        id: createAttrField(this),
        posts: createHasManyRelation(this, Post, 'userId'),
      }
    }

    declare id: number
    declare posts: Post[]
  }

  class Post extends Model {
    static entity = 'posts'

    public static fields() {
      return {
        id: createAttrField(this),
        userId: createAttrField(this),
        author: createBelongsToRelation(this, User, 'userId'),
        comments: createHasManyRelation(this, Comment, 'postId'),
      }
    }

    declare id: number
    declare userId: number | null
    declare author: User | null
    declare comments: Comment[]
  }

  class Comment extends Model {
    static entity = 'comments'

    public static fields() {
      return {
        id: createAttrField(this),
        postId: createAttrField(this),
        userId: createAttrField(this),
        author: createBelongsToRelation(this, User, 'userId'),
      }
    }

    declare id: number
    declare postId: number
    declare userId: number
    declare author: User | null
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
