import React from 'react'
import { describe, expect } from 'vitest'
import { Attr, Model, Num, Repository } from '@rattus-orm/core'
import { renderWithResultAndContext, TestComponent } from './test-utils'
import { useRepository } from '../src'
import { pullRepositoryKeys } from '../src/hooks/types'
import '@testing-library/jest-dom/vitest'
import { act } from '@testing-library/react'

class User extends Model {
  static entity = 'users'

  @Attr()
  public id: string

  @Num(0)
  public age: number
}

const ReactivityTestComponent = () => {
  const { find } = useRepository(User)
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
      return useRepository(User)
    })

    it.each(pullRepositoryKeys)('%s has correct context', (methodName) => {
      expect((result[methodName] as any).boundTo).toBeInstanceOf(Repository)
    })

    mocked.mockRestore()
  })

  it('useRepository: methods are not ruined', () => {
    const { insert, fresh, destroy, find, save, all, flush, query }: Repository = renderWithResultAndContext(
      <TestComponent />,
      () => useRepository(User),
    ).result
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
    } = renderWithResultAndContext(<ReactivityTestComponent />, () => useRepository(User))
    const elem = renderResult.getByTestId('reactivity')
    expect(elem).toHaveTextContent('')

    act(() => save({ id: '1', age: 32 }))
    expect(elem).toHaveTextContent('32')

    act(() => save({ id: '1', age: 23 }))
    expect(elem).toHaveTextContent('23')
  })
})
