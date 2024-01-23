import { beforeEach, describe, expect } from 'vitest'
import { Attr, Model, Num } from '@rattus-orm/core'
import { isRef } from 'vue'
import { createStore, Store } from 'vuex'
import { installRattusORM } from '../src'
import { mount } from '@vue/test-utils'
import { useRepository } from '../src'

class User extends Model {
  static entity = 'users'

  @Attr()
  public id: string

  @Num(0)
  public age: number
}

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

    store.$rattusContext.$database.getRepository(User).insert([
      { id: '1', age: 22 },
      { id: '2', age: 33 },
      { id: '3', age: 44 },
    ])
  })

  it('withQuery returns computed property', () => {
    const repo = withSetup(() => useRepository(User))
    const result = repo.withQuery((query) => query.where('age', (v: number) => v > 25))
    expect(isRef(result) && !!result.effect).toEqual(true)
  })
})
