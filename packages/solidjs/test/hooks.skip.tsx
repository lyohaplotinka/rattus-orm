// @ts-nocheck
/** @jsxImportSource solid-js */
/** @jsxRuntime automatic */
import '@testing-library/jest-dom/vitest'

import { pullRepositoryGettersKeys } from '@rattus-orm/core/utils/integrationsHelpers'
import {
  TestUser,
  testCustomConnection,
  testMethodsBound,
  testMethodsNotRuined,
} from '@rattus-orm/core/utils/testUtils'
import { renderHook } from '@solidjs/testing-library'
import { describe, expect } from 'vitest'
import { RattusProvider, useRattusContext, useRepository } from '../src'
import { renderWithResultAndContext } from './test-utils'

const ReactivityTestComponent = () => {
  const { find } = useRepository(TestUser)
  const user = find('1')

  return <div data-testid={'reactivity'}>{user()?.age ?? ''}</div>
}

describe('react-mobx hooks: useRepository', () => {
  testMethodsBound(
    'Solid',
    () =>
      renderHook(() => useRepository(TestUser), {
        wrapper: RattusProvider,
      }).result,
    [...pullRepositoryGettersKeys, 'withQuery'],
    (v: any) => v.__rattus__accessor === true,
  )

  testMethodsNotRuined(
    'Solid',
    renderHook(() => useRepository(TestUser), {
      wrapper: RattusProvider,
    }).result,
  )

  testCustomConnection('Solid', renderHook(useRattusContext, { wrapper: RattusProvider }).result)

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
})
