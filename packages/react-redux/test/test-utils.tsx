import { RattusProvider, useRattusContext } from '../src'
import React, { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { RattusOrmInstallerOptions } from '@rattus-orm/utils/sharedTypes'
import { createStore } from 'redux'

export const TestComponent = () => {
  try {
    useRattusContext()
  } catch (e) {
    return <div data-testid={'test-block'}>Error</div>
  }

  return <div data-testid={'test-block'}>TestComp</div>
}
export const renderWithResultAndContext = (
  ui: ReactElement = <TestComponent />,
  cb: CallableFunction,
  contextProps: RattusOrmInstallerOptions = {},
) => {
  let result: any
  const store = createStore((data) => data)

  const Component = () => {
    result = cb()

    return <>{ui}</>
  }

  const renderResult = render(
    <RattusProvider store={store} {...contextProps}>
      <Component />
    </RattusProvider>,
  )
  return { result, renderResult }
}
