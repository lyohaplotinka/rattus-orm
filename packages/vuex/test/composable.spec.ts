import { describe, expect } from 'vitest'
import { computed, nextTick } from 'vue'
import { createStore } from 'vuex'
import { installRattusORM, useRepository, VuexDataProvider } from '../src'
import { useRattusContext } from '../src'
import { renderHookWithContext, renderWithContext } from '@rattus-orm/core/utils/vueTestUtils'
import { isComputed } from '@rattus-orm/core/utils/vueComposableUtils'
import {
  testContext,
  testMethodsBound,
  testMethodsNotRuined,
  TestUser,
  testCustomConnection,
} from '@rattus-orm/core/utils/testUtils'

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
  it('has correct context', () => {
    testContext(renderVuexHook(useRattusContext), VuexDataProvider)
  })

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

  testCustomConnection('vuex', renderVuexHook(useRattusContext))

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

    const rattusContext = wrapper.getCurrentComponent().appContext.config.globalProperties.$store.$rattusContext
    const repo = rattusContext.$repo(TestUser)

    expect(wrapper.text()).toStrictEqual('Age: 23')
    repo.query().update({ id: '1', age: 25 })
    await nextTick()
    expect(wrapper.text()).toStrictEqual('Age: 25')
  })
})
