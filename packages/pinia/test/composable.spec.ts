import { describe, expect } from 'vitest'
import { computed, nextTick } from 'vue'
import { Repository } from '@rattus-orm/core'
import { installRattusORM, useRepository } from '../src'
import { pullRepositoryGettersKeys, pullRepositoryKeys } from '@rattus-orm/core/utils/integrationsHelpers'
import { createPinia } from 'pinia'
import { createBindSpy, TestUser } from '@rattus-orm/core/utils/testUtils'
import { renderHookWithContext, renderWithContext } from '@rattus-orm/core/utils/vueTestUtils'

describe('composable: pinia', () => {
  describe('useRepository returns correctly bound methods', () => {
    using _ = createBindSpy()

    const result = renderHookWithContext({
      hook: () => {
        return useRepository(TestUser)
      },
      plugins: [createPinia(), installRattusORM()],
    })

    it.each(pullRepositoryKeys)('%s has correct context', (methodName) => {
      if (!pullRepositoryGettersKeys.includes(methodName as any)) {
        expect((result[methodName] as any).boundTo).toBeInstanceOf(Repository)
      }
    })
  })

  it('useRepository: methods are not ruined', () => {
    const { insert, fresh, destroy, find, save, all, flush } = renderHookWithContext({
      hook: () => useRepository(TestUser),
      plugins: [createPinia(), installRattusORM()],
    })
    expect(() => insert({ id: '2', age: 22 })).not.toThrowError()
    expect(() => fresh([{ id: '1', age: 11 }])).not.toThrowError()
    expect(() => destroy('1')).not.toThrowError()
    expect(() => find('1')).not.toThrowError()
    expect(() => save({ id: '2', age: 22 })).not.toThrowError()
    expect(() => all()).not.toThrowError()
    expect(() => flush()).not.toThrowError()
  })

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
