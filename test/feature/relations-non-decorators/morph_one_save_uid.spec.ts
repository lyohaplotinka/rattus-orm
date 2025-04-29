import { assertState, createStore } from '@func-test/utils/Helpers'

import { createMorphOneRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField, createUidField } from '@/attributes/field-types'
import { Model } from '@/index'
import { mockUid } from '@func-test/utils/mock-uid'

describe('feature/relations-non-decorators/morph_one_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph one" relation with parent having "uid" field as the primary key', () => {
    class Image extends Model {
      static entity = 'images'

      public static fields() {
        return {
          id: createAttrField(this, 0),
          url: createStringField(this, ''),
          imageableId: createUidField(this),
          imageableType: createStringField(this, ''),
        }
      }

      declare id: number
      declare url: string
      declare imageableId: string
      declare imageableType: string
    }

    class User extends Model {
      static entity = 'users'

      public static fields() {
        return {
          id: createUidField(this),
          name: createStringField(this, ''),
          image: createMorphOneRelation(this, Image, 'imageableId', 'imageableType'),
        }
      }

      declare id: string
      declare name: string
      declare image: Image | null
    }

    mockUid(['uid1'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageableType: 'users',
      },
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 'uid1',
          imageableType: 'users',
        },
      },
    })
  })

  it('inserts "morph one" relation with child having "uid" as the primary key', () => {
    class Image extends Model {
      static entity = 'images'

      public static fields() {
        return {
          id: createUidField(this),
          url: createStringField(this, ''),
          imageableId: createUidField(this),
          imageableType: createStringField(this, ''),
        }
      }

      declare id: string
      declare url: string
      declare imageableId: string
      declare imageableType: string
    }

    class User extends Model {
      static entity = 'users'

      public static fields() {
        return {
          id: createUidField(this),
          name: createStringField(this, ''),
          image: createMorphOneRelation(this, Image, 'imageableId', 'imageableType'),
        }
      }

      declare id: string
      declare name: string
      declare image: Image | null
    }

    mockUid(['uid1', 'uid2'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      image: {
        url: '/profile.jpg',
      },
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      images: {
        uid2: {
          id: 'uid2',
          url: '/profile.jpg',
          imageableId: 'uid1',
          imageableType: 'users',
        },
      },
    })
  })

  it('inserts "morph one" relation with child having a composite primary key', () => {
    class Image extends Model {
      static entity = 'images'
      static primaryKey = ['imageableId', 'imageableType']

      public static fields() {
        return {
          url: createStringField(this, ''),
          imageableId: createUidField(this),
          imageableType: createStringField(this, ''),
        }
      }

      declare url: string
      declare imageableId: number
      declare imageableType: string
    }

    class User extends Model {
      static entity = 'users'

      public static fields() {
        return {
          id: createUidField(this),
          name: createStringField(this, ''),
          image: createMorphOneRelation(this, Image, 'imageableId', 'imageableType'),
        }
      }

      declare id: string
      declare name: string
      declare image: Image | null
    }

    mockUid(['uid1', 'uid2'])

    const store = createStore()

    store.$repo(User).save({
      name: 'John Doe',
      image: {
        url: '/profile.jpg',
      },
    })

    assertState(store, {
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      images: {
        '["uid1","users"]': {
          url: '/profile.jpg',
          imageableId: 'uid1',
          imageableType: 'users',
        },
      },
    })
  })
})
