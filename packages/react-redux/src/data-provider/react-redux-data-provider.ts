import { DataProviderHelpers } from '@rattus-orm/core'
import type { DataProvider, Elements, ModulePath, SerializedStorage, State } from '@rattus-orm/utils/sharedTypes'
import type { Reducer } from 'redux'
import { combineReducers } from 'redux'
import { type Store } from 'redux'

import { ReducerStore } from '../redux/reducer-store'
import { rattusReduxActions } from '../redux/types'

export class ReactReduxDataProvider extends DataProviderHelpers implements DataProvider {
  protected reducers = new Map<string, ReducerStore<any>>()

  constructor(
    protected readonly store: Store<Record<string, unknown>>,
    protected readonly sideReducers: Record<string, Reducer> = {},
  ) {
    super()
  }

  public registerConnection() {}

  public registerModule(path: ModulePath, initialState?: State) {
    const reducer = new ReducerStore(this.store, path, initialState)
    this.reducers.set(path.join('/'), reducer)
    this.rebuildReducers()
  }

  public dump(): SerializedStorage {
    const result: SerializedStorage = {}

    for (const storeId of this.reducers.keys()) {
      const modulePath = storeId.split('/') as ModulePath
      const [connection, moduleName] = modulePath
      if (!result[connection]) {
        result[connection] = {
          [moduleName]: this.getModuleState(modulePath),
        }
        continue
      }
      result[connection][moduleName] = this.getModuleState(modulePath)
    }

    return result
  }

  public save(module: ModulePath, records: Elements) {
    return this.internalSave(module, records)
  }

  public insert(module: ModulePath, records: Elements) {
    return this.internalSave(module, records)
  }

  public update(module: ModulePath, records: Elements) {
    return this.internalSave(module, records)
  }

  public replace(module: ModulePath, records: Elements) {
    return this.getModule(module).dispatch(rattusReduxActions.FRESH, records)
  }

  public delete(module: ModulePath, ids: string[]) {
    return this.getModule(module).dispatch(rattusReduxActions.DESTROY, ids)
  }

  public flush(module: ModulePath) {
    return this.getModule(module).dispatch(rattusReduxActions.FLUSH, null)
  }

  public getModuleState(module: ModulePath): State {
    const reducer = this.getModule(module)
    return this.store.getState()[reducer.getReducerPrefix()] as State
  }

  public hasModule(module: ModulePath): boolean {
    return this.reducers.has(module.join('/'))
  }

  protected rebuildReducers() {
    const reducers = {
      ...this.sideReducers,
    }
    for (const reducer of this.reducers.values()) {
      reducers[reducer.getReducerPrefix()] = reducer.getReducer() as Reducer
    }
    this.store.replaceReducer(combineReducers(reducers))
  }

  protected getModule(path: ModulePath) {
    if (!this.hasModule(path)) {
      throw new Error(`Module "${path.join('/')}" not found`)
    }
    return this.reducers.get(path.join('/'))!
  }

  protected internalSave(module: ModulePath, records: Elements) {
    this.getModule(module).dispatch(rattusReduxActions.SAVE, records)
  }
}
