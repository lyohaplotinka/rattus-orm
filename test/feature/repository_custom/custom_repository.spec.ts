import { createStore } from '@func-test/utils/Helpers'

import { Model, Repository } from '@/index'
import { StringField, AttrField } from '@/attributes/field-types'

describe('feature/repository_custom/custom_repository', () => {
  it('can define a custom repository', async () => {
    class User extends Model {
      static entity = 'users'

      @AttrField() id!: any
      @StringField('') name!: string
    }

    class UserRepository extends Repository<User> {
      use = User

      custom(): number {
        return 1
      }
    }

    const store = createStore()

    const userRepo = new UserRepository(store.$database)

    expect((userRepo as UserRepository).custom()).toBe(1)
  })

  it('can define an abstract custom repository', async () => {
    class ARepository extends Repository {
      custom(): number {
        return 1
      }
    }

    const store = createStore()

    const userRepo = new ARepository(store.$database)

    expect((userRepo as ARepository).custom()).toBe(1)
  })

  it('throws if the user tries to access the model in abstract custom repository', async () => {
    class ARepository extends Repository {
      custom(): any {
        this.getModel()
      }
    }

    const store = createStore()

    const userRepo = new ARepository(store.$database)

    expect(() => {
      ;(userRepo as ARepository).custom()
    }).toThrow()
  })
})
