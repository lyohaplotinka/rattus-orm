import { assertState, createStore } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { BelongsTo } from '@/attributes/field-relations'
import { AttrField, StringField } from '@/attributes/field-types'

describe('feature/relations/belongs_to_save_custome_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "belongs to" relation with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      @AttrField() userId!: number
      @StringField('') name!: string
    }

    class Post extends Model {
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
    class User extends Model {
      static entity = 'users'

      @AttrField() id!: number
      @AttrField() userId!: number
      @StringField('') name!: string
    }

    class Post extends Model {
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
