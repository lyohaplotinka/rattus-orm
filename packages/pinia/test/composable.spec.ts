import { describe, expect, vi } from 'vitest'
import { Component, ComponentOptions, computed, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { Repository } from '@rattus-orm/core'
import { installRattusORM, useRattusContext, useRepository } from '../src'
import { pullRepositoryGettersKeys, pullRepositoryKeys } from '@rattus-orm/core/utils/integrationsHelpers'
import { createPinia } from 'pinia'
import { TestUser } from '@rattus-orm/core/utils/testUtils'

const componentTemplate: Component = {
  template: `<div>Age: {{ age }}</div>`,
}

const attachSetup = (setup: ComponentOptions['setup']): Component => ({
  ...componentTemplate,
  setup(props, context) {
    useRattusContext()
      .$repo(TestUser)
      .insert([{ id: '1', age: 23 }])

    return setup!(props, context)
  },
})

describe('composable: pinia', () => {
  const pinia = createPinia()

  const mountSetup = (setup: ComponentOptions['setup']) => {
    const component = attachSetup(setup)
    return mount(component, { global: { plugins: [pinia, installRattusORM()] } })
  }

  const withSetup = <T extends () => any>(hook: T) => {
    let result: ReturnType<T>

    mount(
      {
        template: '<div />',
        setup() {
          useRattusContext()
            .$repo(TestUser)
            .insert([{ id: '1', age: 23 }])
          result = hook()
        },
      },
      {
        global: {
          plugins: [pinia, installRattusORM()],
        },
      },
    )

    // @ts-ignore
    return result as ReturnType<T>
  }

  describe('useRepository returns correctly bound methods', () => {
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
      return useRepository(TestUser)
    })

    it.each(pullRepositoryKeys)('%s has correct context', (methodName) => {
      if (!pullRepositoryGettersKeys.includes(methodName as any)) {
        expect((result[methodName] as any).boundTo).toBeInstanceOf(Repository)
      }
    })

    mocked.mockRestore()
  })

  it('useRepository: methods are not ruined', () => {
    const { insert, fresh, destroy, find, save, all, flush } = withSetup(() => useRepository(TestUser))
    expect(() => insert({ id: '2', age: 22 })).not.toThrowError()
    expect(() => fresh([{ id: '1', age: 11 }])).not.toThrowError()
    expect(() => destroy('1')).not.toThrowError()
    expect(() => find('1')).not.toThrowError()
    expect(() => save({ id: '2', age: 22 })).not.toThrowError()
    expect(() => all()).not.toThrowError()
    expect(() => flush()).not.toThrowError()
  })

  it('useRepository: returns reactive data', async () => {
    const wrapper = mountSetup(() => {
      const { find } = useRepository(TestUser)
      const user = find('1')

      return {
        age: computed(() => user.value?.age),
      }
    })
    const rattusContext = wrapper.getCurrentComponent().appContext.config.globalProperties.$rattusContext
    const repo = rattusContext.$repo(TestUser)

    expect(wrapper.text()).toStrictEqual('Age: 23')
    repo.query().update({ id: '1', age: 25 })
    await nextTick()
    expect(wrapper.text()).toStrictEqual('Age: 25')
  })
})
