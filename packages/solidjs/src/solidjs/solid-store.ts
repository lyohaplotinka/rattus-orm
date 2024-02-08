import type { Elements, State } from '@rattus-orm/core'
import type { Signal } from 'solid-js'
import { untrack } from 'solid-js'
import { createSignal } from 'solid-js'

export class SolidStore {
  protected signal: Signal<State>

  constructor(initialState?: State) {
    this.signal = createSignal<State>(initialState ?? { data: {} })
  }

  public get data(): State {
    return this.store()
  }

  protected get store() {
    return this.signal[0]
  }

  protected get setStoreFunction() {
    return this.signal[1]
  }

  public destroy(ids: string[]) {
    const state = untrack(this.store)
    for (const id of ids) {
      delete state.data[id]
    }
    this.setStoreFunction(state)
  }

  public save(records: Elements) {
    this.setStoreFunction({
      data: {
        ...untrack(this.store).data,
        ...records,
      },
    })
  }

  public flush() {
    this.setStoreFunction({ data: {} })
  }

  public fresh(records: Elements) {
    this.setStoreFunction({ data: records })
  }
}
