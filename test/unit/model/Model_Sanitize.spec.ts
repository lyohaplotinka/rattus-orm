import { createStore } from '@func-test/utils/Helpers'

import { HasMany } from '@/model/decorators/attributes/relations/HasMany'
import { NumberField } from '@/model/decorators/attributes/types/NumberField'
import { StringField } from '@/model/decorators/attributes/types/StringField'
import { ModelTestEdition } from '@core-shared-utils/testUtils'

describe('unit/model/Model_Sanitize', () => {
  class User extends ModelTestEdition {
    static entity = 'users'

    @NumberField(null, { nullable: true }) id!: number
    @StringField('Unknown') name!: string
    @NumberField(0) age!: number

    @HasMany(() => Post, 'postId')
    posts!: Post[]
  }

  class Post extends ModelTestEdition {
    static entity = 'posts'
  }

  it('sanitizes the given record', () => {
    const user = createStore().$repo(User).make()

    const data = user.$sanitize({
      id: 1,
      unknownField: 1,
      age: '10',
      posts: [1, 3],
    })

    const expected = {
      id: 1,
      age: 10,
    }

    expect(data).toEqual(expected)
  })

  it('sanitize the given record and fill missing fields', () => {
    const user = createStore().$repo(User).make()

    const data = user.$sanitizeAndFill({ id: 1, posts: [1, 3] })

    const expected = {
      id: 1,
      name: 'Unknown',
      age: 0,
    }

    expect(data).toEqual(expected)
  })
})
