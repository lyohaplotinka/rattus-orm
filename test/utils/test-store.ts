import { createDatabase } from '@/database/create-database'
import { Repository } from '@/repository/repository'
import { Entities, TestingStore } from '@func-test/utils/types'
import { DataProvider, ModulePath, State } from '@/data/types'
import type { Database } from '@/database/database'

export class TestStore implements TestingStore {
  public $database: Database
  public $databases: Record<string, Database> = {}

  constructor(protected readonly dataProvider: DataProvider) {
    this.createDatabase('entities', true)
  }

  public getRootState(connection = 'entities') {
    return this.dataProvider.dump()[connection]
  }

  public writeModule(path: ModulePath, data: Entities) {
    if (!this.hasModule(path)) {
      return this.dataProvider.registerModule(path, { data })
    }
    this.dataProvider.replace(path, data)
  }

  public hasModule(path: ModulePath): boolean {
    return this.dataProvider.hasModule(path)
  }

  public getModuleData(path: ModulePath): State {
    return this.dataProvider.getModuleState(path)
  }

  public $repo(model: any, connection?: string): Repository<any> {
    let database: Database

    if (connection) {
      if (!(connection in this.$databases)) {
        database = this.createDatabase(connection)
        database.start()
      } else {
        database = this.$databases[connection]
      }
    } else {
      database = this.$database
    }

    return database.getRepository(model)
  }

  protected createDatabase(connection: string, setToThis = false) {
    const db = createDatabase({ dataProvider: this.dataProvider, connection }).start()
    this.$databases[connection] = db
    if (setToThis) {
      this.$database = db
    }

    return db
  }
}
