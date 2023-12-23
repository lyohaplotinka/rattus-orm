import type { Database } from './database'

export type DatabasePlugin = (db: Database) => void
