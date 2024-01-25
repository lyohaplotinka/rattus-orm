import { describe, expect, it } from 'vitest'
import { LocalStorageStore, RATTUS_LS_PREFIX } from '../src/data-provider/local-storage-store'
import { range } from 'lodash-es'
import type { Elements } from '@core-shared-utils/sharedTypes'

const testStorePrefix = `${RATTUS_LS_PREFIX}-t/a`

const chunkName = (number: number) => `${testStorePrefix}-chunk${number}`
const chunksNumberName = `${testStorePrefix}-chunks_number`
const getDataForChunk = (number: number) => localStorage.getItem(chunkName(number))
const clearStorage = () => localStorage.clear()
const largeAmount = 110_000

describe('local-storage-store', () => {
  it('initializes correctly', async () => {
    new LocalStorageStore(['t', 'a'])
    expect(getDataForChunk(0)).toEqual('{"data":{}}')
    expect(localStorage.getItem(chunksNumberName)).toEqual('1')
  })

  it('saves correctly', () => {
    const store = new LocalStorageStore(['t', 'a'])
    store.save({ '1': { id: '1', name: '2' } })
    expect(getDataForChunk(0)).toEqual('{"data":{"1":{"id":"1","name":"2"}}}')
    expect(store.getData()).toStrictEqual({
      data: {
        '1': {
          id: '1',
          name: '2',
        },
      },
    })
  })

  it('initializes correctly for already saved data', () => {
    new LocalStorageStore(['t', 'a'])
    expect(getDataForChunk(0)).toEqual('{"data":{"1":{"id":"1","name":"2"}}}')
    clearStorage()
  })

  it('works correctly with large amount of data', () => {
    const data = range(largeAmount).reduce<Elements>((res: Elements, current) => {
      res[String(current)] = {
        id: String(current),
        name: `name${current}`,
      }

      return res
    }, {})

    const store = new LocalStorageStore(['t', 'a'])
    store.save(data)
    expect(localStorage.getItem(chunksNumberName)).toEqual('5')

    const received = store.getData()
    expect(Object.keys(received.data).length).toEqual(largeAmount)
    expect(received.data).toStrictEqual(data)
  })
})
