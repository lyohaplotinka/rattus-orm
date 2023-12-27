import { describe, expect } from 'vitest'
import { ReducerStore } from '../src/redux/reducer-store'
import { rattusReduxActions } from '../src/redux/types'

describe.sequential('reducer-store', () => {
  const testStore = new ReducerStore({} as any, ['a', 'b'])
  const reducer = testStore.getReducer()
  let state: any = {}

  it('saves correctly', () => {
    state = reducer(state as any, {
      type: testStore.getModuleAction(rattusReduxActions.SAVE),
      payload: { '1': { id: '1', name: 'test' } },
    })
    state = reducer(state as any, {
      type: testStore.getModuleAction(rattusReduxActions.SAVE),
      payload: { '3': { id: '3', name: 'test3' } },
    })
    expect(state.data).toStrictEqual({
      '1': { id: '1', name: 'test' },
      '3': { id: '3', name: 'test3' },
    })
  })

  it('updates correctly', () => {
    state = reducer(state as any, {
      type: testStore.getModuleAction(rattusReduxActions.SAVE),
      payload: { '1': { id: '1', name: 'test11' } },
    })
    expect(state.data).toStrictEqual({
      '1': { id: '1', name: 'test11' },
      '3': { id: '3', name: 'test3' },
    })
  })

  it('deletes correctly', () => {
    state = reducer(state as any, {
      type: testStore.getModuleAction(rattusReduxActions.DESTROY),
      payload: ['3'],
    })
    expect(state.data).toStrictEqual({
      '1': { id: '1', name: 'test11' },
    })
  })

  it('resets correctly', () => {
    state = reducer(state as any, {
      type: testStore.getModuleAction(rattusReduxActions.FRESH),
      payload: { '7': { id: '7' } },
    })

    expect(state).toStrictEqual({ data: { '7': { id: '7' } } })
  })

  it('flushes correctly', () => {
    state = reducer(state as any, {
      type: testStore.getModuleAction(rattusReduxActions.FLUSH),
      payload: null,
    })
    expect(state).toStrictEqual({ data: {} })
  })
})
