import type { ModulePath } from './types'

export class DataProviderHelpers {
  protected readonly registeredModules = new Set<string>()

  protected isModuleRegistered(module: ModulePath) {
    return this.registeredModules.has(this.getStringFromModulePath(module))
  }

  protected markModuleAsRegistered(module: ModulePath) {
    this.registeredModules.add(this.getStringFromModulePath(module))
  }

  protected getStringFromModulePath(module: ModulePath) {
    return Array.isArray(module) ? module.join('/') : module
  }
}
