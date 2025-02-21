import { createStore } from '@func-test/utils/Helpers'

import { Model } from '@/index'
import { HasMany } from '@/attributes/field-relations'
import { StringField, NumberField } from '@/attributes/field-types'

describe(
  'performance/save_has_many_relation',
  () => {
    class User extends Model {
      public static entity = 'users'

      @NumberField(0) public id!: number
      @StringField('') public name!: string

      @HasMany(() => Post, 'userId')
      public posts!: Post[]
    }

    class Post extends Model {
      public static entity = 'posts'

      @NumberField(0) public id!: number
      @NumberField(0) public userId!: number
      @StringField('') public title!: string
    }

    it('saves data with has many relation within decent time', () => {
      const store = createStore()

      const users = []

      for (let i = 1; i <= 10000; i++) {
        users.push({
          id: i,
          name: `Username ${i}`,
          posts: [{ id: i, title: `Title ${i}` }],
        })
      }

      console.time('time')
      store.$repo(User).save(users)
      console.timeEnd('time')
    })
  },
  { timeout: 10_000 },
)
