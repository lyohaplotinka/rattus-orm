import type { Database } from '@/database/database'

export type DatabasePlugin = (database: Database) => void
