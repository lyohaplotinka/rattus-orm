import { describe, expect, it } from 'vitest'
import { RattusProvider, SolidjsDataProvider, useRattusContext } from '../src'
import { Database } from '@rattus-orm/core'
import { TestComponent } from './test-utils'
import '@testing-library/jest-dom/vitest'
import { render, renderHook, cleanup } from '@solidjs/testing-library'
import { testContext } from '@rattus-orm/core/utils/testUtils'

describe('solid: context', () => {
  it('Context valid', () => {
    const { result } = renderHook(useRattusContext, { wrapper: RattusProvider })

    testContext(result, SolidjsDataProvider)
  })

  it('Context params respect custom databases', () => {
    const database = new Database().setDataProvider(new SolidjsDataProvider()).setConnection('custom')
    database.start()

    const { result } = renderHook(useRattusContext, {
      wrapper: (props) => <RattusProvider database={database} {...props} />,
    })
    testContext(result, SolidjsDataProvider, 'custom')
  })

  it('Does not throw an error when wrapped and throws when not', () => {
    expect(
      render(() => (
        <RattusProvider>
          <TestComponent />
        </RattusProvider>
      )).getByTestId('test-block'),
    ).toHaveTextContent('TestComp')

    cleanup()

    expect(render(() => <TestComponent />).getByTestId('test-block')).toHaveTextContent('Error')
  })
})
