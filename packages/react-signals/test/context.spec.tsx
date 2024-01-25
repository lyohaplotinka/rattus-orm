import React from 'react'
import { describe, expect, it } from 'vitest'
import { RattusProvider, ReactSignalsDataProvider, useRattusContext } from '../src'
import { cleanup, render } from '@testing-library/react'
import { isInitializedContext } from '../src/utils'
import { Database } from '@rattus-orm/core'
import { isUnknownRecord } from '@rattus-orm/core/utils/isUnknownRecord'
import { renderWithResultAndContext, TestComponent } from './test-utils'
import { RattusContext } from '@rattus-orm/core/rattus-context'
import '@testing-library/jest-dom/vitest'

describe('react-signals: context', () => {
  it('Context valid', () => {
    const { result: res } = renderWithResultAndContext(undefined, () => {
      return useRattusContext()
    })

    expect(isInitializedContext(res)).toEqual(true)
    expect(res.$database).toBeInstanceOf(Database)
    expect(isUnknownRecord(res.$databases)).toEqual(true)
    expect(res.$databases.entities).toBeInstanceOf(Database)
  })

  it('Context params respect custom databases', () => {
    const database = new Database().setDataProvider(new ReactSignalsDataProvider()).setConnection('custom')
    database.start()

    const { result } = renderWithResultAndContext(undefined, () => useRattusContext(), { database })
    expect(result).toBeInstanceOf(RattusContext)
    expect(result.$database.isStarted()).toEqual(true)
    expect(result.$database.getConnection()).toEqual('custom')
  })

  it('Does not throw an error when wrapped and throws when not', () => {
    expect(
      render(
        <RattusProvider>
          <TestComponent />
        </RattusProvider>,
      ).getByTestId('test-block'),
    ).toHaveTextContent('TestComp')

    cleanup()

    expect(render(<TestComponent />).getByTestId('test-block')).toHaveTextContent('Error')
  })
})
