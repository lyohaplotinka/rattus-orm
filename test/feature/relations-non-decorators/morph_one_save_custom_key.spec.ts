import { assertState, createStore } from '@func-test/utils/Helpers'

import { createMorphOneRelation } from '@/attributes/field-relations'
import { createNumberField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/morph_one_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph one" relation with custom primary key', () => {
    class Image extends Model {
      static entity = 'images'

      static fields() {
        return {
          id: createNumberField(0),
          url: createStringField(''),
          imageableId: createStringField(''),
          imageableType: createStringField(''),
        }
      }

      declare id: number
      declare url: string
      declare imageableId: number
      declare imageableType: string
    }

    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      static fields() {
        return {
          userId: createStringField(''),
          name: createStringField(''),
          image: createMorphOneRelation(() => Image, 'imageableId', 'imageableType'),
        }
      }

      declare userId: string
      declare name: string
      declare image: Image | null
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

      static fields() {
        return {
          id: createNumberField(0),
          url: createStringField(''),
          imageableId: createStringField(''),
          imageableType: createStringField(''),
        }
      }

      declare id: number
      declare url: string
      declare imageableId: string
      declare imageableType: string
    }

    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: createNumberField(0),
          userId: createStringField(''),
          name: createStringField(''),
          image: createMorphOneRelation(() => Image, 'imageableId', 'imageableType', 'userId'),
        }
      }

      declare id: number
      declare userId: string
      declare name: string
      declare image: Image | null
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
