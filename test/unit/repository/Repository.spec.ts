import { assertModel, createStore } from 'test/utils/Helpers'

import { Attr, Model, Str } from '@/index'

describe('unit/repository/Repository', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('John Doe') name!: string
  }

  class Post extends Model {
    public static entity = 'posts'

    @Attr() public id!: any
    @Str('Title 001') public title!: string
  }

  it('creates a new model instance', () => {
    const store = createStore()

    const user = store.$repo(User).make()

    expect(user).toBeInstanceOf(User)
    assertModel(user, { id: null, name: 'John Doe' })
  })

  it('creates a new model instance in a new database', () => {
    const store = createStore()

    const connection = 'test_namespace'
    const user = store.$repo(User, connection).make()

    expect(user).toBeInstanceOf(User)
    assertModel(user, { id: null, name: 'John Doe' })

    // Fetches the same atabase on 2nd call.
    const user2 = store.$repo(User, connection).make()
    assertModel(user2, { id: null, name: 'John Doe' })
  })

  it('creates a new model instance with default values', () => {
    const store = createStore()

    const user = store.$repo(User).make({
      id: 1,
      name: 'Jane Doe',
    })

    expect(user).toBeInstanceOf(User)
    assertModel(user, { id: 1, name: 'Jane Doe' })
  })

  it('can create a new repository from the model', () => {
    const store = createStore()

    const userRepo = store.$repo(User)

    const postRepo = userRepo.repo(Post)

    expect(postRepo.getModel()).toBeInstanceOf(Post)
  })
})
