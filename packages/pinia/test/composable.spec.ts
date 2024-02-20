import { describe, expect } from 'vitest'
import { computed, nextTick } from 'vue'
import { installRattusORM, useRepository, useRattusContext, PiniaDataProvider } from '../src'
import { createPinia } from 'pinia'
import { testContext, testMethodsBound, testMethodsNotRuined, TestUser } from '@rattus-orm/core/utils/testUtils'
import { renderHookWithContext, renderWithContext } from '@rattus-orm/core/utils/vueTestUtils'
import { isComputed } from '@rattus-orm/core/utils/vueComposableUtils'

const renderPiniaHook = <T>(hook: () => T): T => {
  return renderHookWithContext({
    hook,
    plugins: [createPinia(), installRattusORM()],
  })
}

describe('composable: pinia', () => {
  it('has correct context', () => {
    testContext(renderPiniaHook(useRattusContext), PiniaDataProvider)
  })

  testMethodsBound(
    'pinia',
    () => renderPiniaHook(() => useRepository(TestUser)),
    ['all', 'find', 'withQuery'],
    (v: any) => isComputed(v),
  )

  testMethodsNotRuined(
    'pinia',
    renderPiniaHook(() => useRepository(TestUser)),
  )

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
      plugins: [createPinia(), installRattusORM()],
    })

    const rattusContext = wrapper.getCurrentComponent().appContext.config.globalProperties.$rattusContext
    const repo = rattusContext.$repo(TestUser)

    expect(wrapper.text()).toStrictEqual('Age: 23')
    repo.query().update({ id: '1', age: 25 })
    await nextTick()
    expect(wrapper.text()).toStrictEqual('Age: 25')
  })
})
