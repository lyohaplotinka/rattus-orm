import { describe, expect } from 'vitest'
import { computed, nextTick } from 'vue'
import { createStore } from 'vuex'
import { installRattusORM, useRepository } from '../src'
import { renderHookWithContext, renderWithContext } from '@rattus-orm/core/utils/vueTestUtils'
import { isComputed } from '@rattus-orm/core/utils/vueComposableUtils'
import {
  testMethodsBound,
  testMethodsNotRuined,
  TestUser,
  testCustomConnection,
} from '@rattus-orm/core/utils/testUtils'
import { getDatabaseManager } from '@rattus-orm/core'

const renderVuexHook = <T>(hook: () => T): T => {
  return renderHookWithContext({
    hook,
    plugins: [
      createStore({
        plugins: [installRattusORM()],
      }),
    ],
  })
}

describe('composable: vuex', () => {
  testMethodsBound(
    'vuex',
    () => renderVuexHook(() => useRepository(TestUser)),
    ['all', 'find', 'withQuery'],
    (v: any) => isComputed(v),
  )

  testMethodsNotRuined(
    'vuex',
    renderVuexHook(() => useRepository(TestUser)),
  )

  testCustomConnection('vuex')

  it('useRepository: returns reactive data', async () => {
    const wrapper = renderWithContext({
      setup() {
        const { find, insert } = useRepository(TestUser)
        insert([{ id: '1', age: 23 }])
        const user = find('1')

        return {
          age: computed(() => user.value?.age),
        }
      },
      plugins: [
        createStore({
          plugins: [installRattusORM()],
        }),
      ],
    })

    const repo = getDatabaseManager().getRepository(TestUser)

    expect(wrapper.text()).toStrictEqual('Age: 23')
    repo.query().update({ id: '1', age: 25 })
    await nextTick()
    expect(wrapper.text()).toStrictEqual('Age: 25')
  })
})
