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
import { createPinia } from 'pinia'
import { describe, expect } from 'vitest'
import { computed, nextTick } from 'vue'
import { PiniaDataProvider, installRattusORM, useRepository } from '../src'

const renderPiniaHook = <T>(hook: () => T): T => {
  return renderHookWithContext({
    hook,
    plugins: [createPinia(), installRattusORM()],
  })
}

describe('composable: pinia', () => {
  it('vuex: context valid', () => {
    renderPiniaHook(() => true)
    testBootstrap(PiniaDataProvider)
  })

  createBindSpy()

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

  testCustomConnection('pinia')

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

    const repo = getDatabaseManager().getRepository(TestUser)

    expect(wrapper.text()).toStrictEqual('Age: 23')
    repo.query().update({ id: '1', age: 25 })
    await nextTick()
    expect(wrapper.text()).toStrictEqual('Age: 25')
  })
})
