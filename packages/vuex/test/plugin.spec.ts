import { createDatabase, getDatabaseManager } from '@rattus-orm/core'
import { TestUser } from '@rattus-orm/core/utils/testUtils'
import { createAppWithPlugins } from '@rattus-orm/core/utils/vueTestUtils'
import { beforeEach, expect, vi } from 'vitest'
import { createStore } from 'vuex'
import { VuexDataProvider, installRattusORM } from '../src'

describe('plugin: vuex', () => {
  beforeEach(() => {
    getDatabaseManager().clear()
  })

  it('plugin works correctly with default parameters', () => {
    createAppWithPlugins([
      createStore({
        plugins: [installRattusORM()],
      }),
    ])

    expect(getDatabaseManager().getDatabase().isStarted()).toEqual(true)
    expect(getDatabaseManager().getDatabase().getConnection()).toEqual('entities')
  })

  it('plugin params respect custom databases', () => {
    const store = createStore({})
    const database = createDatabase({
      connection: 'custom',
      dataProvider: new VuexDataProvider(store as any),
    })
    installRattusORM({ database })(store)
    createAppWithPlugins([store])

    expect(getDatabaseManager().getDatabase().isStarted()).toEqual(false)
    expect(getDatabaseManager().getDatabase().getConnection()).toEqual('custom')
  })

  it('installs Vuex ORM to the store', () => {
    const app = createAppWithPlugins([
      createStore({
        plugins: [installRattusORM()],
      }),
    ])

    const store = app._context.config.globalProperties.$store
    const spyRepo = vi.spyOn(getDatabaseManager().getDatabase(), 'getRepository')

    expect(store.state).toEqual({ entities: {} })
    expect(getDatabaseManager().getDatabase().isStarted()).toBe(true)
    expect(getDatabaseManager().getRepository(TestUser).database.getConnection()).toEqual(
      'entities',
    )
    expect(getDatabaseManager().getRepository(TestUser).getModel()).toBeInstanceOf(TestUser)
    expect(spyRepo).toHaveBeenCalledOnce()
  })

  it('can customize the namespace', () => {
    const store = createStore({
      plugins: [installRattusORM({ connection: 'database' })],
    })
    expect(store.state).toEqual({ database: {} })
  })
})
