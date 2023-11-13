import { Database } from '@/database/database'
import { Repository } from '@/repository/repository'
import { DataProvider } from '@/data/types'
import { TestingStore } from 'test/utils/types'

export class TestStore implements TestingStore {
  public $database: Database
  public $databases: Record<string, Database> = {}

  constructor(protected readonly dataProvider: DataProvider) {
    this.createDatabase('entities', true)
  }

  public get state() {
    return {
      [this.$database.getConnection()]: this.$database.getDataProvider().getState('entities'),
    }
  }

  public $repo(modelOrRepository: any, connection?: string): Repository<any> {
    let database: Database

    if (connection) {
      if (!(connection in this.$databases)) {
        database = this.createDatabase(connection)
      } else {
        database = this.$databases[connection]
      }
    } else {
      database = this.$database
    }

    const repository = modelOrRepository._isRepository
      ? new modelOrRepository(database).initialize()
      : new Repository(database).initialize(modelOrRepository)

    try {
      database.register(repository.getModel())
    } catch (e) {
    } finally {
      return repository
    }
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
