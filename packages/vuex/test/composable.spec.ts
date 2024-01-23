import { beforeEach, describe, expect, vi } from 'vitest'
import { Component, ComponentOptions, computed, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { Model, Num, Repository, Attr, Database } from '@rattus-orm/core'
import { createStore, Store } from 'vuex'
import { installRattusORM, useRepository } from '../src'
import { pullRepositoryGettersKeys, pullRepositoryKeys } from '../src/composable/types'
import { useRattusContext } from '../src'
import { RattusContext } from '@rattus-orm/core/rattus-context'

class User extends Model {
  static entity = 'users'

  @Attr()
  public id: string

  @Num(0)
  public age: number
}

const componentTemplate: Component = {
  template: `<div>Age: {{ age }}</div>`,
}

const attachSetup = (setup: ComponentOptions['setup']): Component => ({
  ...componentTemplate,
  setup,
})

describe('composable: vuex', () => {
  let store: Store<any>

  beforeEach(() => {
    store = createStore({
      plugins: [installRattusORM()],
    })

    store.$rattusContext.$database.getRepository(User).insert([{ id: '1', age: 23 }])
  })

  const mountSetup = (setup: ComponentOptions['setup']) => {
    const component = attachSetup(setup)

    return mount(component, { global: { plugins: [store] } })
  }

  const withSetup = <T extends () => any>(hook: T) => {
    let result: ReturnType<T>

    mount(
      {
        template: '<div />',
        setup() {
          result = hook()
        },
      },
      { global: { plugins: [store] } },
    )

    // @ts-ignore
    return result as ReturnType<T>
  }

  it('has correct context', () => {
    const result = withSetup(() => useRattusContext())

    expect(result).toBeInstanceOf(RattusContext)
    expect(result.$database).toBeInstanceOf(Database)
  })

  describe('useRepository returns correctly bound methods', () => {
    store = createStore({
      plugins: [installRattusORM()],
    })

    const mocked = vi.spyOn(Function.prototype, 'bind').mockImplementation(function (
      this: any,
      thisArg: any,
      ...args: any[]
    ) {
      const func = this
      const boundFunction = function (...newArgs: any[]): any {
        return func.apply(thisArg, args.concat(newArgs))
      }
      boundFunction.boundTo = thisArg
      return boundFunction
    })

    const result = withSetup(() => {
      return useRepository(User)
    })

    it.each(pullRepositoryKeys)('%s has correct context', (methodName) => {
      if (!pullRepositoryGettersKeys.includes(methodName as any)) {
        expect((result[methodName] as any).boundTo).toBeInstanceOf(Repository)
      }
    })

    mocked.mockRestore()
  })

  it('useRepository: methods are not ruined', () => {
    const { insert, fresh, destroy, find, save, all, flush } = withSetup(() => useRepository(User))
    expect(() => insert({ id: '2', age: 22 })).not.toThrowError()
    expect(() => fresh([{ id: '1', age: 11 }])).not.toThrowError()
    expect(() => destroy('1')).not.toThrowError()
    expect(() => find('1')).not.toThrowError()
    expect(() => save({ id: '2', age: 22 })).not.toThrowError()
    expect(() => all()).not.toThrowError()
    expect(() => flush()).not.toThrowError()
  })

  it('useRepository: returns reactive data', async () => {
    const repo = store.$rattusContext.$database.getRepository(User)
    const wrapper = mountSetup(() => {
      const { find } = useRepository(User)
      const user = find('1')

      return {
        age: computed(() => user.value?.age),
      }
    })
    expect(wrapper.text()).toStrictEqual('Age: 23')

    repo.query().update({ id: '1', age: 25 })
    await nextTick()
    expect(wrapper.text()).toStrictEqual('Age: 25')
  })
})
