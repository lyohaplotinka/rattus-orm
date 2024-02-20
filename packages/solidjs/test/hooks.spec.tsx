/** @jsxImportSource solid-js */
/** @jsxRuntime automatic */
import '@testing-library/jest-dom/vitest'

import { describe, expect } from 'vitest'
import { Repository } from '@rattus-orm/core'
import { useRepository, RattusProvider } from '../src'
import { renderHook } from '@solidjs/testing-library'
import { renderWithResultAndContext } from './test-utils'
import { pullRepositoryGettersKeys, pullRepositoryKeys } from '@rattus-orm/core/utils/integrationsHelpers'
import { createBindSpy, TestUser } from '@rattus-orm/core/utils/testUtils'

const ReactivityTestComponent = () => {
  const { find } = useRepository(TestUser)
  const user = find('1')

  return <div data-testid={'reactivity'}>{user()?.age ?? ''}</div>
}

describe('react-mobx hooks: useRepository', () => {
  describe('useRepository returns correctly bound methods', () => {
    using _ = createBindSpy()
    const { result } = renderHook(() => useRepository(TestUser), {
      wrapper: RattusProvider,
    })

    it.each(pullRepositoryKeys)('%s has correct context', (methodName) => {
      if (!pullRepositoryGettersKeys.includes(methodName as any)) {
        expect((result[methodName] as any).boundTo).toBeInstanceOf(Repository)
      }
    })
  })

  it('useRepository: methods are not ruined', () => {
    const { insert, fresh, destroy, find, save, all, flush, query } = renderHook(() => useRepository(TestUser), {
      wrapper: RattusProvider,
    }).result
    expect(() => insert({ id: '2', age: 22 })).not.toThrowError()
    expect(() => fresh([{ id: '1', age: 11 }])).not.toThrowError()
    expect(() => destroy('1')).not.toThrowError()
    expect(() => find('1')).not.toThrowError()
    expect(() => save({ id: '2', age: 22 })).not.toThrowError()
    expect(() => all()).not.toThrowError()
    expect(() => flush()).not.toThrowError()
    expect(() => query().where('id', '1').first()).not.toThrowError()
  })

  it('useRepository returns reactive data', async () => {
    const {
      result: { save },
      renderResult,
    } = renderWithResultAndContext(ReactivityTestComponent, () => useRepository(TestUser))
    const elem = renderResult.getByTestId('reactivity')
    expect(elem).toHaveTextContent('')

    save({ id: '1', age: 32 })
    expect(elem).toHaveTextContent('32')

    save({ id: '1', age: 23 })
    expect(elem).toHaveTextContent('23')
  })

  it('withQuery returns computed property', () => {
    const { withQuery } = renderHook(() => useRepository(TestUser), {
      wrapper: RattusProvider,
    }).result

    expect(typeof withQuery((query) => query.all())).toEqual('function')
    expect(withQuery((query) => query.all())()).toEqual([])
  })
})
