import { BaseManager } from '../support/base-manager'
import type { Database } from './database'

export class DatabaseManager extends BaseManager<Database> {}

export const databaseManager = new DatabaseManager()
