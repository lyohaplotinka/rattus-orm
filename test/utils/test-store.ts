import { Database } from '@/database/database'
import { Repository } from '@/repository/repository'
import { DataProvider, ModulePath, State } from '@/data/types'
import { Entities, TestingStore } from 'test/utils/types'

export class TestStore implements TestingStore {
  public $database: Database
  public $databases: Record<string, Database> = {}

  constructor(protected readonly dataProvider: DataProvider) {
    this.createDatabase('entities', true)
  }

  public getRootState(connection = 'entities') {
    const db = this.$databases[connection]
    const entityNames = db.getEntityNames()
    const result: Record<string, any> = {}

    for (const entityName of entityNames) {
      if (entityName === connection) {
        continue
      }
      result[entityName] = this.getModuleData([connection, entityName])
    }

    return result
  }

  public writeModule(path: ModulePath, data: Entities) {
    if (!this.hasModule(path)) {
      return this.dataProvider.registerModule(path, { data })
    }
    this.dataProvider.fresh(path, data)
  }

  public hasModule(path: ModulePath): boolean {
    const data = this.dataProvider.getState(path)
    if (!data) {
      return false
    }
    return Object.keys(data).length > 0
  }

  public getModuleData(path: ModulePath): State {
    return this.dataProvider.getState(path)
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
    const db = new Database().setDataProvider(this.dataProvider).setConnection(connection)
    db.start()
    this.$databases[connection] = db
    if (setToThis) {
      this.$database = db
    }

    return db
  }
}
