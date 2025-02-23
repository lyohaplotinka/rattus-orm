import { getDatabaseManager } from '@rattus-orm/core'
import {
  TestUser,
  createBindSpy,
  testBootstrap,
  testCustomConnection,
  testMethodsBound,
  testMethodsNotRuined,
} from '@rattus-orm/core/utils/testUtils'
import { isComputed } from '@rattus-orm/core/utils/vueComposableUtils'
import { renderHookWithContext, renderWithContext } from '@rattus-orm/core/utils/vueTestUtils'
import { describe, expect } from 'vitest'
import { computed, nextTick } from 'vue'
import { createStore } from 'vuex'
import { VuexDataProvider, installRattusORM, useRepository } from '../src'

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
  it('vuex: context valid', () => {
    renderVuexHook(() => true)
    testBootstrap(VuexDataProvider)
  })

  createBindSpy()

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
