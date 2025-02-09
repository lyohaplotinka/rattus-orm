import { createStore } from 'vuex'
import { installRattusORM, VuexDataProvider } from '../src'
import { expect, vi } from 'vitest'
import { createDatabase } from '@rattus-orm/core'
import { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import { TestUser } from '@rattus-orm/core/utils/testUtils'
import { createAppWithPlugins } from '@rattus-orm/core/utils/vueTestUtils'

describe('plugin: vuex', () => {
  it('context works correctly with default parameters', () => {
    const app = createAppWithPlugins([
      createStore({
        plugins: [installRattusORM()],
      }),
    ])
    const { $rattusContext } = app._context.config.globalProperties.$store

    expect($rattusContext).toBeInstanceOf(RattusContext)
    expect($rattusContext.getDatabase().isStarted()).toEqual(true)
    expect($rattusContext.getDatabase().getConnection()).toEqual('entities')
  })

  it('plugin params respect custom databases', () => {
    const store = createStore({})
    const database = createDatabase({ connection: 'custom', dataProvider: new VuexDataProvider(store as any) })
    installRattusORM({ database })(store)
    const app = createAppWithPlugins([store])
    const { $rattusContext } = app._context.config.globalProperties.$store

    expect($rattusContext).toBeInstanceOf(RattusContext)
    expect($rattusContext.getDatabase().isStarted()).toEqual(false)
    expect($rattusContext.getDatabase().getConnection()).toEqual('custom')
  })

  it('installs Vuex ORM to the store', () => {
    const app = createAppWithPlugins([
      createStore({
        plugins: [installRattusORM()],
      }),
    ])

    const store = app._context.config.globalProperties.$store
    const spyRepo = vi.spyOn(store.$rattusContext.getDatabase(), 'getRepository')

    expect(store.state).toEqual({ entities: {} })
    expect(store.$rattusContext.getDatabase().isStarted()).toBe(true)
    expect(store.$rattusContext.$repo(TestUser).database.getConnection()).toEqual('entities')
    expect(store.$rattusContext.$repo(TestUser).getModel()).toBeInstanceOf(TestUser)
    expect(spyRepo).toHaveBeenCalledOnce()
  })

  it('can customize the namespace', () => {
    const store = createStore({
      plugins: [installRattusORM({ connection: 'database' })],
    })
    expect(store.state).toEqual({ database: {} })
  })
})
