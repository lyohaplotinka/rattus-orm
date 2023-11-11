import { v1 as uuid } from 'uuid'

import type { Collection, Element, Elements, Model, RootState } from '@/index'
import { Database, Repository } from '@/index'
import { ObjectDataProvider } from '@/data/object-data-provider'

interface Entities {
  [name: string]: Elements
}

class TestStore {
  public $database = new Database().setStore(new ObjectDataProvider()).setConnection('entities')
  public $databases: Record<string, Database> = {
    entities: this.$database,
  }

  constructor() {
    this.$database.start()
  }

  public get state() {
    return {
      entities: this.$database.store.getState('entities'),
    }
  }

  public $repo(modelOrRepository: any, connection?: string): any {
    let database: Database

    if (connection) {
      if (!(connection in this.$databases)) {
        database = new Database().setStore(new ObjectDataProvider()).setConnection(connection)
        database.start()
      } else {
        database = this.$databases[connection]
      }
    } else {
      database = this.$database
    }

    const repository = modelOrRepository._isRepository
      ? new modelOrRepository(database).initialize()
      : new Repository(database).initialize(modelOrRepository)

    try {
      database.register(repository.getModel())
    } catch (e) {
    } finally {
      return repository
    }
  }
}

export function createStore(): TestStore {
  return new TestStore()
}

export function createState(entities: Entities): RootState {
  const state = {} as RootState

  for (const entity in entities) {
    state[entity] = { data: {} }

    state[entity].data = entities[entity]
  }

  return state
}

export function fillState(store: TestStore, entities: Entities): void {
  for (const entity in entities) {
    if (!store.state.entities[entity]) {
      store.state.entities[entity] = { data: {} }
    }

    store.state.entities[entity].data = entities[entity]
  }
}

export function assertState(store: TestStore, entities: Entities): void {
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
  ids.forEach((id) => (uuid as any).mockImplementationOnce(() => id))
}
