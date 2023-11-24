import type { DataProvider } from '@rattus-orm/core'
import type { Elements, ModulePath, RootState, State } from '@rattus-orm/core'
import type { GetterTree, Store } from 'vuex'

import type { Mutations } from './mutations'
import { destroy, flush, fresh, save } from './mutations'

export class VuexDataProvider implements DataProvider {
  protected readonly registeredModules = new Set<string>()

  constructor(protected readonly store: Store<RootState>) {}

  public delete(module: ModulePath, ids: string[]): void {
    this.commit(module, 'delete', ids)
  }

  public destroy(module: ModulePath, ids: string[]): void {
    this.commit(module, 'destroy', ids)
  }

  public flush(module: ModulePath): void {
    this.commit(module, 'flush')
  }

  public fresh(module: ModulePath, records: Elements): void {
    this.commit(module, 'fresh', records)
  }

  public getState(module: ModulePath): State {
    return this.store.getters[this.getModulePathString(module) + '/getData']
  }

  public insert(module: ModulePath, records: Elements): void {
    this.commit(module, 'insert', records)
  }

  public registerModule(path: ModulePath, initialState: State = { data: {} }): void {
    if (this.registeredModules.has(JSON.stringify(path))) {
      return
    }
    if (typeof path === 'string') {
      this.store.registerModule(path, {
        namespaced: true,
        state: {},
        getters: this.createGetters<RootState>(),
      })
      this.registeredModules.add(JSON.stringify(path))
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
    this.registeredModules.add(JSON.stringify(path))
  }

  public save(module: ModulePath, records: Elements): void {
    this.commit(module, 'save', records)
  }

  public update(module: ModulePath, records: Elements): void {
    this.commit(module, 'update', records)
  }

  protected getModulePathString(modulePath: ModulePath): string {
    return typeof modulePath === 'string' ? modulePath : modulePath.join('/')
  }

  protected createMutations(): Mutations<State> {
    return {
      save,
      fresh,
      destroy,
      flush,
      insert: save,
      update: save,
      delete: destroy,
    }
  }

  protected createGetters<T>(): GetterTree<T, RootState> {
    return {
      getData: (state) => state,
    }
  }

  protected commit(module: ModulePath, name: keyof Mutations<State>, payload?: any): void {
    const type = ([] as string[]).concat(module, name as string).join('/')
    this.store.commit(type, payload)
  }

  protected moduleDataExists(module: ModulePath): boolean {
    const moduleData = ([] as string[]).concat(module).reduce<Record<string, any>>((result, key) => {
      if (!(key in result)) {
        return {}
      }
      return result[key]
    }, this.store.state)
    return Object.keys(moduleData).length > 0
  }
}
