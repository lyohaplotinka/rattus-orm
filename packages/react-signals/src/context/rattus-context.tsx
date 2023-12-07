import type { Model, Repository } from '@rattus-orm/core'
import { Database } from '@rattus-orm/core'
import type { DataProvider } from '@rattus-orm/utils/sharedTypes'
import type { PropsWithChildren } from 'react'
import { createContext, useRef } from 'react'
import React from 'react'

import { ReactSignalsDataProvider } from '../data-provider/react-signals-data-provider'

export type RattusProviderProps = {
  connection?: string
}

export type RattusContextType = {
  $database: Database
  $databases: Record<string, Database>
  $repo<M extends typeof Model>(model: M, connection?: string): Repository<InstanceType<M>>
}

export const RattusContext = createContext<Partial<RattusContextType>>({ $database: undefined, $databases: undefined })

function createRattusContext(connectionName: string): RattusContextType {
  const dataProvider = new ReactSignalsDataProvider()
  const database = createDatabase(connectionName, dataProvider)
  const databases = {
    [connectionName]: database,
  }

  const storedRepos = new Map<string, Repository<any>>()

  return {
    $database: database,
    $databases: databases,
    $repo<M extends typeof Model>(model: M, connection = connectionName): Repository<InstanceType<M>> {
      if (storedRepos.has(model.entity)) {
        return storedRepos.get(model.entity) as Repository<InstanceType<M>>
      }

      let localDb: Database

      if (connection) {
        if (!(connection in databases)) {
          localDb = createDatabase(connection, dataProvider)
          localDb.start()
        } else {
          localDb = databases[connection]
        }
      } else {
        localDb = database
      }

      const repo = localDb.getRepository(model)
      storedRepos.set(model.entity, repo)

      return repo
    },
  }
}

function createDatabase(connectionName: string, dataProvider: DataProvider): Database {
  const database = new Database().setConnection(connectionName).setDataProvider(dataProvider)
  database.start()

  return database
}

export function RattusProvider({ connection = 'entities', children }: PropsWithChildren<RattusProviderProps>) {
  const rattusContext = useRef(createRattusContext(connection))

  return <RattusContext.Provider value={rattusContext.current}>{children}</RattusContext.Provider>
}
