import type { Elements, State } from '@rattus-orm/core/utils/sharedTypes'
import type { StoreDefinition } from 'pinia'

export type OrmGettersTree = {
  getStateData(state: State): State['data']
}

export type OrmActionsTree = {
  save(records: Elements): void
  fresh(records: Elements): void
  destroy(ids: string[]): void
  flush(): void
}

export type OrmStoreDefinition = StoreDefinition<string, State, OrmGettersTree, OrmActionsTree>
