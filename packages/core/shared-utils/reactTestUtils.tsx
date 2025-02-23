// eslint-disable-next-line
// @ts-nocheck

import '@testing-library/jest-dom/vitest'

import type { RenderResult } from '@testing-library/react'
import { act, cleanup, render, renderHook } from '@testing-library/react'
import type { JSXElementConstructor } from 'react'
import React from 'react'
import type { Constructor } from 'type-fest'
import { beforeEach, describe } from 'vitest'

import type { DataProvider } from '../src'
import { getDatabaseManager } from '../src'
import { createDatabase } from '../src'
import type { RattusOrmInstallerOptions, UseRepository } from './integrationsHelpers'
import {
  TestUser,
  createBindSpy,
  testBootstrap,
  testCustomConnection,
  testMethodsBound,
  testMethodsNotRuined,
} from './testUtils'

type RattusRenderProps<T> = {
  ContextComp: JSXElementConstructor<any>
  hook: () => T
  bootstrap?: () => Record<string, any>
  contextProps?: RattusOrmInstallerOptions
}
type RattusRenderPropsWithUI<T> = RattusRenderProps<T> & { UiComponent: JSXElementConstructor<any> }

export const REACT_TEST_ID = 'rattus-test'
export const REACT_REACTIVITY_TEST_ID = 'reactivity'

export function renderHookWithContext<T>({
  hook,
  ContextComp,
  bootstrap,
  contextProps,
}: RattusRenderProps<T>): T {
  const { result } = renderHook(hook, {
    wrapper: (props) => {
      return (
        <ContextComp
          {...(bootstrap?.() ?? {})}
          {...(contextProps ?? {})}
        >
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
}: RattusRenderPropsWithUI<T>): { result: T; renderResult: RenderResult } {
  let result: any
  const bootstrapResult = bootstrap ? bootstrap() : {}

  const Component = () => {
    result = hook()

    return <UiComponent />
  }

  const renderResult = render(
    <ContextComp
      {...bootstrapResult}
      {...(contextProps ?? {})}
    >
      <Component />
    </ContextComp>,
  )
  return { result, renderResult }
}

export function createReactivityTestComponent<T extends UseRepository<any>>(
  useRepoCb: (model: any) => T,
) {
  return () => {
    const { find } = useRepoCb(TestUser)
    const user = find('1')

    return <div data-testid={REACT_REACTIVITY_TEST_ID}>{user?.age}</div>
  }
}

type ReactIntegrationTestParams = {
  name: string
  Provider: JSXElementConstructor<any>
  useRepositoryHook: (model: any) => UseRepository<any>
  useRattusContextHook: () => unknown
  ProviderConstructor: Constructor<DataProvider>
  providerArgsGetter?: () => any[]
  bootstrap?: () => Record<string, any>
  componentsWrapper?: (cmp: JSXElementConstructor<any>) => JSXElementConstructor<any>
}
export function createReactIntegrationTest({
  name,
  Provider,
  bootstrap,
  useRattusContextHook,
  useRepositoryHook,
  ProviderConstructor,
  providerArgsGetter,
  componentsWrapper,
}: ReactIntegrationTestParams) {
  describe(`${name} react integration test`, () => {
    function renderHook<T>(hook: () => T, props?: RattusOrmInstallerOptions): T {
      return renderHookWithContext({
        hook,
        ContextComp: Provider,
        contextProps: props,
        bootstrap,
      })
    }

    describe(`${name}: context`, () => {
      beforeEach(() => getDatabaseManager().clear())

      it(`${name}: context valid`, () => {
        renderHook(useRattusContextHook)
        testBootstrap(ProviderConstructor)
      })

      it(`${name}: context params respect custom databases`, () => {
        const database = createDatabase({
          dataProvider: new ProviderConstructor(...(providerArgsGetter?.() ?? [])),
          connection: 'custom',
        })

        renderHook(useRattusContextHook, { database })
        testBootstrap(ProviderConstructor, 'custom')
      })
    })

    describe(`${name}: hooks`, () => {
      const ReactivityTestComponent = componentsWrapper
        ? componentsWrapper(createReactivityTestComponent(useRepositoryHook))
        : createReactivityTestComponent(useRepositoryHook)

      function renderHookWithComp<T>(
        Comp: JSXElementConstructor<any>,
        hook: () => T,
        props?: RattusOrmInstallerOptions,
      ) {
        return renderComponentWithContextAndHook({
          UiComponent: Comp,
          hook,
          ContextComp: Provider,
          bootstrap,
          contextProps: props,
        })
      }

      createBindSpy()

      const renderResult = renderHookWithComp(ReactivityTestComponent, () => {
        return useRepositoryHook(TestUser)
      }).result

      testMethodsBound(name, () => renderResult)
      testMethodsNotRuined(name, renderResult, act)
      testCustomConnection(name)

      it(`${name}: useRepository returns reactive data`, async () => {
        const {
          result: { save },
          renderResult,
        } = renderHookWithComp(ReactivityTestComponent, () => useRepositoryHook(TestUser))
        const elem = renderResult.getByTestId(REACT_REACTIVITY_TEST_ID)
        expect(elem).toHaveTextContent('')

        act(() => save({ id: '1', age: 32 }))
        expect(elem).toHaveTextContent('32')

        act(() => save({ id: '1', age: 23 }))
        expect(elem).toHaveTextContent('23')
      })
    })
  })
}
