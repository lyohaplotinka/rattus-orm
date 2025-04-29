import { assertState, createStore } from '@func-test/utils/Helpers'

import { createMorphOneRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/morph_one_save', () => {
  class Image extends Model {
    static entity = 'images'

    public static fields() {
      return {
        id: createAttrField(this),
        url: createStringField(this, ''),
        imageableId: createAttrField(this),
        imageableType: createStringField(this, ''),
      }
    }

    declare id: number
    declare url: string
    declare imageableId: number
    declare imageableType: string
  }

  class User extends Model {
    static entity = 'users'

    public static fields() {
      return {
        id: createAttrField(this),
        name: createStringField(this, ''),
        image: createMorphOneRelation(this, Image, 'imageableId', 'imageableType'),
      }
    }

    declare id: number
    declare name: string
    declare image: Image | null
  }

  it('inserts a record to the store with "morph one" relation', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageableId: 1,
        imageableType: 'users',
      },
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 1,
          imageableType: 'users',
        },
      },
    })
  })

  it('generates missing parent id', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageableType: 'users',
      },
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 1,
          imageableType: 'users',
        },
      },
    })
  })

  it('can insert a record with missing relation', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      images: {},
    })
  })

  it('can insert a record with relation set to `null`', () => {
    const store = createStore()

    store.$repo(User).save({
      id: 1,
      name: 'John Doe',
      image: null,
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      images: {},
    })
  })
})
