import { assertModel, createStore, fillState } from '@func-test/utils/Helpers'

import { AttrField, BelongsTo, StringField } from '@/decorators'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('feature/relations/belongs_to_retrieve', () => {
  class User extends ModelTestEdition {
    static entity = 'users'

    @AttrField() id!: number
    @StringField('') name!: string
  }

  class Post extends ModelTestEdition {
    static entity = 'posts'

    @AttrField() id!: number
    @AttrField() userId!: number | null
    @StringField('') title!: string

    @BelongsTo(() => User, 'userId')
    author!: User | null
  }

  it('can eager load belongs to relation', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
      },
    })

    const post = store.$repo(Post).with('author').first()!

    expect(post).toBeInstanceOf(Post)
    expect(post.author).toBeInstanceOf(User)
    assertModel(post, {
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' },
    })
  })

  it('can eager load missing relation as `null`', () => {
    const store = createStore()

    fillState(store, {
      users: {},
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
      },
    })

    const post = store.$repo(Post).with('author').first()!

    expect(post).toBeInstanceOf(Post)
    assertModel(post, {
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: null,
    })
  })

  it('ignores the relation with the empty foreign key', () => {
    const store = createStore()

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: null, title: 'Title 01' },
      },
    })

    const post = store.$repo(Post).with('author').first()!

    expect(post).toBeInstanceOf(Post)
    assertModel(post, {
      id: 1,
      userId: null,
      title: 'Title 01',
      author: null,
    })
  })
})
