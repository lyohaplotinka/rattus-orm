import '../src/types/pinia'
import { App, createApp, nextTick } from 'vue'
import { beforeEach, expect, vi } from 'vitest'
import { Database, Model, Num, Uid } from '@rattus-orm/core'
import { createPinia } from 'pinia'
import { rattusOrmPiniaVuePlugin } from '../src'

class User extends Model {
  public static entity = 'user'

  @Uid()
  public id: string

  @Num(0)
  public age: number
}

describe('plugin: pinia', () => {
  let app: App

  const initPinia = () => {
    const pinia = createPinia()
    return pinia
  }

  beforeEach(() => {
    app = createApp({ template: '<div />' })
  })

  it('installs Vuex ORM to the store', () => {
    const pinia = initPinia()
    app.use(pinia).use(rattusOrmPiniaVuePlugin())

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
    app.use(pinia).use(rattusOrmPiniaVuePlugin('database'))
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
