import type { Collection, Element, Elements, Model, RootState } from '@/index'
import { TestingStore } from 'test/utils/types'

interface Entities {
  [name: string]: Elements
}

export function createStore(): TestingStore {
  return globalThis.testingStoreFactory()
}

export function createState(entities: Entities): RootState {
  const state = {} as RootState

  for (const entity in entities) {
    state[entity] = { data: {} }

    state[entity].data = entities[entity]
  }

  return state
}

export function fillState(store: TestingStore, entities: Entities): void {
  for (const entity in entities) {
    if (!store.state.entities[entity]) {
      store.state.entities[entity] = { data: {} }
    }

    store.state.entities[entity].data = entities[entity]
  }
}

export function assertState(store: TestingStore, entities: Entities): void {
  expect(store.state.entities).toEqual(createState(entities))
}

export function assertModel<M extends Model>(model: M, record: Element): void {
  expect(model.$toJson()).toEqual(record)
}

export function assertModels<M extends Model>(models: Collection<M>, record: Element[]): void {
  models.forEach((model, index) => {
    expect(model.$toJson()).toEqual(record[index])
  })
}

export function assertInstanceOf(collection: Collection<any>, model: typeof Model): void {
  collection.forEach((item) => {
    expect(item).toBeInstanceOf(model)
  })
}

export function mockUid(ids: any[]): void {
  ids.forEach((id) => (window.crypto.randomUUID as any).mockImplementationOnce(() => id))
}
