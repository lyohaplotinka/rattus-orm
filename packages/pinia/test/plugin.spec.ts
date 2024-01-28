import '../src/types/pinia'
import { App, createApp, nextTick } from 'vue'
import { beforeEach, expect, vi } from 'vitest'
import { Database, Model, Num, Uid } from '@rattus-orm/core'
import { createPinia } from 'pinia'
import { installRattusORM, PiniaDataProvider } from '../src'
import { RattusContext } from '@rattus-orm/core/utils/rattus-context'

class User extends Model {
  public static entity = 'user'

  @Uid()
  public id: string

  @Num(0)
  public age: number
}

const createMockApp = () => ({
  _context: {
    config: {
      globalProperties: {
        $pinia: createPinia(),
        $rattusContext: null as unknown as RattusContext,
      },
    },
  },
  provide() {},
})

describe('plugin: pinia', () => {
  let app: App

  const initPinia = () => {
    const pinia = createPinia()
    return pinia
  }

  beforeEach(() => {
    app = createApp({ template: '<div />' })
  })

  it('context works correctly with default parameters', () => {
    const mockApp = createMockApp()
    installRattusORM().install!(mockApp as any)
    const context = mockApp._context.config.globalProperties.$rattusContext

    expect(context).toBeInstanceOf(RattusContext)
    expect(context.$database.isStarted()).toEqual(true)
    expect(context.$database.getConnection()).toEqual('entities')
    expect(Object.keys(context.$databases)).toEqual(['entities'])
  })

  it('plugin params respect custom databases', () => {
    const mockApp = createMockApp()
    const database = new Database().setConnection('custom').setDataProvider(new PiniaDataProvider(createPinia()))
    installRattusORM({ database }).install!(mockApp as any)

    const context = mockApp._context.config.globalProperties.$rattusContext

    expect(context).toBeInstanceOf(RattusContext)
    expect(context.$database.isStarted()).toEqual(false)
    expect(context.$database.getConnection()).toEqual('custom')
  })

  it('installs Vuex ORM to the store', () => {
    const pinia = initPinia()
    app.use(pinia).use(installRattusORM())

    const expected = {}

    const globalProps = app._context.config.globalProperties
    const db = globalProps.$rattusContext.$database

    expect(db).toBeInstanceOf(Database)

    const spyRepo = vi.spyOn(db, 'getRepository')

    expect(pinia.state.value).toEqual(expected)
    expect(db.isStarted()).toBe(true)
    expect(globalProps.$rattusContext.$repo(User).database.getConnection()).toEqual('entities')
    expect(globalProps.$rattusContext.$repo(User).getModel()).toBeInstanceOf(User)
    expect(spyRepo).toHaveBeenCalledOnce()
  })

  it('can customize the namespace', async () => {
    const pinia = createPinia()
    app.use(pinia).use(installRattusORM({ connection: 'database' }))
    const globalProps = app._context.config.globalProperties

    await nextTick()

    const expected = {
      ['database/user']: {
        data: {
          '1': { id: '1', age: 27 },
        },
      },
    }

    await nextTick()
    globalProps.$rattusContext.$repo(User).save([{ id: '1', age: 27 }])

    expect(pinia.state.value).toEqual(expected)
  })
})
