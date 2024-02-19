import { App, createApp } from 'vue'
import { createStore } from 'vuex'
import { installRattusORM, VuexDataProvider } from '../src'
import { beforeEach, expect, vi } from 'vitest'
import { Database } from '@rattus-orm/core'
import { RattusContext } from '@rattus-orm/core/utils/rattus-context'
import { TestUser } from '@rattus-orm/core/utils/testUtils'

const createMockStore = (): Record<string, any> & { $rattusContext: RattusContext } => ({
  registerModule() {},
  $rattusContext: {} as RattusContext,
})

describe('plugin: vuex', () => {
  let app: App

  beforeEach(() => {
    app = createApp({ template: '<div />' })
  })

  it('context works correctly with default parameters', () => {
    const mockStore = createMockStore()
    installRattusORM()(mockStore as any)

    expect(mockStore.$rattusContext).toBeInstanceOf(RattusContext)
    expect(mockStore.$rattusContext.$database.isStarted()).toEqual(true)
    expect(mockStore.$rattusContext.$database.getConnection()).toEqual('entities')
    expect(Object.keys(mockStore.$rattusContext.$databases)).toEqual(['entities'])
  })

  it('plugin params respect custom databases', () => {
    const mockStore = createMockStore()
    const database = new Database().setConnection('custom').setDataProvider(new VuexDataProvider(mockStore as any))
    installRattusORM({ database })(mockStore as any)

    expect(mockStore.$rattusContext).toBeInstanceOf(RattusContext)
    expect(mockStore.$rattusContext.$database.isStarted()).toEqual(false)
    expect(mockStore.$rattusContext.$database.getConnection()).toEqual('custom')
  })

  it('installs Vuex ORM to the store', () => {
    const store = createStore({
      plugins: [installRattusORM()],
    })
    app.use(store)

    const expected = {
      entities: {},
    }

    const spyRepo = vi.spyOn(store.$rattusContext.$database, 'getRepository')

    expect(store.state).toEqual(expected)
    expect(store.$rattusContext.$database.isStarted()).toBe(true)
    expect(store.$rattusContext.$repo(TestUser).database.getConnection()).toEqual('entities')
    expect(store.$rattusContext.$repo(TestUser).getModel()).toBeInstanceOf(TestUser)
    expect(spyRepo).toHaveBeenCalledOnce()
  })

  it('can customize the namespace', () => {
    const store = createStore({
      plugins: [installRattusORM({ connection: 'database' })],
    })

    const expected = {
      database: {},
    }

    expect(store.state).toEqual(expected)
  })
})
