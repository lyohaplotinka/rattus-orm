import { RattusProvider, useRattusContext } from '../src'
import React, { ReactElement } from 'react'
import { render } from '@testing-library/react'

export const TestComponent = () => {
  useRattusContext()

  return <div>TestComp</div>
}
export const renderWithResultAndContext = (ui: ReactElement, cb: CallableFunction) => {
  let result: any

  const Component = () => {
    result = cb()

    return <>{ui}</>
  }

  const renderResult = render(
    <RattusProvider>
      <Component />
    </RattusProvider>,
  )
  return { result, renderResult }
}
