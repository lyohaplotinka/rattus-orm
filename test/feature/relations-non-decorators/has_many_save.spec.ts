import { assertState, createStore, fillState } from '@func-test/utils/Helpers'

import { createHasManyRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/has_many_save', () => {
  class User extends Model {
    static entity = 'users'

    public static fields() {
      return {
        id: createAttrField(this),
        name: createStringField(this, ''),
        posts: createHasManyRelation(this, Post, 'userId'),
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
        id: createAttrField(this),
        userId: createAttrField(this),
        title: createStringField(this, ''),
      }
    }

    declare id: number
    declare userId: number
    declare title: string
  }

  it('saves a model to the store with "has many" relation', () => {
    const store = createStore()

    fillState(store, {
      users: {},
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
      },
    })

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 1, userId: 1, title: 100 },
        { id: 2, userId: 1, title: 200 },
      ],
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: '100' },
        2: { id: 2, userId: 1, title: '200' },
      },
    })
  })

  it('generates missing foreign key', async () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' },
      ],
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
      },
    })
  })

  it('can insert a record with missing relational key', async () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {},
    })
  })
})
