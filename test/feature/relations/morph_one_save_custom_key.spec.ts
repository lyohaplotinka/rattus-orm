import { assertState, createStore } from '@func-test/utils/Helpers'

import { MorphOne } from '@/attributes/field-relations'
import { NumberField, StringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations/morph_one_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph one" relation with custom primary key', () => {
    class Image extends Model {
      static entity = 'images'

      @NumberField(0) id!: number
      @StringField('') url!: string
      @StringField('') imageableId!: number
      @StringField('') imageableType!: string
    }

    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      @StringField('') userId!: string
      @StringField('') name!: string

      @MorphOne(() => Image, 'imageableId', 'imageableType')
      image!: Image | null
    }

    const store = createStore()

    store.$repo(User).save({
      userId: 1,
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageableType: 'users',
      },
    })

    assertState(store, {
      users: {
        1: { userId: '1', name: 'John Doe' },
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: '1',
          imageableType: 'users',
        },
      },
    })
  })

  it('inserts "morph one" relation with custom local key', () => {
    class Image extends Model {
      static entity = 'images'

      @NumberField(0) id!: number
      @StringField('') url!: string
      @StringField('') imageableId!: string
      @StringField('') imageableType!: string
    }

    class User extends Model {
      static entity = 'users'

      @NumberField(0) id!: number
      @StringField('') userId!: string
      @StringField('') name!: string

      @MorphOne(() => Image, 'imageableId', 'imageableType', 'userId')
      image!: Image | null
    }

    const store = createStore()

    store.$repo(User).save({
      id: 1,
      userId: 2,
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageableType: 'users',
      },
    })

    assertState(store, {
      users: {
        1: { id: 1, userId: '2', name: 'John Doe' },
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: '2',
          imageableType: 'users',
        },
      },
    })
  })
})
