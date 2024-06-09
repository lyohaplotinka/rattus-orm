import type { Constructor } from 'type-fest'

import type { DataProvider } from '@/data/types'
import type { Database } from '@/database/database'
import type { Repository } from '@/repository/repository'
import type { MakeRequired } from '@/types'

export type DatabasePlugin = (database: Database) => void
export type CreateDatabaseParameters = {
  connection: string
  plugins: DatabasePlugin[]
  dataProvider: DataProvider
  customRepositories: Constructor<Repository>[]
}
export type CreateDatabaseFunctionParameters = MakeRequired<CreateDatabaseParameters, 'dataProvider'>
