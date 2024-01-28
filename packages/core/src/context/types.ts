import type { Database } from '@/database/database'
import type { DatabasePlugin } from '@/database/types'
import type { Repository } from '@/repository/repository'
import type { Constructor } from '@/types'

export type RattusOrmInstallerOptions = {
  connection?: string
  database?: Database
  plugins?: DatabasePlugin[]
  customRepositories?: Constructor<Repository>[]
}
