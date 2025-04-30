import { assertInstanceOf, assertModel, createStore, fillState } from '@func-test/utils/Helpers'

import { createHasManyRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/has_many_retrieve', () => {
  class User extends Model {
    static entity = 'users'

    public static fields() {
      return {
        id: createAttrField(),
        name: createStringField(''),
        posts: createHasManyRelation(this, () => Post, 'userId'),
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
