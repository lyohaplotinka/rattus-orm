import { describe, expect, it } from 'vitest'
import { RattusProvider, SolidjsDataProvider, useRattusContext } from '../src'
import { Database } from '@rattus-orm/core'
import { isUnknownRecord } from '@rattus-orm/core/utils/isUnknownRecord'
import { TestComponent } from './test-utils'
import { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import '@testing-library/jest-dom/vitest'
import { render, renderHook, cleanup } from '@solidjs/testing-library'
import { isInitializedContext } from '@rattus-orm/core/utils/integrationsHelpers'

describe('solid: context', () => {
  it('Context valid', () => {
    const { result } = renderHook(useRattusContext, { wrapper: RattusProvider })

    expect(isInitializedContext(result)).toEqual(true)
    expect(result.$database).toBeInstanceOf(Database)
    expect(isUnknownRecord(result.$databases)).toEqual(true)
    expect(result.$databases.entities).toBeInstanceOf(Database)
  })

  it('Context params respect custom databases', () => {
    const database = new Database().setDataProvider(new SolidjsDataProvider()).setConnection('custom')
    database.start()

    const { result } = renderHook(useRattusContext, {
      wrapper: (props) => <RattusProvider database={database}>{props.children}</RattusProvider>,
    })
    expect(result).toBeInstanceOf(RattusContext)
    expect(result.$database.isStarted()).toEqual(true)
    expect(result.$database.getConnection()).toEqual('custom')
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
