import { createStore } from '@func-test/utils/Helpers'

import { HasMany, Model, Num, Str } from '@/index'

describe('performance/save_has_many_relation', () => {
  class User extends Model {
    public static entity = 'users'

    @Num(0) public id!: number
    @Str('') public name!: string

    @HasMany(() => Post, 'userId')
    public posts!: Post[]
  }

  class Post extends Model {
    public static entity = 'posts'

    @Num(0) public id!: number
    @Num(0) public userId!: number
    @Str('') public title!: string
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
})
