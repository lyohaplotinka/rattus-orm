import { assertState, createStore } from '@func-test/utils/Helpers'

import { MorphTo } from '@/attributes/field-relations'
import { AttrField, NumberField, StringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations/morph_to_save', () => {
  class Image extends Model {
    static entity = 'images'

    @NumberField(0) id!: number
    @StringField('') url!: string
    @AttrField() imageableId!: number
    @AttrField() imageableType!: string
    @MorphTo(() => [User], 'imageableId', 'imageableType')
    imageable!: User | null
  }

  class User extends Model {
    static entity = 'users'

    @NumberField(0) id!: number
    @StringField('') name!: string
  }

  it('inserts a record to the store with "morph to" relation', () => {
    const store = createStore()

    store.$repo(Image).save({
      id: 1,
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: { id: 2, name: 'John Doe' },
    })

    assertState(store, {
      users: { 2: { id: 2, name: 'John Doe' } },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 2,
          imageableType: 'users',
        },
      },
    })
  })

  it('generates missing relational key', () => {
    const store = createStore()

    store.$repo(Image).save({
      id: 1,
      url: '/profile.jpg',
      imageableType: 'users',
      imageable: { id: 2, name: 'John Doe' },
    })

    assertState(store, {
      users: { 2: { id: 2, name: 'John Doe' } },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 2,
          imageableType: 'users',
        },
      },
    })
  })

  it('can insert a record with missing related data', () => {
    const store = createStore()

    store.$repo(Image).save({
      id: 1,
      url: '/profile.jpg',
    })

    assertState(store, {
      users: {},
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: null,
          imageableType: null,
        },
      },
    })
  })

  it('can insert a record with related data set to `null`', () => {
    const store = createStore()

    store.$repo(Image).save({
      id: 1,
      url: '/profile.jpg',
      imageable: null,
    })

    assertState(store, {
      users: {},
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: null,
          imageableType: null,
        },
      },
    })
  })
})
