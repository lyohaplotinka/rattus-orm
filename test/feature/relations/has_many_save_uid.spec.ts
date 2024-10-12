import { assertState, createStore, mockUid } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { HasMany } from '@/attributes/field-relations'
import { AttrField, StringField, UidField } from '@/attributes/field-types'

describe('feature/relations/has_many_insert_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has many" relation with parent having "uid" field as the primary key', () => {
    class User extends Model {
      static entity = 'users'

      @UidField() id!: string
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

    mockUid(['uid1'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' },
      ],
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 'uid1', title: 'Title 01' },
        2: { id: 2, userId: 'uid1', title: 'Title 02' },
      },
    })
  })

  it('inserts "has many" relation with child having "uid" as the foreign key', () => {
    class User extends Model {
      static entity = 'users'

      @UidField() id!: string
      @StringField('') name!: string

      @HasMany(() => Post, 'userId')
      posts!: Post[]
    }

    class Post extends Model {
      static entity = 'posts'

      @AttrField() id!: number
      @UidField() userId!: string
      @StringField('') title!: string
    }

    mockUid(['uid1', 'uid2', 'uid3'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' },
      ],
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 'uid1', title: 'Title 01' },
        2: { id: 2, userId: 'uid1', title: 'Title 02' },
      },
    })
  })
})
