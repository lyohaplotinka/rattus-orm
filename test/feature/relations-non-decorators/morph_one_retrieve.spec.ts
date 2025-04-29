import { assertModel, createStore, fillState } from '@func-test/utils/Helpers'

import { createMorphOneRelation } from '@/attributes/field-relations'
import { createAttrField, createStringField } from '@/attributes/field-types'
import { Model } from '@/index'

describe('feature/relations-non-decorators/morph_one_retrieve', () => {
  class Image extends Model {
    static entity = 'images'

    public static fields() {
      return {
        id: createAttrField(),
        url: createStringField(''),
        imageableId: createAttrField(),
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

    public static fields() {
      return {
        id: createAttrField(),
        name: createStringField(''),
        image: createMorphOneRelation(this, Image, 'imageableId', 'imageableType'),
      }
    }

    declare id: number
    declare name: string
    declare image: Image | null
  }

  class Post extends Model {
    static entity = 'posts'

    public static fields() {
      return {
        id: createAttrField(),
        title: createStringField(''),
        image: createMorphOneRelation(this, Image, 'imageableId', 'imageableType'),
      }
    }

    declare id: number
    declare title: string
    declare image: Image | null
  }

  const ENTITIES = {
    users: { 1: { id: 1, name: 'John Doe' } },
    posts: {
      1: { id: 1, title: 'Hello, world!' },
      2: { id: 2, title: 'Hello, world! Again!' },
    },
    images: {
      1: {
        id: 1,
        url: '/profile.jpg',
        imageableId: 1,
        imageableType: 'users',
      },
      2: {
        id: 2,
        url: '/post.jpg',
        imageableId: 1,
        imageableType: 'posts',
      },
      3: {
        id: 3,
        url: '/post2.jpg',
        imageableId: 2,
        imageableType: 'posts',
      },
    },
  }

  describe('when there are images', () => {
    const store = createStore()

    fillState(store, ENTITIES)

    it('can eager load morph one relation for user', () => {
      const user = store.$repo(User).with('image').first()!

      expect(user).toBeInstanceOf(User)
      expect(user.image).toBeInstanceOf(Image)
      assertModel(user, {
        id: 1,
        name: 'John Doe',
        image: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 1,
          imageableType: 'users',
        },
      })
    })

    it('can eager load morph one relation for post', () => {
      const post = store.$repo(Post).with('image').first()!

      expect(post).toBeInstanceOf(Post)
      expect(post.image).toBeInstanceOf(Image)
      assertModel(post, {
        id: 1,
        title: 'Hello, world!',
        image: {
          id: 2,
          url: '/post.jpg',
          imageableId: 1,
          imageableType: 'posts',
        },
      })
    })
  })

  describe('when there are no images', () => {
    const store = createStore()

    it('can eager load missing relation as `null`', () => {
      fillState(store, {
        users: {
          1: { id: 1, name: 'John Doe' },
        },
        posts: {},
        images: {},
      })

      const user = store.$repo(User).with('image').first()!

      expect(user).toBeInstanceOf(User)
      assertModel(user, {
        id: 1,
        name: 'John Doe',
        image: null,
      })
    })
  })
})
