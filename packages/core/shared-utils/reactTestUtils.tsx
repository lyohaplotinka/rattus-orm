import type { RenderResult } from '@testing-library/react'
import { render, renderHook } from '@testing-library/react'
import type { JSXElementConstructor } from 'react'
import React from 'react'

import type { RattusOrmInstallerOptions } from '../src'
import type { UseRepository } from './integrationsHelpers'
import { TestUser } from './testUtils'

type RattusRenderProps<T> = {
  ContextComp: JSXElementConstructor<any>
  hook: () => T
  bootstrap?: () => Record<string, any>
  contextProps?: RattusOrmInstallerOptions
}

export const REACT_TEST_ID = 'rattus-test'
export const REACT_REACTIVITY_TEST_ID = 'reactivity'

export function renderHookWithContext<T>({ hook, ContextComp, bootstrap, contextProps }: RattusRenderProps<T>): T {
  const { result } = renderHook(hook, {
    wrapper: (props) => {
      return (
        <ContextComp {...(bootstrap?.() ?? {})} {...(contextProps ?? {})}>
          {props.children}
        </ContextComp>
      )
    },
  })
  return result.current
}

export function createTestComponent(rattusHook: () => unknown) {
  return () => {
    try {
      rattusHook()
    } catch (e) {
      return <div data-testid={REACT_TEST_ID}>Error</div>
    }

    return <div data-testid={REACT_TEST_ID}>Success</div>
  }
}

export function renderComponentWithContextAndHook<T>({
  ContextComp,
  UiComponent,
  hook,
  bootstrap,
  contextProps,
}: RattusRenderProps<T> & { UiComponent: JSXElementConstructor<any> }): { result: T; renderResult: RenderResult } {
  let result: any
  const bootstrapResult = bootstrap ? bootstrap() : {}

  const Component = () => {
    result = hook()

    return <UiComponent />
  }

  const renderResult = render(
    <ContextComp {...bootstrapResult} {...(contextProps ?? {})}>
      <Component />
    </ContextComp>,
  )
  return { result, renderResult }
}

export function createReactivityTestComponent<T extends UseRepository<any>>(useRepoCb: (model: any) => T) {
  return () => {
    const { find } = useRepoCb(TestUser)
    const user = find('1')

    return <div data-testid={REACT_REACTIVITY_TEST_ID}>{user && user.age}</div>
  }
}
