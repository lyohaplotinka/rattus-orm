import '@testing-library/jest-dom/vitest'

import React from 'react'
import { describe, expect } from 'vitest'
import { Repository } from '@rattus-orm/core'
import { renderWithResultAndContext, TestComponent } from './test-utils'
import { useRepository } from '../src'
import { pullRepositoryKeys } from '@rattus-orm/core/utils/integrationsHelpers'
import { act } from '@testing-library/react'
import { TestUser } from '@rattus-orm/core/utils/testUtils'

const ReactivityTestComponent = () => {
  const { find } = useRepository(TestUser)
  const user = find('1')

  return <div data-testid={'reactivity'}>{user && user.age}</div>
}

describe('react-hooks: useRepository', () => {
  describe('useRepository returns correctly bound methods', () => {
    const mocked = vi.spyOn(Function.prototype, 'bind').mockImplementation(function (
      this: any,
      thisArg: any,
      ...args: any[]
    ) {
      const func = this
      const boundFunction = function (...newArgs: any[]): any {
        return func.apply(thisArg, args.concat(newArgs))
      }
      boundFunction.boundTo = thisArg
      return boundFunction
    })

    const { result } = renderWithResultAndContext(<TestComponent />, () => {
      return useRepository(TestUser)
    })

    it.each(pullRepositoryKeys)('%s has correct context', (methodName) => {
      expect((result[methodName] as any).boundTo).toBeInstanceOf(Repository)
    })

    mocked.mockRestore()
  })

  it('useRepository: methods are not ruined', () => {
    const { insert, fresh, destroy, find, save, all, flush, query }: Repository = renderWithResultAndContext(
      <TestComponent />,
      () => useRepository(TestUser),
    ).result
    expect(() => act(() => insert({ id: '2', age: 22 }))).not.toThrowError()
    expect(() => act(() => fresh([{ id: '1', age: 11 }]))).not.toThrowError()
    expect(() => act(() => destroy('1'))).not.toThrowError()
    expect(() => act(() => find('1'))).not.toThrowError()
    expect(() => act(() => save({ id: '2', age: 22 }))).not.toThrowError()
    expect(() => act(() => all())).not.toThrowError()
    expect(() => act(() => flush())).not.toThrowError()
    expect(() => act(() => query().where('id', '1').first())).not.toThrowError()
  })

  it('useRepository returns reactive data', async () => {
    const {
      result: { save },
      renderResult,
    } = renderWithResultAndContext(<ReactivityTestComponent />, () => useRepository(TestUser))
    const elem = renderResult.getByTestId('reactivity')
    expect(elem).toHaveTextContent('')

    act(() => save({ id: '1', age: 32 }))
    expect(elem).toHaveTextContent('32')

    act(() => save({ id: '1', age: 23 }))
    expect(elem).toHaveTextContent('23')
  })
})
