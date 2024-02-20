import React from 'react'
import { describe, expect, it } from 'vitest'
import { RattusProvider, ReactMobxDataProvider, useRattusContext } from '../src'
import { cleanup, render } from '@testing-library/react'
import { Database, RattusOrmInstallerOptions } from '@rattus-orm/core'
import { isUnknownRecord } from '@rattus-orm/core/utils/isUnknownRecord'
import { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import '@testing-library/jest-dom/vitest'
import { isInitializedContext } from '@rattus-orm/core/utils/integrationsHelpers'
import { createTestComponent, REACT_TEST_ID, renderHookWithContext } from '@rattus-orm/core/utils/reactTestUtils'

function renderHookMobx<T>(hook: () => T, props?: RattusOrmInstallerOptions): T {
  return renderHookWithContext({
    hook,
    ContextComp: RattusProvider,
    contextProps: props,
  })
}

const ReduxTestComponent = createTestComponent(useRattusContext)

describe('react-mobx: context', () => {
  it('Context valid', () => {
    const res = renderHookMobx(useRattusContext)

    expect(isInitializedContext(res)).toEqual(true)
    expect(res.$database).toBeInstanceOf(Database)
    expect(isUnknownRecord(res.$databases)).toEqual(true)
    expect(res.$databases.entities).toBeInstanceOf(Database)
  })

  it('Context params respect custom databases', () => {
    const database = new Database().setDataProvider(new ReactMobxDataProvider()).setConnection('custom')
    database.start()

    const result = renderHookMobx(useRattusContext, { database })
    expect(result).toBeInstanceOf(RattusContext)
    expect(result.$database.isStarted()).toEqual(true)
    expect(result.$database.getConnection()).toEqual('custom')
  })

  it('Does not throw an error when wrapped and throws when not', () => {
    expect(
      render(
        <RattusProvider>
          <ReduxTestComponent />
        </RattusProvider>,
      ).getByTestId(REACT_TEST_ID),
    ).toHaveTextContent('Success')

    cleanup()

    expect(render(<ReduxTestComponent />).getByTestId(REACT_TEST_ID)).toHaveTextContent('Error')
  })
})
