import { assertState, createStore } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { MorphOne, NumberField, StringField } from '@/decorators'

describe('feature/relations/morph_one_save', () => {
  class Image extends Model {
    static entity = 'images'

    @NumberField(0) id!: number
    @StringField('') url!: string
    @NumberField(0) imageableId!: number
    @StringField('') imageableType!: string
  }

  class User extends Model {
    static entity = 'users'

    @NumberField(0) id!: number
    @StringField('') name!: string

    @MorphOne(() => Image, 'imageableId', 'imageableType')
    image!: Image | null
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
