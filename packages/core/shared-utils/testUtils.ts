import { uniq } from 'lodash-es'
import { afterAll, expect, vi } from 'vitest'

import type { Constructor, DataProvider, RawModel } from '../src'
import { Database, getDatabaseManager, Model, Repository } from '../src'
import { NumberField, StringField } from '../src/attributes/field-types'
import { ObjectDataProvider } from '../src/object-data-provider'
import type { UseRepository } from './integrationsHelpers'
import { pullRepositoryKeys } from './integrationsHelpers'

export class TestUser extends Model {
  public static entity = 'testUser'

  @StringField('')
  declare public id: string

  @NumberField(0)
  declare public age: number
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

  afterAll(() => {
    mocked?.mockRestore()
  })
}

export class TestDataProvider extends ObjectDataProvider {}

export function testBootstrap(provider: Constructor<DataProvider>, connection = 'entities') {
  expect(getDatabaseManager().getDatabase()).toBeInstanceOf(Database)
  expect(getDatabaseManager().getDatabase(connection)).toBeInstanceOf(Database)
  expect(getDatabaseManager().getDatabase().getConnection()).toEqual(connection)
  expect(getDatabaseManager().getDatabase().getDataProvider()).toBeInstanceOf(provider)
}

export function testMethodsBound<T extends UseRepository<any>>(
  name: string,
  useRepo: () => T,
  keysInstanceof: (keyof T)[] = [],
  checker: (v: any) => boolean = () => true,
) {
  describe(`${name}: useRepository returns correctly bound methods`, () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    it.each(uniq([...pullRepositoryKeys, ...keysInstanceof]))('%s has correct context', (methodName) => {
      const useRepoResult = useRepo()
      if (keysInstanceof.includes(methodName)) {
        expect(checker(useRepoResult[methodName](() => {}))).toBe(true)
      } else {
        expect((useRepoResult[methodName] as any).boundTo).toBeInstanceOf(Repository)
      }
    })
  })
}

export function testMethodsNotRuined(name: string, useRepo: UseRepository<any>, _act?: (f: any) => any) {
  const act =
    _act ??
    ((func: CallableFunction) => {
      return func()
    })

  it(`${name}: useRepository methods are not ruined`, () => {
    const { insert, fresh, destroy, find, save, all, flush } = useRepo
    expect(() => act(() => insert)).not.toThrowError()
    expect(() => act(() => fresh([{ id: '1', age: 11 }]))).not.toThrowError()
    expect(() => act(() => destroy('1'))).not.toThrowError()
    expect(() => act(() => find('1'))).not.toThrowError()
    expect(() => act(() => save({ id: '2', age: 22 }))).not.toThrowError()
    expect(() => act(() => all())).not.toThrowError()
    expect(() => act(() => flush())).not.toThrowError()
  })
}

export function testCustomConnection(name: string) {
  it(`${name}: custom connection works`, () => {
    getDatabaseManager()
      .getRepository(TestUser)
      .save({ id: '333', age: 20 } satisfies RawModel<TestUser>)
    const dataProvider = getDatabaseManager().getDatabase().getDataProvider()

    getDatabaseManager().createDatabase('custom30').setDataProvider(dataProvider).start()
    getDatabaseManager()
      .getRepository(TestUser, 'custom30')
      .save({ id: '333', age: 30 } satisfies RawModel<TestUser>)

    expect(getDatabaseManager().getRepository(TestUser).find('333')?.age).toEqual(20)
    expect(getDatabaseManager().getRepository(TestUser, 'custom30').find('333')?.age).toEqual(30)
  })
}
