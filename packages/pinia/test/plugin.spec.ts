import '../src/types/pinia'
import { nextTick } from 'vue'
import { expect, vi } from 'vitest'
import { createDatabase, Database } from '@rattus-orm/core'
import { createPinia } from 'pinia'
import { installRattusORM, PiniaDataProvider } from '../src'
import { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import { TestUser } from '@rattus-orm/core/utils/testUtils'
import { createAppWithPlugins, createMockApp } from '@rattus-orm/core/utils/vueTestUtils'

describe('plugin: pinia', () => {
  it('context works correctly with default parameters', () => {
    const mockApp = createMockApp({ $pinia: createPinia() })
    installRattusORM().install!(mockApp as any)
    const context = mockApp._context.config.globalProperties.$rattusContext

    expect(context).toBeInstanceOf(RattusContext)
    expect(context.$database.isStarted()).toEqual(true)
    expect(context.$database.getConnection()).toEqual('entities')
    expect(Object.keys(context.$databases)).toEqual(['entities'])
  })

  it('plugin params respect custom databases', () => {
    const mockApp = createMockApp({ $pinia: createPinia() })
    const database = createDatabase({ connection: 'custom', dataProvider: new PiniaDataProvider(createPinia()) })
    installRattusORM({ database }).install!(mockApp as any)

    const context = mockApp._context.config.globalProperties.$rattusContext

    expect(context).toBeInstanceOf(RattusContext)
    expect(context.$database.isStarted()).toEqual(false)
    expect(context.$database.getConnection()).toEqual('custom')
  })

  it('installs Vuex ORM to the store', () => {
    const app = createAppWithPlugins([createPinia(), installRattusORM()])
    const expected = {}

    const globalProps = app._context.config.globalProperties
    const db = globalProps.$rattusContext.$database

    expect(db).toBeInstanceOf(Database)

    const spyRepo = vi.spyOn(db, 'getRepository')

    expect(app._context.config.globalProperties.$pinia.state.value).toEqual(expected)
    expect(db.isStarted()).toBe(true)
    expect(globalProps.$rattusContext.$repo(TestUser).database.getConnection()).toEqual('entities')
    expect(globalProps.$rattusContext.$repo(TestUser).getModel()).toBeInstanceOf(TestUser)
    expect(spyRepo).toHaveBeenCalledOnce()
  })

  it('can customize the namespace', async () => {
    const app = createAppWithPlugins([createPinia(), installRattusORM({ connection: 'database' })])
    const globalProps = app._context.config.globalProperties

    await nextTick()

    const expected = {
      ['database/testUser']: {
        data: {
          '1': { id: '1', age: 27 },
        },
      },
    }

    await nextTick()
    globalProps.$rattusContext.$repo(TestUser).save([{ id: '1', age: 27 }])

    expect(app._context.config.globalProperties.$pinia.state.value).toEqual(expected)
  })
})
