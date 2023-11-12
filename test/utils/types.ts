import { Database } from '@/database/database'
import { State } from '@/data/types'
import { Repository } from '@/repository/repository'

export interface TestingStore {
  $database: Database
  $databases: Record<string, Database>
  state: Record<string, State>
  $repo(modelOrRepository: any, connection?: string): Repository<any>
}
