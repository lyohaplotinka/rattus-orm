import { assertState, createStore } from '@func-test/utils/Helpers'

import { createBelongsToRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/belongs_to_save', () => {
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
        author: createBelongsToRelation(() => User, 'userId'),
      }
    }

    declare id: number
    declare userId: number | null
    declare title: string
    declare author: User | null
  }

  it('inserts a record to the store with "belongs to" relation', () => {
    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' },
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
      },
    })
  })

  it('generates missing foreign key', () => {
    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' },
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
      },
    })
  })

  it('can insert a record with missing relational key', () => {
    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      title: 'Title 01',
    })

    assertState(store, {
      users: {},
      posts: {
        1: { id: 1, userId: null, title: 'Title 01' },
      },
    })
  })

  it('can insert a record with relational key set to `null`', () => {
    const store = createStore()

    store.$repo(Post).save({
      id: 1,
      title: 'Title 01',
      author: null,
    })

    assertState(store, {
      users: {},
      posts: {
        1: { id: 1, userId: null, title: 'Title 01' },
      },
    })
  })
})
