import { describe, expect } from 'vitest'
import { Attr, Model, Num } from '@rattus-orm/core'
import { installRattusORM, useRattusContext } from '../src'
import { mount } from '@vue/test-utils'
import { useRepository } from '../src'
import { isComputed } from './utils'
import { createPinia } from 'pinia'

class User extends Model {
  static entity = 'users'

  @Attr()
  public id: string

  @Num(0)
  public age: number
}

describe('composable-query', () => {
  const pinia = createPinia()

  const withSetup = <T extends () => any>(hook: T) => {
    let result: ReturnType<T>

    mount(
      {
        template: '<div />',
        setup() {
          useRattusContext()
            .$repo(User)
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

  it('withQuery returns computed property', () => {
    const repo = withSetup(() => useRepository(User))
    const result = repo.withQuery((query) => query.where('age', (v: number) => v > 25))
    expect(isComputed(result)).toEqual(true)
  })
})
