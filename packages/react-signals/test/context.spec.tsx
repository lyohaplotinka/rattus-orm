import React from 'react'
import { describe, expect, it } from 'vitest'
import { RattusProvider, useRattusContext } from '../src'
import { render } from '@testing-library/react'
import { isInitializedContext } from '../src/utils'
import { Database } from '@rattus-orm/core'
import { isUnknownRecord } from '@rattus-orm/utils/isUnknownRecord'
import { renderWithResultAndContext, TestComponent } from './test-utils'

describe('react-signals: context', () => {
  it('Context valid', () => {
    const { result: res } = renderWithResultAndContext(<TestComponent />, () => {
      return useRattusContext()
    })

    expect(isInitializedContext(res)).toEqual(true)
    expect(res.$database).toBeInstanceOf(Database)
    expect(isUnknownRecord(res.$databases)).toEqual(true)
    expect(res.$databases.entities).toBeInstanceOf(Database)
  })

  it('Does not throw an error when wrapped and throws when not', () => {
    expect(() =>
      render(
        <RattusProvider>
          <TestComponent />
        </RattusProvider>,
      ),
    ).not.toThrowError()

    expect(() => render(<TestComponent />)).toThrowError()
  })
})
