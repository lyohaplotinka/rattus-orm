import { assertState, createStore, mockUid } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { MorphOne } from '@/attributes/field-relations'
import { NumberField, StringField, UidField } from '@/attributes/field-types'

describe('feature/relations/morph_one_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph one" relation with parent having "uid" field as the primary key', () => {
    class Image extends Model {
      static entity = 'images'

      @NumberField(0) id!: number
      @StringField('') url!: string
      @UidField() imageableId!: string
      @StringField('') imageableType!: string
    }

    class User extends Model {
      static entity = 'users'

      @UidField() id!: string
      @StringField('') name!: string

      @MorphOne(() => Image, 'imageableId', 'imageableType')
      image!: Image | null
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

      @UidField() id!: string
      @StringField('') url!: string
      @UidField() imageableId!: string
      @StringField('') imageableType!: string
    }

    class User extends Model {
      static entity = 'users'

      @UidField() id!: string
      @StringField('') name!: string

      @MorphOne(() => Image, 'imageableId', 'imageableType')
      image!: Image | null
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

      @StringField('') url!: string
      @UidField() imageableId!: number
      @StringField('') imageableType!: string
    }

    class User extends Model {
      static entity = 'users'

      @UidField() id!: string
      @StringField('') name!: string

      @MorphOne(() => Image, 'imageableId', 'imageableType')
      image!: Image | null
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
