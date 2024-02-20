import { vi } from 'vitest'

import { Model, Num, Repository, Str } from '../src'
import { ObjectDataProvider } from '../src/object-data-provider'

export class TestUser extends Model {
  public static entity = 'testUser'

  @Str('')
  public declare id: string

  @Num(0)
  public declare age: number
}

export class TestUserNoCasting extends TestUser {
  public static dataTypeCasting = false
}

export class TestUserCustomRepo extends Repository<TestUser> {
  public use = TestUser

  public getAllButCool() {
    return this.all()
  }
}

export class TestUserNoCastingCustomRepo extends TestUserCustomRepo {
  public use = TestUserNoCasting
}

export function createBindSpy() {
  const mocked = vi.spyOn(Function.prototype, 'bind').mockImplementation(function (
    this: any,
    thisArg: any,
    ...args: any[]
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const func = this
    const boundFunction = function (...newArgs: any[]): any {
      return func.apply(thisArg, args.concat(newArgs))
    }
    boundFunction.boundTo = thisArg
    return boundFunction
  })

  return {
    ...mocked,
    [Symbol.dispose]: () => {
      mocked.mockRestore()
    },
  }
}

export class TestDataProvider extends ObjectDataProvider {}
