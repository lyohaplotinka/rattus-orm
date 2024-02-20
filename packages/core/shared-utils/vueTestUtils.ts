import { mount } from '@vue/test-utils'
import type { ComponentOptionsBase } from 'vue'
import { createApp } from 'vue'

import type { RattusContext } from '../src/context/rattus-context'

type RattusRenderProps<T> = {
  hook: () => T
  plugins: any[]
}
type RattusRenderSetupProps<T> = Pick<RattusRenderProps<T>, 'plugins'> & {
  setup: Required<ComponentOptionsBase<any, any, any, any, any, any, any, any>>['setup']
}

export function renderHookWithContext<T>({ hook, plugins }: RattusRenderProps<T>) {
  let result: T

  renderWithContext({
    plugins,
    setup: () => {
      result = hook()
      return {
        age: 0,
      }
    },
  })

  // eslint-disable-next-line
  // @ts-ignore
  return result as T
}

export function renderWithContext<T>({ plugins, setup }: RattusRenderSetupProps<T>) {
  return mount(
    {
      template: `<div>Age: {{ age }}</div>`,
      setup(props: any, context: any) {
        return setup(props, context)
      },
    },
    {
      global: {
        plugins,
      },
    },
  )
}

type GlobalProperties<T extends Record<string, any>> = { $rattusContext: RattusContext } & T
type MockedApp<T extends Record<string, any>> = {
  _context: {
    config: {
      globalProperties: GlobalProperties<T>
    }
  }
  provide: () => void
}
export function createMockApp<T extends Record<string, any>>(globalProperties: T): MockedApp<T> {
  return {
    _context: {
      config: {
        globalProperties: globalProperties as GlobalProperties<T>,
      },
    },
    provide() {},
  }
}

export function createAppWithPlugins(plugins: any[]) {
  const app = createApp({ template: '<div />' })
  plugins.forEach(app.use)
  return app
}
