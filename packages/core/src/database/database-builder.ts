import type { DataProvider } from '@/data/types'
import { Database } from '@/database/database'
import type { Model } from '@/model/Model'
import type { Constructor } from '@/types'

export class DatabaseBuilder {
  protected dataProviderInstance: DataProvider
  protected connectionName: string = 'entities'
  protected initModels: (typeof Model)[] = []

  public dataProvider(provider: Constructor<DataProvider>) {
    this.dataProviderInstance = new provider()
    return this
  }

  public connection(name: string = 'entities') {
    this.connectionName = name
    return this
  }

  public models(models: (typeof Model)[]) {
    this.initModels = models
    return this
  }

  public run() {
    const database = new Database()
    database.setStore(this.getDataProvider())
    database.setConnection(this.connectionName)
    database.start()

    this.initModels.forEach((model) => {
      database.register(model.newRawInstance())
    })

    return database
  }

  protected getDataProvider() {
    if (!this.dataProviderInstance) {
      throw new Error('Data provider is not set')
    }
    return this.dataProviderInstance
  }
}
