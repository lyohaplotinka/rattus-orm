import { beforeEach, describe, expect } from 'vitest'
import { Component, ComponentOptions, computed, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { Model, Num, Uid } from '@rattus-orm/core'
import { createStore, Store } from 'vuex'
import { getRepository, installRattusORM } from '../src'

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

  it('works', () => {
    const wrapper = mountSetup(() => {
      const repo = getRepository(User)
      return repo.find('1')
    })
    expect(wrapper.text()).toStrictEqual('Age: 23')
  })

  it('data is reactive', async () => {
    const repo = store.$database.getRepository(User)
    const wrapper = mountSetup(() => {
      const user = computed(() => repo.find('1'))

      return {
        age: computed(() => (user.value as any).age),
      }
    })
    expect(wrapper.text()).toStrictEqual('Age: 23')

    repo.query().update({ id: '1', age: 25 })
    await nextTick()
    expect(wrapper.text()).toStrictEqual('Age: 25')
  })
})
