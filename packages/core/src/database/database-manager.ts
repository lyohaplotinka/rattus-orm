import { BaseManager } from '@/support/base-manager'

import type { Database } from './database'

export class DatabaseManager extends BaseManager<Database> {
  public addDatabase(database: Database) {
    return this.add(database.getConnection(), database)
  }
}

export const databaseManager = new DatabaseManager()
