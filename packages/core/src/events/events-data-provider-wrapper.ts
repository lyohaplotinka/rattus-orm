import type { DataProvider, Elements, ModulePath, SerializedStorage, State } from '@rattus-orm/utils/sharedTypes'

import type {
  CancelSubscriptionCallback,
  DataChangedEventPayload,
  InternalListener,
  ModuleRegisterEventPayload,
  RattusEvent,
} from './types'
import { RattusEvents } from './types'

export class EventsDataProviderWrapper implements DataProvider {
  protected internalListeners: Partial<Record<RattusEvent, Set<InternalListener>>> = {}

  constructor(protected readonly provider: DataProvider) {}

  public registerConnection(name: string): void {
    this.dispatchVoidEvent(RattusEvents.CONNECTION_REGISTER, name, [name, name])
    return this.provider.registerConnection(name)
  }

  public dump(): SerializedStorage {
    return this.provider.dump()
  }

  public restore(data: SerializedStorage): void {
    this.provider.restore(data)
  }

  public registerModule(modulePath: ModulePath, moduleInitialState?: State): void {
    const { path, initialState } = this.dispatchEventWithResult<ModuleRegisterEventPayload>(
      RattusEvents.MODULE_REGISTER,
      {
        path: modulePath,
        initialState: moduleInitialState,
      },
      modulePath,
    )
    this.provider.registerModule(path, initialState)
  }

  public getModuleState(module: ModulePath): State {
    return this.provider.getModuleState(module)
  }

  public hasModule(module: ModulePath): boolean {
    return this.provider.hasModule(module)
  }

  public save(module: ModulePath, records: Elements): void {
    this.provider.save(module, this.dispatchEventWithResult(RattusEvents.SAVE, records, module))
    this.dispatchDataChangedEvent(module)
  }

  public insert(module: ModulePath, records: Elements): void {
    this.provider.insert(module, this.dispatchEventWithResult(RattusEvents.INSERT, records, module))
    this.dispatchDataChangedEvent(module)
  }

  public replace(module: ModulePath, records: Elements): void {
    this.provider.replace(module, this.dispatchEventWithResult(RattusEvents.REPLACE, records, module))
    this.dispatchDataChangedEvent(module)
  }

  public update(module: ModulePath, records: Elements): void {
    this.provider.update(module, this.dispatchEventWithResult(RattusEvents.UPDATE, records, module))
    this.dispatchDataChangedEvent(module)
  }

  public delete(module: ModulePath, ids: string[]): void {
    this.provider.delete(module, this.dispatchEventWithResult(RattusEvents.DELETE, ids, module))
    this.dispatchDataChangedEvent(module)
  }

  public flush(module: ModulePath): void {
    this.dispatchVoidEvent(RattusEvents.FLUSH, null, module)
    this.provider.flush(module)
    this.dispatchDataChangedEvent(module)
  }

  public listen(event: RattusEvent, listener: InternalListener): CancelSubscriptionCallback {
    if (!this.internalListeners[event]) {
      this.internalListeners[event] = new Set()
    }
    this.internalListeners[event]!.add(listener)
    return () => this.internalListeners[event]!.delete(listener)
  }

  public resetListeners(event?: RattusEvent) {
    if (event) {
      this.internalListeners[event] = new Set()
    } else {
      this.internalListeners = {}
    }
  }

  protected dispatchVoidEvent<T = string>(event: RattusEvent, param: T, modulePath: ModulePath) {
    this.getListenersForEvent(event).forEach((listener) => listener(param, modulePath))
  }

  protected dispatchEventWithResult<T>(eventName: RattusEvent, param: T, modulePath: ModulePath): T {
    return this.getListenersForEvent(eventName).reduce<T>((result, listener) => {
      result = listener(param, modulePath) as T
      return result
    }, param)
  }

  protected getListenersForEvent(event: RattusEvent): InternalListener[] {
    const set = this.internalListeners[event]
    return set ? Array.from(set) : []
  }

  protected dispatchDataChangedEvent(path: ModulePath) {
    this.dispatchVoidEvent<DataChangedEventPayload>(
      RattusEvents.DATA_CHANGED,
      {
        path,
        state: this.getModuleState(path),
      },
      path,
    )
  }
}
