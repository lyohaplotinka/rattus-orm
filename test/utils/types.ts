import { Database } from '@/database/database'
import { Repository } from '@/repository/repository'
import { Elements, ModulePath, State } from '@/data/types'

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
