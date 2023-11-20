import { beforeEach, describe, expect, vi } from 'vitest'
import { Component, ComponentOptions, computed, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { Model, Num, Repository, Uid } from '@rattus-orm/core'
import { createStore, Store } from 'vuex'
import { installRattusORM, useRepository, useRepositoryComputed } from '../src'

class User extends Model {
  public static entity = 'user'

  @Uid()
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

describe('composable', () => {
  let store: Store<any>

  beforeEach(() => {
    store = createStore({
      plugins: [installRattusORM()],
    })

    store.$database.getRepository(User).insert([{ id: '1', age: 23 }])
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

    it.each(Object.keys(result))('%s has correct context', (methodName) => {
      expect(result[methodName].boundTo).toBeInstanceOf(Repository)
    })

    mocked.mockRestore()
  })

  it('useRepositoryComputed: returns reactive data', async () => {
    const repo = store.$database.getRepository(User)
    const wrapper = mountSetup(() => {
      const { find, query } = useRepositoryComputed(User)
      const user = find('1')

      const b = query().findIn(['1'])
      console.log(b)

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
