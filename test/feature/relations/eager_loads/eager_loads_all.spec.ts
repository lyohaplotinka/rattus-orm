import { assertInstanceOf, assertModel, createStore, fillState } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { HasMany, BelongsTo } from '@/attributes/field-relations'
import { StringField, AttrField } from '@/attributes/field-types'

describe('feature/relations/eager_loads_all', () => {
  class User extends Model {
    static entity = 'users'

    @AttrField() id!: number
    @StringField('') name!: string
  }

  class Post extends Model {
    static entity = 'posts'

    @AttrField() id!: number
    @AttrField() userId!: number
    @StringField('') title!: string

    @BelongsTo(() => User, 'userId')
    author!: User | null

    @HasMany(() => Comment, 'postId')
    comments!: Comment[]
  }

  class Comment extends Model {
    static entity = 'comments'

    @AttrField() id!: number
    @AttrField() postId!: number
    @StringField('') content!: string
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
