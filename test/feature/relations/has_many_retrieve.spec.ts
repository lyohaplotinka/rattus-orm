import { assertInstanceOf, assertModel, createStore, fillState } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { HasMany } from '@/attributes/field-relations'
import { AttrField, StringField } from '@/attributes/field-types'

describe('feature/relations/has_many_retrieve', () => {
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

  it('can eager load has many relation', async () => {
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

    const user = store.$repo(User).with('posts').first()!

    expect(user).toBeInstanceOf(User)
    assertInstanceOf(user.posts, Post)
    assertModel(user, {
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 1, userId: 1, title: 'Title 01' },
        { id: 2, userId: 1, title: 'Title 02' },
      ],
    })
  })

  it('can eager load missing relation as empty array', async () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {},
    })

    const user = store.$repo(User).with('posts').first()!

    expect(user).toBeInstanceOf(User)
    assertModel(user, {
      id: 1,
      name: 'John Doe',
      posts: [],
    })
  })

  it('can revive "has many" relations', () => {
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

    const schema = {
      id: '1',
      posts: [{ id: 2 }, { id: 1 }],
    }

    const user = store.$repo(User).revive(schema)!

    expect(user.posts.length).toBe(2)
    expect(user.posts[0]).toBeInstanceOf(Post)
    expect(user.posts[1]).toBeInstanceOf(Post)
    expect(user.posts[0].id).toBe(2)
    expect(user.posts[1].id).toBe(1)
  })
})
