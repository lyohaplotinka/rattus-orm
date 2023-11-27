import { Database } from '@/database/database'
import { Elements, ModulePath, State } from '@rattus-orm/utils'
import { Repository } from '@/repository/repository'

export type Entities = {
  [name: string]: Elements
}

export interface TestingStore {
  $database: Database
  $databases: Record<string, Database>
  $repo(modelOrRepository: any, connection?: string): Repository<any>

  // for tests
  getRootState(connection?: string): Record<string, any>
  writeModule(path: ModulePath, data: Entities): void
  hasModule(path: ModulePath): boolean
  getModuleData(path: ModulePath): State
}

export type TestingStoreFactory = () => TestingStore
