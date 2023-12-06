import type { Signal } from '@preact/signals-react'
import { signal } from '@preact/signals-react'
import type { Elements, State } from '@rattus-orm/utils/sharedTypes'

export class SignalStore {
  protected signal: Signal<State>

  constructor(initialState: State = { data: {} }) {
    this.signal = signal(initialState)
  }

  public destroy(ids: string[]) {
    const newData: Elements = {}

    for (const [id, value] of Object.entries(this.peekData())) {
      if (ids.includes(id)) {
        continue
      }
      newData[id] = value
    }
    this.fresh(newData)
  }

  public flush() {
    this.signal.value = {
      data: {},
    }
  }

  public fresh(records: Elements) {
    this.signal.value = {
      data: records,
    }
  }

  public save(records: Elements) {
    this.signal.value = {
      data: {
        ...this.peekData(),
        ...records,
      },
    }
  }

  public getData() {
    return this.signal.value
  }

  protected peekData() {
    return this.signal.peek().data
  }
}
