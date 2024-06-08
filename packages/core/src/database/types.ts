import type { DataProvider } from '@/data/types'
import type { Database } from '@/database/database'
import type { MakeFieldsOptional } from '@/types'

export type DatabasePlugin = (database: Database) => void
export type CreateDatabaseParameters = {
  connection: string
  plugins: DatabasePlugin[]
  dataProvider: DataProvider
}
export type CreateDatabaseFunctionParameters = MakeFieldsOptional<CreateDatabaseParameters, 'plugins' | 'connection'>
