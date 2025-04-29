import { assertState, createStore } from '@func-test/utils/Helpers'

import { BelongsTo } from '@/attributes/field-relations'
import { AttrField, StringField, UidField } from '@/attributes/field-types'
import { Model } from '@/index'
import { mockUid } from '@func-test/utils/mock-uid'

describe('feature/relations/belongs_to_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "belongs to" relation with parent having "uid" field as the primary key', () => {
    class User extends Model {
      static entity = 'users'

      @AttrField() id!: number
      @StringField('') name!: string
    }

    class Post extends Model {
      static entity = 'posts'

      @UidField() id!: string
      @AttrField() userId!: number | null
      @StringField('') title!: string

      @BelongsTo(() => User, 'userId')
      author!: User | null
    }

    mockUid(['uid1'])

    const store = createStore()

    store.$repo(Post).save({
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' },
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        uid1: { id: 'uid1', userId: 1, title: 'Title 01' },
      },
    })
  })

  it('inserts "belongs to" relation with child having "uid" as the owner key', () => {
    class User extends Model {
      static entity = 'users'

      @UidField() id!: string
      @StringField('') name!: string
    }

    class Post extends Model {
      static entity = 'posts'

      @UidField() id!: number
      @AttrField() userId!: number | null
      @StringField('') title!: string

      @BelongsTo(() => User, 'userId')
      author!: User | null
    }

    mockUid(['uid1', 'uid2'])

    const store = createStore()

    store.$repo(Post).save({
      title: 'Title 01',
      author: { name: 'John Doe' },
    })

    assertState(store, {
      users: {
        uid2: { id: 'uid2', name: 'John Doe' },
      },
      posts: {
        uid1: { id: 'uid1', userId: 'uid2', title: 'Title 01' },
      },
    })
  })
})
