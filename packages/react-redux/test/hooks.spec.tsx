import '@testing-library/jest-dom/vitest'

import { JSXElementConstructor } from 'react'
import { describe, expect } from 'vitest'
import { RattusOrmInstallerOptions, Repository } from '@rattus-orm/core'
import { useRepository, RattusProvider } from '../src'
import { pullRepositoryKeys } from '@rattus-orm/core/utils/integrationsHelpers'
import { act } from '@testing-library/react'
import { createBindSpy, TestUser } from '@rattus-orm/core/utils/testUtils'
import { createReactivityTestComponent, renderComponentWithContextAndHook } from '@rattus-orm/core/utils/reactTestUtils'
import { createStore } from 'redux'

const ReactivityTestComponent = createReactivityTestComponent(useRepository)

function renderHookWithCompRedux<T>(
  Comp: JSXElementConstructor<any>,
  hook: () => T,
  props?: RattusOrmInstallerOptions,
) {
  return renderComponentWithContextAndHook({
    UiComponent: Comp,
    hook,
    ContextComp: RattusProvider,
    bootstrap: () => ({ store: createStore((state) => state) }),
    contextProps: props,
  })
}

describe('react-hooks: useRepository', () => {
  describe('useRepository returns correctly bound methods', () => {
    using _ = createBindSpy()

    const { result } = renderHookWithCompRedux(ReactivityTestComponent, () => {
      return useRepository(TestUser)
    })

    it.each(pullRepositoryKeys)('%s has correct context', (methodName) => {
      expect((result[methodName] as any).boundTo).toBeInstanceOf(Repository)
    })
  })

  it('useRepository: methods are not ruined', () => {
    const { result } = renderHookWithCompRedux(ReactivityTestComponent, () => useRepository(TestUser))
    const { insert, fresh, destroy, find, save, all, flush, query } = result

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
    } = renderHookWithCompRedux(ReactivityTestComponent, () => useRepository(TestUser))
    const elem = renderResult.getByTestId('reactivity')
    expect(elem).toHaveTextContent('')

    act(() => save({ id: '1', age: 32 }))
    expect(elem).toHaveTextContent('32')

    act(() => save({ id: '1', age: 23 }))
    expect(elem).toHaveTextContent('23')
  })
})
