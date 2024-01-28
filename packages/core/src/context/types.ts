import type { Database } from '../database/database'
import type { DatabasePlugin } from '../database/types'
import type { Constructor } from '../types'
import type { Repository } from '../repository/repository'

export type RattusOrmInstallerOptions = {
  connection?: string
  database?: Database
  plugins?: DatabasePlugin[]
  customRepositories?: Constructor<Repository>[]
}
