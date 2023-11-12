import { Database } from '@/database/database'
import { ObjectDataProvider } from '@/data/object-data-provider'
import { Repository } from '@/repository/repository'
import { DataProvider } from '@/data/types'
import { TestingStore } from 'test/utils/types'

export class TestStore implements TestingStore {
  public $database
  public $databases: Record<string, Database> = {}

  constructor(protected readonly dataProvider: DataProvider) {
    this.$database = new Database().setDataProvider(dataProvider).setConnection('entities')
    this.$database.start()
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
        database = new Database().setDataProvider(new ObjectDataProvider()).setConnection(connection)
        database.start()
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
}
