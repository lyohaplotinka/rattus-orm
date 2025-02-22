// @ts-nocheck
/** @jsxImportSource solid-js */
/** @jsxRuntime automatic */

import { RattusOrmInstallerOptions } from '@rattus-orm/core'
import { render } from '@solidjs/testing-library'
import { JSXElement } from 'solid-js'
import { RattusProvider, useRattusContext } from '../src'

export const TestComponent = () => {
  try {
    useRattusContext()
  } catch (e) {
    return <div data-testid={'test-block'}>Error</div>
  }

  return <div data-testid={'test-block'}>TestComp</div>
}

export function renderWithResultAndContext<T>(
  UiComponent: () => JSXElement,
  cb: () => T,
  contextProps: RattusOrmInstallerOptions = {},
): { result: T; renderResult: ReturnType<typeof render> } {
  let result: any

  const Component = () => {
    result = cb()

    return <UiComponent />
  }

  const renderResult = render(() => (
    <RattusProvider {...contextProps}>
      <Component />
    </RattusProvider>
  ))
  return { result, renderResult }
}
