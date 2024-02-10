import { describe, expect } from 'vitest'
import { SolidStore } from '../src/solidjs/solid-store'

describe('solid-store', () => {
  const testStore = new SolidStore()

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
