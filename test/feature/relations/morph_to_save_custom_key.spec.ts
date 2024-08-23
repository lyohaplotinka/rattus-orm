import { assertState, createStore } from '@func-test/utils/Helpers'

import { AttrField, MorphTo, NumberField, StringField } from '@/decorators'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('feature/relations/morph_to_save_custom_key', () => {
  beforeEach(() => {
    ModelTestEdition.clearRegistries()
  })

  it('inserts "morph to" relation with custom primary key', () => {
    class Image extends ModelTestEdition {
      static entity = 'images'

      @NumberField(0) id!: number
      @StringField('') url!: string
      @AttrField() imageableId!: number
      @AttrField() imageableType!: string
      @MorphTo(() => [User], 'imageableId', 'imageableType')
      imageable!: User | null
    }

    class User extends ModelTestEdition {
      static entity = 'users'

      static primaryKey = 'userId'

      @NumberField(0) userId!: number
      @StringField('') name!: string
    }

    const store = createStore()

    store.$repo(Image).save({
      id: 1,
      url: '/profile.jpg',
      imageableType: 'users',
      imageable: { userId: 2, name: 'John Doe' },
    })

    assertState(store, {
      users: { 2: { userId: 2, name: 'John Doe' } },
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

  it('inserts "morph to" relation with custom local key', () => {
    class Image extends ModelTestEdition {
      static entity = 'images'

      @NumberField(0) id!: number
      @StringField('') url!: string
      @AttrField() imageableId!: number
      @AttrField() imageableType!: string
      @MorphTo(() => [User], 'imageableId', 'imageableType', 'imageableId')
      imageable!: User | null
    }

    class User extends ModelTestEdition {
      static entity = 'users'

      @NumberField(0) id!: number
      @AttrField() imageableId!: number
      @StringField('') name!: string
    }

    const store = createStore()

    store.$repo(Image).save({
      id: 1,
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: { id: 1, imageableId: 2, name: 'John Doe' },
    })

    assertState(store, {
      users: { 1: { id: 1, imageableId: 2, name: 'John Doe' } },
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
})
