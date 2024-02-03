import type { Elements, State } from '@rattus-orm/core'
import { action, computed, makeObservable, observable } from 'mobx'

export default class MobxStore {
  protected state: State = { data: {} }

  constructor(initialState?: State) {
    makeObservable<this, 'state'>(this, {
      state: observable,
      save: action,
      flush: action,
      fresh: action,
      destroy: action,
      data: computed,
    })
    this.state = initialState ?? { data: {} }
  }

  public get data() {
    return this.state
  }

  public destroy(ids: string[]) {
    ids.forEach((id) => {
      delete this.state.data[id]
    })
  }

  public save(records: Elements) {
    this.state.data = {
      ...this.state.data,
      ...records,
    }
  }

  public flush() {
    this.state = {
      data: {},
    }
  }

  public fresh(records: Elements) {
    this.state = {
      data: records,
    }
  }
}
