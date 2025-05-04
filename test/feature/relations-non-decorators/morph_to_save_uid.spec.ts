import { assertState, createStore } from '@func-test/utils/Helpers'

import { createMorphToRelation } from '@/attributes/field-relations'
import {
  createAttrField,
  createNumberField,
  createStringField,
  createUidField,
} from '@/attributes/field-types'
import { Model } from '@/index'
import { mockUid } from '@func-test/utils/mock-uid'

describe('feature/relations-non-decorators/morph_to_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph to" relation with parent having "uid" field as the primary key', () => {
    class Image extends Model {
      static entity = 'images'

      public static fields() {
        return {
          id: createUidField(),
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

      public static fields() {
        return {
          id: createNumberField(0),
          name: createStringField(''),
        }
      }

      declare id: number
      declare name: string
    }

    mockUid(['uid1'])

    const store = createStore()

    store.$repo(Image).save({
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: { id: 1, name: 'John Doe' },
    })

    assertState(store, {
      users: { 1: { id: 1, name: 'John Doe' } },
      images: {
        uid1: {
          id: 'uid1',
          url: '/profile.jpg',
          imageableId: 1,
          imageableType: 'users',
        },
      },
    })
  })

  it('inserts "morph to" relation with parent and child having "uid" as the primary key', () => {
    class Image extends Model {
      static entity = 'images'

      public static fields() {
        return {
          id: createUidField(),
          url: createStringField(''),
          imageableId: createAttrField(),
          imageableType: createAttrField(),
          imageable: createMorphToRelation(() => [User], 'imageableId', 'imageableType'),
        }
      }

      declare id: string
      declare url: string
      declare imageableId: string
      declare imageableType: string
      declare imageable: User | null
    }

    class User extends Model {
      static entity = 'users'

      public static fields() {
        return {
          id: createUidField(),
          name: createStringField(''),
        }
      }

      declare id: string
      declare name: string
    }

    mockUid(['uid1', 'uid2'])

    const store = createStore()

    store.$repo(Image).save({
      url: '/profile.jpg',
      imageableType: 'users',
      imageable: { name: 'John Doe' },
    })

    assertState(store, {
      users: { uid2: { id: 'uid2', name: 'John Doe' } },
      images: {
        uid1: {
          id: 'uid1',
          url: '/profile.jpg',
          imageableId: 'uid2',
          imageableType: 'users',
        },
      },
    })
  })
})
