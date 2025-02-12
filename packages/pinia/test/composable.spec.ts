import { describe, expect } from 'vitest'
import { computed, nextTick } from 'vue'
import { installRattusORM, useRepository } from '../src'
import { createPinia } from 'pinia'
import {
  testCustomConnection,
  testMethodsBound,
  testMethodsNotRuined,
  TestUser,
} from '@rattus-orm/core/utils/testUtils'
import { renderHookWithContext, renderWithContext } from '@rattus-orm/core/utils/vueTestUtils'
import { isComputed } from '@rattus-orm/core/utils/vueComposableUtils'
import { getDatabaseManager } from '@rattus-orm/core'

const renderPiniaHook = <T>(hook: () => T): T => {
  return renderHookWithContext({
    hook,
    plugins: [createPinia(), installRattusORM()],
  })
}

describe('composable: pinia', () => {
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
