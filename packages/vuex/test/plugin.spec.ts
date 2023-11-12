import { App, createApp } from 'vue'
import { createStore } from 'vuex'
import { installRattusORM } from '../src'
import { beforeEach } from 'vitest'

describe('unit/VuexORM', () => {
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

    expect(store.state).toEqual(expected)
    expect(store.$database.isStarted()).toBe(true)
  })

  it('can customize the namespace', () => {
    const store = createStore({
      plugins: [installRattusORM({ namespace: 'database' })],
    })

    const expected = {
      database: {},
    }

    expect(store.state).toEqual(expected)
  })
})
