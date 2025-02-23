// @ts-nocheck
import { createDatabase } from '@rattus-orm/core'
import { describe, expect, it } from 'vitest'
import { RattusProvider, SolidjsDataProvider, useRattusContext } from '../src'
import { TestComponent } from './test-utils'
import '@testing-library/jest-dom/vitest'
import { testContext } from '@rattus-orm/core/utils/testUtils'
import { cleanup, render, renderHook } from '@solidjs/testing-library'

describe('solid: context', () => {
  it('Context valid', () => {
    const { result } = renderHook(useRattusContext, { wrapper: RattusProvider })

    testContext(result, SolidjsDataProvider)
  })

  it('Context params respect custom databases', () => {
    const database = createDatabase({
      dataProvider: new SolidjsDataProvider(),
      connection: 'custom',
    })
    database.start()

    const { result } = renderHook(useRattusContext, {
      wrapper: (props) => (
        <RattusProvider
          database={database}
          {...props}
        />
      ),
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
