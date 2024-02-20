import { describe, expect, it } from 'vitest'
import { renderFunction, renderWithContext } from './test-utils'
import { Database, Repository } from '@rattus-orm/core'
import { useRepository, useRattusContext } from '../dist/rattus-orm-svelte-provider'
import { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import { pullRepositoryGettersKeys, pullRepositoryKeys } from '@rattus-orm/core/utils/integrationsHelpers'
import { act } from '@testing-library/svelte'
import ReactivityTest from './components/ReactivityTest.svelte'
import { createBindSpy, TestUser } from '@rattus-orm/core/utils/testUtils'

describe('svelte: hooks', () => {
  it('has correct context', () => {
    const result = renderFunction(() => useRattusContext())

    expect(result).toBeInstanceOf(RattusContext)
    expect(result.$database).toBeInstanceOf(Database)
  })

  describe('useRepository returns correctly bound methods', () => {
    using _ = createBindSpy()
    const result = renderFunction(() => useRepository(TestUser))

    it.each(pullRepositoryKeys)('%s has correct context', (methodName) => {
      if (!pullRepositoryGettersKeys.includes(methodName as any)) {
        expect((result[methodName] as any).boundTo).toBeInstanceOf(Repository)
      }
    })
  })

  it('useRepository: methods are not ruined', () => {
    const { insert, fresh, destroy, find, save, all, flush } = renderFunction(() => useRepository(TestUser))

    expect(() => insert({ id: '2', age: 22 })).not.toThrowError()
    expect(() => fresh([{ id: '1', age: 11 }])).not.toThrowError()
    expect(() => destroy('1')).not.toThrowError()
    expect(() => find('1')).not.toThrowError()
    expect(() => save({ id: '2', age: 22 })).not.toThrowError()
    expect(() => all()).not.toThrowError()
    expect(() => flush()).not.toThrowError()
  })

  it('useRepository: returns reactive data', async () => {
    const wrapper = renderWithContext(ReactivityTest)
    const div = await wrapper.findByTestId('maindiv')
    expect(div.innerHTML).toEqual('Age: ')

    await act(() => wrapper.component.getChild().doSave({ id: '1', age: 23 }))
    expect(div.innerHTML).toEqual('Age: 23')
    await act(() => wrapper.component.getChild().doSave({ id: '1', age: 25 }))
    expect(div.innerHTML).toEqual('Age: 25')
  })
})
