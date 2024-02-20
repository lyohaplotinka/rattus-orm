import '@testing-library/jest-dom/vitest'

import type { RenderResult } from '@testing-library/react'
import { act, cleanup, render, renderHook } from '@testing-library/react'
import type { JSXElementConstructor } from 'react'
import React from 'react'
import type { Constructor } from 'type-fest'
import { describe } from 'vitest'

import type { DataProvider, RattusOrmInstallerOptions } from '../src'
import { Repository } from '../src'
import { Database } from '../src'
import { RattusContext } from '../src/context/rattus-context'
import type { UseRepository } from './integrationsHelpers'
import { pullRepositoryKeys } from './integrationsHelpers'
import { isInitializedContext } from './integrationsHelpers'
import { isUnknownRecord } from './isUnknownRecord'
import { createBindSpy, TestUser } from './testUtils'

type RattusRenderProps<T> = {
  ContextComp: JSXElementConstructor<any>
  hook: () => T
  bootstrap?: () => Record<string, any>
  contextProps?: RattusOrmInstallerOptions
}
type RattusRenderPropsWithUI<T> = RattusRenderProps<T> & { UiComponent: JSXElementConstructor<any> }

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
}: RattusRenderPropsWithUI<T>): { result: T; renderResult: RenderResult } {
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

type ReactIntegrationTestParams = {
  name: string
  Provider: JSXElementConstructor<any>
  useRepositoryHook: (model: any) => UseRepository<any>
  useRattusContextHook: () => RattusContext
  ProviderConstructor: Constructor<DataProvider>
  providerArgsGetter?: () => any[]
  bootstrap?: () => Record<string, any>
}
export function createReactIntegrationTest({
  name,
  Provider,
  bootstrap,
  useRattusContextHook,
  useRepositoryHook,
  ProviderConstructor,
  providerArgsGetter,
}: ReactIntegrationTestParams) {
  describe(`${name} react integration test`, () => {
    describe(`${name}: context`, () => {
      function renderHook<T>(hook: () => T, props?: RattusOrmInstallerOptions): T {
        return renderHookWithContext({
          hook,
          ContextComp: Provider,
          contextProps: props,
          bootstrap,
        })
      }

      const TestComponent = createTestComponent(useRattusContextHook)

      it(`${name}: context valid`, () => {
        const res = renderHook(useRattusContextHook)

        expect(isInitializedContext(res)).toEqual(true)
        expect(res.$database).toBeInstanceOf(Database)
        expect(isUnknownRecord(res.$databases)).toEqual(true)
        expect(res.$databases.entities).toBeInstanceOf(Database)
      })

      it(`${name}: context params respect custom databases`, () => {
        const database = new Database()
          .setDataProvider(new ProviderConstructor(...(providerArgsGetter?.() ?? [])))
          .setConnection('custom')
        database.start()

        const result = renderHook(useRattusContextHook, { database })
        expect(result).toBeInstanceOf(RattusContext)
        expect(result.$database.isStarted()).toEqual(true)
        expect(result.$database.getConnection()).toEqual('custom')
      })

      it(`${name}: does not throw an error when wrapped and throws when not`, () => {
        expect(
          render(
            <Provider {...(bootstrap?.() ?? {})} {...(providerArgsGetter?.() ?? [])}>
              <TestComponent />
            </Provider>,
          ).getByTestId(REACT_TEST_ID),
        ).toHaveTextContent('Success')

        cleanup()

        expect(render(<TestComponent />).getByTestId(REACT_TEST_ID)).toHaveTextContent('Error')
      })
    })

    describe(`${name}: hooks`, () => {
      const ReactivityTestComponent = createReactivityTestComponent(useRepositoryHook)

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

      describe(`${name}: useRepository returns correctly bound methods`, () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        using _ = createBindSpy()

        const { result } = renderHookWithComp(ReactivityTestComponent, () => {
          return useRepositoryHook(TestUser)
        })

        it.each(pullRepositoryKeys)('%s has correct context', (methodName) => {
          expect((result[methodName] as any).boundTo).toBeInstanceOf(Repository)
        })
      })

      it(`${name}: useRepository: methods are not ruined`, () => {
        const { result } = renderHookWithComp(ReactivityTestComponent, () => useRepositoryHook(TestUser))
        const { insert, fresh, destroy, find, save, all, flush, query } = result

        expect(() => act(() => insert({ id: '2', age: 22 }))).not.toThrowError()
        expect(() => act(() => fresh([{ id: '1', age: 11 }]))).not.toThrowError()
        expect(() => act(() => destroy('1'))).not.toThrowError()
        expect(() => act(() => find('1'))).not.toThrowError()
        expect(() => act(() => save({ id: '2', age: 22 }))).not.toThrowError()
        expect(() => act(() => all())).not.toThrowError()
        expect(() => act(() => flush())).not.toThrowError()
        expect(() => act(() => query().where('id', '1').first())).not.toThrowError()
      })

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
