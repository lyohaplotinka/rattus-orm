import { beforeEach, describe, expect, it } from 'vitest'
import { ObjectDataProvider } from '../src/data/object-data-provider'
import { createDatabase, Model, Repository } from '../src'
import { StringField } from '../src/attributes/field-types'
import { getDatabaseManager } from '../src/database/database-manager'
import { contextBootstrap } from '../shared-utils/integrationsHelpers'

class Email extends Model {
  public static entity = 'email'

  @StringField('')
  public id: string
}

class EmailRepository extends Repository<Email> {
  public use = Email

  public getAllButCool() {
    return this.all()
  }
}

describe('context.spec.ts', () => {
  beforeEach(() => getDatabaseManager().clear())

  it('createTestContext function returns correct context with default parameters', () => {
    contextBootstrap({ connection: 'entities' }, new ObjectDataProvider())

    expect(getDatabaseManager().getDatabase().isStarted()).toEqual(true)
    expect(getDatabaseManager().getDatabase().getConnection()).toEqual('entities')
  })

  it('respects connection name', () => {
    contextBootstrap({ connection: 'custom' }, new ObjectDataProvider())
    expect(getDatabaseManager().getDatabase().getConnection()).toEqual('custom')
  })

  it('respects custom created database', () => {
    const db = createDatabase({ connection: 'third', dataProvider: new ObjectDataProvider() })
    contextBootstrap({ database: db })

    expect(getDatabaseManager().getDatabase()).toEqual(db)
    expect(getDatabaseManager().getDatabase().getConnection()).toEqual('third')
    expect(getDatabaseManager().getDatabase().isStarted()).toEqual(false)
  })

  it('$repo method allows retrieve custom repos', () => {
    const db = createDatabase({
      dataProvider: new ObjectDataProvider(),
      customRepositories: [EmailRepository],
    }).start()
    contextBootstrap({ database: db })

    const repo = getDatabaseManager().getRepository<EmailRepository>(Email)
    expect(repo).toBeInstanceOf(EmailRepository)
    expect(() => repo.getAllButCool()).not.toThrowError()
  })
})
