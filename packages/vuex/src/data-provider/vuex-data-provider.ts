import type { DataProvider, Elements, ModulePath, SerializedStorage, State } from '@rattus-orm/core'
import { DataProviderHelpers } from '@rattus-orm/core'
import type { GetterTree, Store } from 'vuex'

import type { Mutations } from './mutations'
import { destroy, flush, fresh, save } from './mutations'

export class VuexDataProvider extends DataProviderHelpers implements DataProvider {
  constructor(protected readonly store: Store<SerializedStorage>) {
    super()
  }

  public delete(module: ModulePath, ids: string[]): void {
    this.commit(module, 'delete', ids)
  }

  public flush(module: ModulePath): void {
    this.commit(module, 'flush')
  }

  public replace(module: ModulePath, records: Elements): void {
    this.commit(module, 'fresh', records)
  }

  public getModuleState(module: ModulePath): State {
    return this.store.getters[`${this.getModulePathString(module)}/getData`]
  }

  public insert(module: ModulePath, records: Elements): void {
    this.commit(module, 'insert', records)
  }

  public registerConnection(name: string) {
    if (this.isModuleRegistered([name, ''])) {
      return
    }
    this.store.registerModule(name, {
      namespaced: true,
      state: {},
      getters: this.createGetters<SerializedStorage>(),
    })

    this.markModuleAsRegistered([name, ''])
  }

  public registerModule(path: ModulePath, initialState: State = { data: {} }): void {
    if (this.isModuleRegistered(path)) {
      return
    }

    this.store.registerModule(
      path,
      {
        namespaced: true,
        mutations: this.createMutations(),
        getters: this.createGetters<State>(),
        state: initialState,
      },
      {
        preserveState: this.moduleDataExists(path),
      },
    )
    this.markModuleAsRegistered(path)
  }

  public save(module: ModulePath, records: Elements): void {
    this.commit(module, 'save', records)
  }

  public update(module: ModulePath, records: Elements): void {
    this.commit(module, 'update', records)
  }

  public hasModule(module: ModulePath): boolean {
    return this.isModuleRegistered(module)
  }

  public dump(): SerializedStorage {
    return JSON.parse(JSON.stringify(this.store.state))
  }

  public restore(data: SerializedStorage) {
    super.restore(data)
  }

  protected getModulePathString(modulePath: ModulePath): string {
    return typeof modulePath === 'string' ? modulePath : modulePath.join('/')
  }

  protected createMutations(): Mutations<State> {
    return {
      save,
      fresh,
      delete: destroy,
      flush,
      insert: save,
      update: save,
    }
  }

  protected createGetters<T>(): GetterTree<T, SerializedStorage> {
    return {
      getData: (state) => state,
    }
  }

  protected commit(module: ModulePath, name: keyof Mutations<State>, payload?: any): void {
    const type = ([] as string[]).concat(module, name as string).join('/')
    this.store.commit(type, payload)
  }

  protected moduleDataExists([connection, moduleName]: ModulePath): boolean {
    return !!this.store.state[connection]?.[moduleName]
  }
}
