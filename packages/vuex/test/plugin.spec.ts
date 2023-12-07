import { App, createApp } from 'vue'
import { createStore } from 'vuex'
import { installRattusORM } from '../src'
import { beforeEach, expect, vi } from 'vitest'
import { Model, Num, Uid } from '@rattus-orm/core'

class User extends Model {
  public static entity = 'user'

  @Uid()
  public id: string

  @Num(0)
  public age: number
}

describe('plugin: vuex', () => {
  let app: App

  beforeEach(() => {
    app = createApp({ template: '<div />' })
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
    expect(store.$rattusContext.$repo(User).database.getConnection()).toEqual('entities')
    expect(store.$rattusContext.$repo(User).getModel()).toBeInstanceOf(User)
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
