import { describe, expect } from 'vitest'
import { installRattusORM, useRattusContext } from '../src'
import { mount } from '@vue/test-utils'
import { useRepository } from '../src'
import { isComputed } from '@rattus-orm/core/utils/vueComposableUtils'
import { createPinia } from 'pinia'
import { TestUser } from '@rattus-orm/core/utils/testUtils'

describe('composable-query', () => {
  const pinia = createPinia()

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

  it('withQuery returns computed property', () => {
    const repo = withSetup(() => useRepository(TestUser))
    const result = repo.withQuery((query) => query.where('age', (v: number) => v > 25))
    expect(isComputed(result)).toEqual(true)
  })
})
