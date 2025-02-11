import { describe, expect, it } from 'vitest'
import { createRattusContext, RattusContext } from '../src/context/rattus-context'
import { ObjectDataProvider } from '../src/data/object-data-provider'
import { createDatabase, Model, Repository } from '../src'
import { StringField } from '../src/attributes/field-types'

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
  it('createTestContext function returns correct context with default parameters', () => {
    const context = createRattusContext({ connection: 'entities' }, new ObjectDataProvider())

    expect(context).toBeInstanceOf(RattusContext)
    expect(context.getDatabase().isStarted()).toEqual(true)
    expect(context.getDatabase().getConnection()).toEqual('entities')
  })

  it('respects connection name', () => {
    const context = createRattusContext({ connection: 'custom' }, new ObjectDataProvider())
    expect(context.getDatabase().getConnection()).toEqual('custom')
  })

  it('respects custom created database', () => {
    const db = createDatabase({ connection: 'third', dataProvider: new ObjectDataProvider() })
    const context = createRattusContext({ database: db })

    expect(context.getDatabase()).toEqual(db)
    expect(context.getDatabase().getConnection()).toEqual('third')
    expect(context.getDatabase().isStarted()).toEqual(false)
  })

  it('$repo method allows retrieve custom repos', () => {
    const db = createDatabase({
      dataProvider: new ObjectDataProvider(),
      customRepositories: [EmailRepository],
    }).start()
    const context = createRattusContext({ database: db })

    const repo = context.$repo<EmailRepository>(Email)
    expect(repo).toBeInstanceOf(EmailRepository)
    expect(() => repo.getAllButCool()).not.toThrowError()
  })
})
