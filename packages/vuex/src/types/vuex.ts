import type { RattusContext } from '@rattus-orm/core/utils/rattus-context'

declare module 'vuex' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $rattusContext: RattusContext
  }
}
