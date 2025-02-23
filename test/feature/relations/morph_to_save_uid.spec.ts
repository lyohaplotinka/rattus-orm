import { assertState, createStore } from '@func-test/utils/Helpers'

import { MorphTo } from '@/attributes/field-relations'
import { AttrField, NumberField, StringField, UidField } from '@/attributes/field-types'
import { Model } from '@/index'
import { mockUid } from '@func-test/utils/mock-uid'

describe('feature/relations/morph_to_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph to" relation with parent having "uid" field as the primary key', () => {
    class Image extends Model {
      static entity = 'images'

      @UidField() id!: number
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

      @UidField() id!: string
      @StringField('') url!: string
      @AttrField() imageableId!: string
      @AttrField() imageableType!: string
      @MorphTo(() => [User], 'imageableId', 'imageableType')
      imageable!: User | null
    }

    class User extends Model {
      static entity = 'users'

      @UidField() id!: string
      @StringField('') name!: string
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
