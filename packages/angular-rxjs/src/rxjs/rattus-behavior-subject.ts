import type { Database } from '@rattus-orm/core'
import { RattusEvents } from '@rattus-orm/core'
import { BehaviorSubject } from 'rxjs'

export class RattusBehaviorSubject<T> extends BehaviorSubject<T> {
  constructor(
    private valueGetter: () => T,
    private database: Database,
    private modelName: string,
  ) {
    super(valueGetter())
    this.watchChanges()
  }

  protected watchChanges() {
    this.database.on(RattusEvents.DATA_CHANGED, ({ path }) => {
      if (path[1] !== this.modelName) {
        return
      }
      this.next(this.valueGetter())
    })
  }
}
