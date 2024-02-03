import { describe, expect } from 'vitest'
import MobxStore from '../src/mobx/mobx-store'

describe('mobx-store', () => {
  const testStore = new MobxStore()

  it('saves correctly', () => {
    testStore.save({ '1': { id: '1', name: 'test' } })
    testStore.save({ '3': { id: '3', name: 'test3' } })
    expect(testStore.data).toStrictEqual({
      data: {
        '1': { id: '1', name: 'test' },
        '3': { id: '3', name: 'test3' },
      },
    })
  })

  it('updates correctly', () => {
    testStore.save({ '1': { id: '1', name: 'test11' } })
    expect(testStore.data).toStrictEqual({
      data: {
        '1': { id: '1', name: 'test11' },
        '3': { id: '3', name: 'test3' },
      },
    })
  })

  it('deletes correctly', () => {
    testStore.destroy(['3'])
    expect(testStore.data).toStrictEqual({
      data: {
        '1': { id: '1', name: 'test11' },
      },
    })
  })

  it('resets correctly', () => {
    testStore.fresh({ '7': { id: '7' } })
    expect(testStore.data).toStrictEqual({ data: { '7': { id: '7' } } })
  })

  it('flushes correctly', () => {
    testStore.flush()
    expect(testStore.data).toStrictEqual({ data: {} })
  })
})
