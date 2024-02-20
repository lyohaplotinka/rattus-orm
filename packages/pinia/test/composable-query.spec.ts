import { describe, expect } from 'vitest'
import { installRattusORM } from '../src'
import { useRepository } from '../src'
import { isComputed } from '@rattus-orm/core/utils/vueComposableUtils'
import { createPinia } from 'pinia'
import { TestUser } from '@rattus-orm/core/utils/testUtils'
import { renderHookWithContext } from '@rattus-orm/core/utils/vueTestUtils'

describe('composable-query', () => {
  const pinia = createPinia()

  it('withQuery returns computed property', () => {
    const repo = renderHookWithContext({
      hook: () => useRepository(TestUser),
      plugins: [pinia, installRattusORM()],
    })
    const result = repo.withQuery((query) => query.where('age', (v: number) => v > 25))
    expect(isComputed(result)).toEqual(true)
  })
})
