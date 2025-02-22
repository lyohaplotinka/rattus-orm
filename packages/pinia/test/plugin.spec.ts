import '../src/types/pinia'
import { Database, createDatabase, getDatabaseManager } from '@rattus-orm/core'
import { TestUser } from '@rattus-orm/core/utils/testUtils'
import { createAppWithPlugins, createMockApp } from '@rattus-orm/core/utils/vueTestUtils'
import { createPinia } from 'pinia'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { PiniaDataProvider, installRattusORM } from '../src'

describe('plugin: pinia', () => {
  beforeEach(() => {
    getDatabaseManager().clear()
  })

  it('plugin works correctly with default parameters', () => {
    const mockApp = createMockApp({ $pinia: createPinia() })
    installRattusORM().install!(mockApp as any)

    expect(getDatabaseManager().getDatabase().isStarted()).toEqual(true)
    expect(getDatabaseManager().getDatabase().getConnection()).toEqual('entities')
  })

  it('plugin params respect custom databases', () => {
    const mockApp = createMockApp({ $pinia: createPinia() })
    const database = createDatabase({
      connection: 'custom',
      dataProvider: new PiniaDataProvider(createPinia()),
    })
    installRattusORM({ database }).install!(mockApp as any)

    expect(getDatabaseManager().getDatabase().isStarted()).toEqual(false)
    expect(getDatabaseManager().getDatabase().getConnection()).toEqual('custom')
  })

  it('installs Vuex ORM to the store', () => {
    const app = createAppWithPlugins([createPinia(), installRattusORM()])
    const expected = {}

    const db = getDatabaseManager().getDatabase()
    expect(db).toBeInstanceOf(Database)

    const spyRepo = vi.spyOn(db, 'getRepository')

    expect(app._context.config.globalProperties.$pinia.state.value).toEqual(expected)
    expect(db.isStarted()).toBe(true)
    expect(getDatabaseManager().getRepository(TestUser).database.getConnection()).toEqual(
      'entities',
    )
    expect(getDatabaseManager().getRepository(TestUser).getModel()).toBeInstanceOf(TestUser)
    expect(spyRepo).toHaveBeenCalledOnce()
  })

  it('can customize the namespace', async () => {
    const app = createAppWithPlugins([createPinia(), installRattusORM({ connection: 'database' })])

    await nextTick()

    const expected = {
      ['database/testUser']: {
        data: {
          '1': { id: '1', age: 27 },
        },
      },
    }

    await nextTick()
    getDatabaseManager()
      .getRepository(TestUser)
      .save([{ id: '1', age: 27 }])

    expect(app._context.config.globalProperties.$pinia.state.value).toEqual(expected)
  })
})
