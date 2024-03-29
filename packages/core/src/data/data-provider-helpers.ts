import type { ModulePath, SerializedStorage, State } from '@/data/types'

export abstract class DataProviderHelpers {
  protected readonly registeredModules = new Set<string>()

  public restore(data: SerializedStorage) {
    for (const connectionName in data) {
      this.registerConnection(connectionName)
      for (const moduleName in data[connectionName]) {
        this.registerModule([connectionName, moduleName], data[connectionName][moduleName])
      }
    }
  }

  protected isModuleRegistered(module: ModulePath) {
    return this.registeredModules.has(this.getStringFromModulePath(module))
  }

  protected markModuleAsRegistered(module: ModulePath) {
    this.registeredModules.add(this.getStringFromModulePath(module))
  }

  protected getStringFromModulePath(module: ModulePath) {
    return module.join('/')
  }

  public abstract registerConnection(name: string): void
  public abstract registerModule(path: ModulePath, initialState?: State): void
}
