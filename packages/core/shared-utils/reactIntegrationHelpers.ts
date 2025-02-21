import { createContext, useContext } from 'react'

import { Database } from '../src'
import { RattusOrmError } from './feedback'

export const RattusReactContext = createContext<Database>({} as Database)
export function reactUseDatabase(): Database {
  const ctxValue = useContext(RattusReactContext) as unknown

  if (!(ctxValue instanceof Database) || !ctxValue.isStarted()) {
    throw new RattusOrmError('Database is not valid', 'UseDatabaseHook')
  }

  return ctxValue
}
