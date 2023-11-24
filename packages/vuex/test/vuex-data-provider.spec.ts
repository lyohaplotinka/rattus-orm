import { beforeEach, describe, expect, it } from 'vitest'
import { createStore } from 'vuex'
import { VuexDataProvider } from '../src'
import { SerializedStorage } from '@rattus-orm/core'

class TestVuexDataProvider extends VuexDataProvider {
  public getVuexStore() {
    return this.store
  }
}

const insertableData = (id: string) => ({
  [id]: { id, name: 'Alex' },
})

const expectedData = (id: string) => ({
  entities: {
    user: {
      data: {
        [id]: {
          id,
          name: 'Alex',
        },
      },
    },
  },
})

describe('vuex-data-provider', () => {
  let dataProvider: TestVuexDataProvider

  const createEntity = () => {
    dataProvider.registerConnection('entities')
    dataProvider.registerModule(['entities', 'user'])
  }

  const getState = () => dataProvider.getVuexStore().state

  beforeEach(() => {
    const store = createStore<SerializedStorage>({})
    dataProvider = new TestVuexDataProvider(store)
  })

  it('creates root module', () => {
    dataProvider.registerConnection('entities')
    expect(getState()).toStrictEqual({ entities: {} })
  })

  it('fails if trying create nested module without root module', () => {
    expect(() => {
      dataProvider.registerModule(['entities', 'user'])
    }).toThrowError()
  })

  it.each([
    ['insert', insertableData('1'), expectedData('1')],
    ['save', insertableData('2'), expectedData('2')],
    ['update', insertableData('3'), expectedData('3')],
  ])('method "%s" works correctly', (method, data, expceted) => {
    createEntity()
    dataProvider[method]('entities/user', data)
    expect(getState()).toStrictEqual(expceted)
  })

  it('gets module state', () => {
    createEntity()
    dataProvider.insert(['entities', 'user'], insertableData('1'))
    expect(dataProvider.getModuleState(['entities', 'user'])).toStrictEqual({
      data: { '1': { id: '1', name: 'Alex' } },
    })
  })

  it.each([['delete']])('%s works correctly', (methodName) => {
    createEntity()
    dataProvider.insert(['entities', 'user'], insertableData('1'))
    dataProvider.insert(['entities', 'user'], insertableData('3'))

    dataProvider[methodName](['entities', 'user'], ['1'])
    expect(getState()).toStrictEqual(expectedData('3'))
  })

  it('flush', () => {
    createEntity()
    dataProvider.insert(['entities', 'user'], insertableData('1'))
    dataProvider.insert(['entities', 'user'], insertableData('2'))

    dataProvider.flush(['entities', 'user'])
    expect(getState()).toStrictEqual({ entities: { user: { data: {} } } })
  })

  it('replace', () => {
    createEntity()
    dataProvider.insert(['entities', 'user'], insertableData('1'))
    dataProvider.insert(['entities', 'user'], insertableData('2'))

    dataProvider.replace(['entities', 'user'], {
      '5': { id: '5', name: 'Alex5' },
      '7': { id: '7', name: 'Alex7' },
    })

    expect(getState()).toStrictEqual({
      entities: { user: { data: { '5': { id: '5', name: 'Alex5' }, '7': { id: '7', name: 'Alex7' } } } },
    })
  })
})
