import { newDbSymbol } from '@/database/const'
import { getDatabaseManager } from '@/database/database-manager'
import { assert } from '@/support/utils'

import { Database } from './database'
import type { CreateDatabaseFunctionParameters } from './types'

export function createDatabase(params: CreateDatabaseFunctionParameters): Database {
  assert(!!params.dataProvider, ['dataProvider is required in parameters'])

  const db = new Database(newDbSymbol)
    .setDataProvider(params.dataProvider)
    .setConnection(params.connection ?? 'entities')
  for (const customRepo of params.customRepositories ?? []) {
    db.registerCustomRepository(customRepo)
  }
  for (const plugin of params.plugins ?? []) {
    db.use(plugin)
  }

  getDatabaseManager().add(db.getConnection(), db)

  return db
}
