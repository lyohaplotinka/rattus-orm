import { assertState, createStore } from '@func-test/utils/Helpers'

import { createMorphToRelation } from '@/attributes/field-relations'
import { createAttrField, createNumberField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/morph_to_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph to" relation with custom primary key', () => {
    class Image extends Model {
      static entity = 'images'

      public static fields() {
        return {
          id: createNumberField(0),
          url: createStringField(''),
          imageableId: createAttrField(),
          imageableType: createAttrField(),
          imageable: createMorphToRelation(() => [User], 'imageableId', 'imageableType'),
        }
      }

      declare id: number
      declare url: string
      declare imageableId: number
      declare imageableType: string
      declare imageable: User | null
    }

    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      public static fields() {
        return {
          userId: createNumberField(0),
          name: createStringField(''),
        }
      }

      declare userId: number
      declare name: string
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
    class Image extends Model {
      static entity = 'images'

      public static fields() {
        return {
          id: createNumberField(0),
          url: createStringField(''),
          imageableId: createAttrField(),
          imageableType: createAttrField(),
          imageable: createMorphToRelation(
            () => [User],
            'imageableId',
            'imageableType',
            'imageableId',
          ),
        }
      }

      declare id: number
      declare url: string
      declare imageableId: number
      declare imageableType: string
      declare imageable: User | null
    }

    class User extends Model {
      static entity = 'users'

      public static fields() {
        return {
          id: createNumberField(0),
          imageableId: createAttrField(),
          name: createStringField(''),
        }
      }

      declare id: number
      declare imageableId: number
      declare name: string
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
