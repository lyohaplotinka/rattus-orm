import type { Elements, State } from '@rattus-orm/utils'
import type { MutationTree } from 'vuex'

export interface Mutations<S extends State> extends MutationTree<S> {
  save(state: S, records: Elements): void
  insert(state: S, records: Elements): void
  update(state: S, records: Elements): void
  fresh(state: S, records: Elements): void
  delete(state: S, ids: string[]): void
  flush(state: S): void
}

/**
 * Commit `save` change to the store.
 */
export function save(state: State, records: Elements): void {
  state.data = { ...state.data, ...records }
}

/**
 * Commit `fresh` change to the store.
 */
export function fresh(state: State, records: Elements): void {
  state.data = records
}

/**
 * Commit `destroy` change to the store.
 */
export function destroy(state: State, ids: string[]): void {
  const data = {}

  for (const id in state.data) {
    if (!ids.includes(id)) {
      data[id] = state.data[id]
    }
  }

  state.data = data
}

/**
 * Commit `flush` change to the store.
 */
export function flush(state: State): void {
  state.data = {}
}
