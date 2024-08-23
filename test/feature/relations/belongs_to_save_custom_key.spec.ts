import { assertState, createStore } from '@func-test/utils/Helpers'

import { AttrField, BelongsTo, StringField } from '@/decorators'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('feature/relations/belongs_to_save_custome_key', () => {
  beforeEach(() => {
    ModelTestEdition.clearRegistries()
  })

  it('inserts "belongs to" relation with custom primary key', () => {
    class User extends ModelTestEdition {
      static entity = 'users'

      static primaryKey = 'userId'

      @AttrField() userId!: number
      @StringField('') name!: string
    }

    class Post extends ModelTestEdition {
      static entity = 'posts'

      @AttrField() id!: string
      @AttrField() userId!: number | null
      @StringField('') title!: string

      @BelongsTo(() => User, 'userId')
      author!: User | null
    }

    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      title: 'Title 01',
      author: { userId: 1, name: 'John Doe' },
    })

    assertState(store, {
      users: {
        1: { userId: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
      },
    })
  })

  it('inserts "belongs to" relation with custom owner key', () => {
    class User extends ModelTestEdition {
      static entity = 'users'

      @AttrField() id!: number
      @AttrField() userId!: number
      @StringField('') name!: string
    }

    class Post extends ModelTestEdition {
      static entity = 'posts'

      @AttrField() id!: string
      @AttrField() userId!: number | null
      @StringField('') title!: string

      @BelongsTo(() => User, 'userId', 'userId')
      author!: User | null
    }

    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      title: 'Title 01',
      author: { id: 1, userId: 1, name: 'John Doe' },
    })

    assertState(store, {
      users: {
        1: { id: 1, userId: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
      },
    })
  })
})
