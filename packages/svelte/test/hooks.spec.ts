import { describe, expect, it } from 'vitest'
import { renderFunction, renderWithContext } from './test-utils'
import { useRepository } from '../dist/rattus-orm-svelte-provider'
import { pullRepositoryGettersKeys } from '@rattus-orm/core/utils/integrationsHelpers'
import { act } from '@testing-library/svelte'
import ReactivityTest from './components/ReactivityTest.svelte'
import {
  testCustomConnection,
  testMethodsBound,
  testMethodsNotRuined,
  TestUser,
  createBindSpy,
} from '@rattus-orm/core/utils/testUtils'

describe('svelte: hooks', () => {
  createBindSpy()

  testMethodsBound(
    'Svelte',
    () => renderFunction(() => useRepository(TestUser)),
    [...pullRepositoryGettersKeys, 'withQuery'],
    (v: any) => typeof v.subscribe === 'function',
  )

  testMethodsNotRuined(
    'Svelte',
    renderFunction(() => useRepository(TestUser)),
  )

  testCustomConnection('Svelte')

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
