import { assertInstanceOf, assertModel, createStore, fillState } from '@func-test/utils/Helpers'

import { createBelongsToRelation, createHasManyRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/eager_loads_all', () => {
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
        id: createAttrField(),
        userId: createAttrField(),
        title: createStringField(''),
        author: createBelongsToRelation(this, User, 'userId'),
        comments: createHasManyRelation(this, Comment, 'postId'),
      }
    }

    declare id: number
    declare userId: number
    declare title: string
    declare author: User | null
    declare comments: Comment[]
  }

  class Comment extends Model {
    static entity = 'comments'

    public static fields() {
      return {
        id: createAttrField(),
        postId: createAttrField(),
        content: createStringField(''),
      }
    }

    declare id: number
    declare postId: number
    declare content: string
  }

  it('eager loads all top level relations', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
      },
      comments: {
        1: { id: 1, postId: 1, content: 'Content 01' },
      },
    })

    const post = store.$repo(Post).withAll().first()!

    expect(post.author).toBeInstanceOf(User)
    assertInstanceOf(post.comments, Comment)
    assertModel(post, {
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' },
      comments: [{ id: 1, postId: 1, content: 'Content 01' }],
    })
  })
})
