import { Database } from '@rattus-orm/core'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'
import { RattusZodValidationPlugin } from '../src'

export const createDb = (strict: boolean | string[] = true) => {
  const db = new Database()
    .setDataProvider(new ObjectDataProvider())
    .setConnection('entities')
    .use(RattusZodValidationPlugin({ strict }))
  db.start()
  return db
}
