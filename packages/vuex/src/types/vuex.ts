import type { Database, Model, Repository } from '@rattus-orm/core'

declare module 'vuex' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    /**
     * The default database instance.
     */
    $database: Database

    /**
     * Mapping of databases keyed on connection
     */
    $databases: { [key: string]: Database }

    /**
     * Get a new Repository instance for the given model.
     */
    $repo<M extends typeof Model>(model: M, connection?: string): Repository<InstanceType<M>>
  }
}
