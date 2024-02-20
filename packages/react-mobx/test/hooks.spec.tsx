import '@testing-library/jest-dom/vitest'

import { JSXElementConstructor } from 'react'
import { describe, expect } from 'vitest'
import { RattusOrmInstallerOptions, Repository } from '@rattus-orm/core'
import { useRepository, RattusProvider } from '../src'
import { pullRepositoryKeys } from '@rattus-orm/core/utils/integrationsHelpers'
import { act } from '@testing-library/react'
import { observer } from 'mobx-react-lite'
import { createBindSpy, TestUser } from '@rattus-orm/core/utils/testUtils'
import {
  createReactivityTestComponent,
  REACT_REACTIVITY_TEST_ID,
  renderComponentWithContextAndHook,
} from '@rattus-orm/core/utils/reactTestUtils'

const ReactivityTestComponent = observer(createReactivityTestComponent(useRepository))

function renderHookWithCompMobx<T>(Comp: JSXElementConstructor<any>, hook: () => T, props?: RattusOrmInstallerOptions) {
  return renderComponentWithContextAndHook({
    UiComponent: Comp,
    hook,
    ContextComp: RattusProvider,
    contextProps: props,
  })
}

describe('react-mobx hooks: useRepository', () => {
  describe('useRepository returns correctly bound methods', () => {
    using _ = createBindSpy()

    const { result } = renderHookWithCompMobx(ReactivityTestComponent, () => useRepository(TestUser))

    it.each(pullRepositoryKeys)('%s has correct context', (methodName) => {
      expect((result[methodName] as any).boundTo).toBeInstanceOf(Repository)
    })
  })

  it('useRepository: methods are not ruined', () => {
    const { insert, fresh, destroy, find, save, all, flush, query } = renderHookWithCompMobx(
      ReactivityTestComponent,
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
    } = renderHookWithCompMobx(ReactivityTestComponent, () => useRepository(TestUser))
    const elem = renderResult.getByTestId(REACT_REACTIVITY_TEST_ID)
    expect(elem).toHaveTextContent('')

    act(() => save({ id: '1', age: 32 }))
    expect(elem).toHaveTextContent('32')

    act(() => save({ id: '1', age: 23 }))
    expect(elem).toHaveTextContent('23')
  })
})
