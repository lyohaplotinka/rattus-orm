import { beforeEach, describe, expect, it } from 'vitest'

import type { DataProvider, Elements, SerializedStorage } from './sharedTypes'

type CreateBasicProviderTestParams<StoreType> = {
  name: string
  storeFactory: () => { store: StoreType; provider: DataProvider }
  connectionRequired: boolean
}

const insertableData = (id: string): Elements => ({
  [id]: { id, name: 'Alex' },
})

const expectedData = (id: string): SerializedStorage => ({
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

export const createBasicProviderTest = <StoreType>(params: CreateBasicProviderTestParams<StoreType>) => {
  const { name, storeFactory, connectionRequired } = params

  describe(`Running basic provider tests for "${name}"`, () => {
    let dataProvider: DataProvider

    const createEntity = () => {
      dataProvider.registerConnection('entities')
      dataProvider.registerModule(['entities', 'user'])
    }

    const getDump = () => dataProvider.dump()

    beforeEach(() => {
      const { provider } = storeFactory()
      dataProvider = provider
    })

    if (connectionRequired) {
      it('registers connection', () => {
        dataProvider.registerConnection('entities')
        expect(dataProvider.dump()).toStrictEqual({ entities: {} })
      })

      it('fails if trying create nested module without root module', () => {
        expect(() => {
          dataProvider.registerModule(['entities', 'user'])
        }).toThrowError()
      })
    }

    it('dump works correctly', () => {
      createEntity()
      dataProvider.insert(['entities', 'user'], { '1': { id: '1', age: 23 } })

      expect(dataProvider.dump()).toStrictEqual({
        entities: {
          user: {
            data: {
              '1': { id: '1', age: 23 },
            },
          },
        },
      })
    })

    it('registers module', () => {
      createEntity()

      expect(getDump()).toStrictEqual({
        entities: {
          user: {
            data: {},
          },
        },
      })
    })

    it('hasModule works correctly', () => {
      expect(dataProvider.hasModule(['entities', 'user'])).toEqual(false)
      createEntity()
      expect(dataProvider.hasModule(['entities', 'user'])).toEqual(true)
    })

    it.each([
      ['insert', insertableData('1'), expectedData('1')] as const,
      ['save', insertableData('2'), expectedData('2')] as const,
      ['update', insertableData('3'), expectedData('3')] as const,
    ])(
      'method "%s" works correctly',
      (method: 'insert' | 'save' | 'update', data: Elements, expceted: SerializedStorage) => {
        createEntity()
        dataProvider[method](['entities', 'user'], data)
        expect(getDump()).toStrictEqual(expceted)
      },
    )

    it('gets module state', () => {
      createEntity()
      dataProvider.insert(['entities', 'user'], insertableData('1'))
      expect(dataProvider.getModuleState(['entities', 'user'])).toStrictEqual({
        data: { '1': { id: '1', name: 'Alex' } },
      })
    })

    it('delete works correctly', () => {
      createEntity()
      dataProvider.insert(['entities', 'user'], insertableData('1'))
      dataProvider.insert(['entities', 'user'], insertableData('3'))

      dataProvider.delete(['entities', 'user'], ['1'])
      expect(getDump()).toStrictEqual(expectedData('3'))
    })

    it('flush', () => {
      createEntity()
      dataProvider.insert(['entities', 'user'], insertableData('1'))
      dataProvider.insert(['entities', 'user'], insertableData('2'))

      dataProvider.flush(['entities', 'user'])
      expect(getDump()).toStrictEqual({ entities: { user: { data: {} } } })
    })

    it('replace', () => {
      createEntity()
      dataProvider.insert(['entities', 'user'], insertableData('1'))
      dataProvider.insert(['entities', 'user'], insertableData('2'))

      dataProvider.replace(['entities', 'user'], {
        '5': { id: '5', name: 'Alex5' },
        '7': { id: '7', name: 'Alex7' },
      })

      expect(getDump()).toStrictEqual({
        entities: { user: { data: { '5': { id: '5', name: 'Alex5' }, '7': { id: '7', name: 'Alex7' } } } },
      })
    })

    it('restore works correctly', () => {
      dataProvider.restore({
        entities: {
          user: {
            data: {
              '1': { id: '1', age: 23 },
            },
          },
        },
      })

      expect(dataProvider.hasModule(['entities', 'user'])).toEqual(true)
      expect(dataProvider.getModuleState(['entities', 'user'])).toStrictEqual({
        data: {
          '1': { id: '1', age: 23 },
        },
      })
    })
  })
}
