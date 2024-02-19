import { beforeEach, describe, expect } from 'vitest'
import { createStore, Store } from 'vuex'
import { installRattusORM } from '../src'
import { mount } from '@vue/test-utils'
import { useRepository } from '../src'
import { isComputed } from '@rattus-orm/core/utils/vueComposableUtils'
import { TestUser } from '@rattus-orm/core/utils/testUtils'

describe('composable-query', () => {
  let store: Store<any>

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

  beforeEach(() => {
    store = createStore({
      plugins: [installRattusORM()],
    })

    store.$rattusContext.$database.getRepository(TestUser).insert([
      { id: '1', age: 22 },
      { id: '2', age: 33 },
      { id: '3', age: 44 },
    ])
  })

  it('withQuery returns computed property', () => {
    const repo = withSetup(() => useRepository(TestUser))
    const result = repo.withQuery((query) => query.where('age', (v: number) => v > 25))
    expect(isComputed(result)).toEqual(true)
  })
})
