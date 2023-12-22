import type { DataProvider, Elements, ModulePath, SerializedStorage, State } from '@rattus-orm/utils/sharedTypes'

import type { InternalListener, ModuleRegisterEventPayload, RattusEvent } from './types'
import { RattusEvents } from './types'

export class EventsDataProviderWrapper implements DataProvider {
  protected readonly internalListeners: Partial<Record<RattusEvent, Set<InternalListener>>> = {}

  constructor(protected readonly provider: DataProvider) {}

  public registerConnection(name: string): void {
    this.dispatchVoidEvent(RattusEvents.CONNECTION_REGISTER, name)
    return this.provider.registerConnection(name)
  }

  public dump(): SerializedStorage {
    return this.provider.dump()
  }

  public restore(data: SerializedStorage): void {
    return this.provider.restore(data)
  }

  public registerModule(modulePath: ModulePath, moduleInitialState?: State): void {
    const { path, initialState } = this.dispatchEventWithResult<ModuleRegisterEventPayload>(
      RattusEvents.MODULE_REGISTER,
      {
        path: modulePath,
        initialState: moduleInitialState,
      },
    )
    return this.provider.registerModule(path, initialState)
  }

  public getModuleState(module: ModulePath): State {
    return this.provider.getModuleState(module)
  }

  public hasModule(module: ModulePath): boolean {
    return this.provider.hasModule(module)
  }

  public save(module: ModulePath, records: Elements): void {
    return this.provider.save(module, this.dispatchEventWithResult(RattusEvents.SAVE, records))
  }

  public insert(module: ModulePath, records: Elements): void {
    return this.provider.insert(module, this.dispatchEventWithResult(RattusEvents.INSERT, records))
  }

  public replace(module: ModulePath, records: Elements): void {
    return this.provider.replace(module, this.dispatchEventWithResult(RattusEvents.REPLACE, records))
  }

  public update(module: ModulePath, records: Elements): void {
    return this.provider.update(module, this.dispatchEventWithResult(RattusEvents.UPDATE, records))
  }

  public delete(module: ModulePath, ids: string[]): void {
    this.provider.delete(module, this.dispatchEventWithResult(RattusEvents.DELETE, ids))
  }

  public flush(module: ModulePath): void {
    this.dispatchVoidEvent(RattusEvents.FLUSH, null)
    this.provider.flush(module)
  }

  public listen(event: RattusEvent, listener: InternalListener): () => void {
    if (!this.internalListeners[event]) {
      this.internalListeners[event] = new Set()
    }
    this.internalListeners[event]!.add(listener)
    return () => this.internalListeners[event]!.delete(listener)
  }

  protected dispatchVoidEvent<T = string>(event: RattusEvent, param: T) {
    this.getListenersForEvent(event).forEach((listener) => listener(param))
  }

  protected dispatchEventWithResult<T>(eventName: RattusEvent, param: T): T {
    return this.getListenersForEvent(eventName).reduce<T>((result, listener) => {
      result = listener(param) as T
      return result
    }, param)
  }

  protected getListenersForEvent(event: RattusEvent): InternalListener[] {
    const set = this.internalListeners[event]
    return set ? Array.from(set) : []
  }
}
